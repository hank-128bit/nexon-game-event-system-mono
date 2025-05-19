import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { createPool, Pool } from 'generic-pool';
import {
  createClient,
  RedisClientType,
  RedisClusterType,
  RedisDefaultModules,
} from 'redis';
import {
  GetOptions,
  RedisCommandArguments,
  RedisJSON,
  SingleCommandResult,
  ZMember,
  EvalOptions,
  ZRangeByScoreOptions,
  PubSubListener,
  XReadGroupStream,
  XReadGroupOptions,
  XAddOptions,
} from './interfaces/redis.interface';
import { REDIS_OPTIONS, RETRY_EXCEEDED_ERROR } from './constant';
import { RedisOptions } from './interfaces/redis-options.interface';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger: Logger = new Logger(RedisService.name);
  private readonly maxClients;
  private readonly redis: RedisClientOptions;
  private pool: Pool<RedisClientType> = {} as Pool<RedisClientType>;
  private initializing = false;
  private readonly exitProcessOnConnectionError: boolean;
  public isAvailable = true;

  constructor(
    @Inject(REDIS_OPTIONS)
    public readonly RedisOptions: RedisOptions
  ) {
    this.maxClients = this.RedisOptions.maxConnections || 30;
    this.exitProcessOnConnectionError =
      this.RedisOptions.exitProcessOnConnectionError || false;

    const reconnectStrategy = (retries: number, _cause: Error) => {
      const retryCount = this.RedisOptions.socket?.retryCount;
      const interval = this.RedisOptions.socket?.interval;
      if (retryCount === 0) {
        throw Error('REDIS_CONNECTION_ERROR');
      }
      if (retryCount && retries >= retryCount) {
        throw Error(RETRY_EXCEEDED_ERROR);
      }

      if (typeof interval === 'function') {
        return interval(retries);
      }

      return interval;
    };

    this.redis = {
      url: `${this.RedisOptions.url}`,
      username: this.RedisOptions.username,
      password: this.RedisOptions.password,
      socket: {
        reconnectStrategy,
      },
    } as RedisClientOptions;
  }

  public async onModuleInit() {
    await this.init();
    this.logger.log(
      `\nRedis Connection Checking...\n${await this.sendCommand([
        'info',
        'clients',
      ])}`
    );
    this.logger.log(
      `\nRedis Connection Checking...\n${await this.sendCommand([
        'info',
        'server',
      ])}`
    );
  }

  private async initConfig(client: RedisClientType) {
    const fixedNotifyKeyEventParam = '$xK';
    const nke: any = await client.sendCommand([
      'config',
      'get',
      'notify-keyspace-events',
    ]);
    if (nke[1] !== fixedNotifyKeyEventParam) {
      await client.sendCommand([
        'config',
        'set',
        'notify-keyspace-events',
        'K$x',
      ]);
    }
  }

  public async createRawConnection(): Promise<RedisClientType> {
    const options = this.redis;
    const client = createClient(
      options as RedisClientOptions
    ) as RedisClientType;

    client.on('error', (err) => {
      this.isAvailable = false;
      console.error(err.message);
      if (
        err.message === RETRY_EXCEEDED_ERROR ||
        this.exitProcessOnConnectionError
      ) {
        process.exit(1);
      }
    });
    client.on('connect', () => {
      this.logger.debug('Redis[RAW] connected');
    });
    client.on('reconnecting', () => {
      this.isAvailable = false;
      this.logger.debug('Redis[RAW] reconnecting');
    });
    client.on('ready', async () => {
      this.isAvailable = true;
      this.logger.debug('Redis[RAW] Ready');
    });
    await client.connect();
    return client;
  }

  public async destoryRawConnection(client: RedisClientType): Promise<void> {
    await client.quit();
  }
  public async acquireConnection(): Promise<RedisClientType> {
    const pool = this.pool;
    const client = await pool.acquire();
    return client;
  }
  public async releaseConnection(client: RedisClientType): Promise<void> {
    const pool = this.pool;
    await pool.release(client);
  }

  private async createConnection(options: RedisClientOptions) {
    if (!this.initializing) {
      this.initializing = true;
    }
    const client = createClient(options as RedisClientOptions);

    client.on('error', (err) => {
      this.isAvailable = false;
      console.error(err.message);
      if (
        err.message === RETRY_EXCEEDED_ERROR ||
        this.exitProcessOnConnectionError
      ) {
        process.exit(1);
      }
    });
    client.on('connect', () => {
      this.logger.debug('Redis connected');
    });
    client.on('reconnecting', () => {
      this.isAvailable = false;
      this.logger.debug('Redis reconnecting');
    });
    client.on('ready', async () => {
      this.isAvailable = true;
      this.logger.debug('Redis Ready');
    });
    await client.connect();
    this.initializing = false;
    return client;
  }

  private async destroyConnection(client: any) {
    await client.quit();
  }

  private async init(): Promise<void> {
    const options = this.redis;

    const poolOptions = {
      create: () =>
        this.createConnection(options).catch((err) => {
          console.error(err);
          throw Error(err);
        }),
      destroy: (client: any) => this.destroyConnection(client),
    };

    const poolConfig = {
      max: this.maxClients,
    };

    const pool = createPool(poolOptions, poolConfig);

    const client = await pool.acquire();
    await this.initConfig(client);
    await pool.release(client as RedisClientType<RedisDefaultModules>);
    this.pool = pool;
  }

  private async execute<T>(
    callback: (
      client:
        | RedisClientType<RedisDefaultModules>
        | RedisClusterType<RedisDefaultModules>
    ) => Promise<T>
  ): Promise<T> {
    const pool = this.pool;
    const client = await pool.acquire();
    try {
      const res = await callback(client);
      return res;
    } catch (e) {
      if (this.RedisOptions.enableDebug) {
        console.log(e);
      }
      throw e;
    } finally {
      await this.pool.release(client as RedisClientType<RedisDefaultModules>);
    }
  }

  public async evalsha(hash: string, evalOptions: EvalOptions) {
    return await this.execute((client) =>
      (client as any).EVALSHA(hash, evalOptions)
    );
  }

  public async eval(script: string, evalOptions: EvalOptions) {
    return await this.execute((client) =>
      (client as any).EVAL(script, evalOptions)
    );
  }

  /**
   * 명령어 별 리턴 타입이 다양하므로 주의하여 사용해야 함.
   * @param args : 커맨드 배열
   * @returns
   */
  public async sendCommand(args: RedisCommandArguments): Promise<any> {
    const conn = await this.pool.acquire();
    const res = await conn.sendCommand(args);
    await this.pool.release(conn);
    return res;
  }

  /**
   * Execute a redis JSON.SET command
   *
   * @param key - The list key
   * @param path - JsonPath형태의 문자열(set할 경로)
   * @param jsonObj - Object
   */
  public async jsonSet(
    key: string,
    path: string,
    jsonObj: RedisJSON
  ): Promise<'OK' | null> {
    return this.execute((client) =>
      (client as any).json.SET(key, path, jsonObj)
    );
  }

  /**
   * Execute a redis JSON.GET command
   *
   * @param key - The list key
   * @param getOptions - json.get에 사용될 옵션 파라미터
   */
  public async jsonGet(
    key: string,
    getOptions: GetOptions
  ): Promise<RedisJSON | null> {
    return this.execute((client) => (client as any).json.GET(key, getOptions));
  }

  /**
   * Execute a redis JSON.DEL command
   *
   * @param key - The list key
   * @param path - JsonPath 형태의 문자열(del할 경로)
   */
  public async jsonDel(key: string, path: string): Promise<number> {
    return this.execute((client) => (client as any).json.DEL(key, path));
  }

  /**
   *
   * @param key 데이터 키
   * @param path JSON경로
   * @returns 해당 키 및 경로에 있는 데이터의 key배열
   */
  public async jsonObjKeys(
    key: string,
    path: string
  ): Promise<Array<string> | null | Array<Array<string> | null>> {
    return this.execute((client) => (client as any).json.OBJKEYS(key, path));
  }

  public async jsonMget(
    keys: string[],
    path: string
  ): Promise<Array<RedisJSON | null>> {
    return this.execute((client) => (client as any).json.MGET(keys, path));
  }

  public async jsonStrlen(key: string, path: string): Promise<number> {
    return this.execute((client) => (client as any).json.STRLEN(key, path));
  }

  public async jsonArrlen(
    key: string,
    path: string
  ): Promise<number | Array<number>> {
    return this.execute((client) => (client as any).json.ARRLEN(key, path));
  }

  public async jsonArrAppend(
    key: string,
    path: string,
    value: Record<string, any>
  ): Promise<string> {
    return this.execute((client) =>
      (client as any).json.ARRAPPEND(key, path, value)
    );
  }

  /**
   * Execute a redis xadd command
   *
   * @param key - The list key
   * @param id - 보통 * 사용
   * @param message - json형태로 메세지 저장
   */
  public async xadd(
    key: string,
    id: string,
    message: Record<string, string | Buffer>,
    options?: XAddOptions
  ): Promise<string> {
    return this.execute((client) =>
      (client as any).XADD(key, id, message, options)
    );
  }

  public async xgroupCreate(
    key: string,
    group: string,
    id: string,
    mkstream: boolean
  ) {
    return this.execute((client) =>
      (client as any).XGROUP_CREATE(key, group, id, { MKSTREAM: mkstream })
    );
  }

  public async xReadGroup(
    group: string,
    consumer: string,
    streams: Array<XReadGroupStream>,
    options?: XReadGroupOptions
  ) {
    return this.execute((client) =>
      (client as any).XREADGROUP(group, consumer, streams, options)
    );
  }

  /**
   * Execute a redis xtrim command
   *
   * @param key - The list key
   * @param threshold - 해당 숫자만큼 남기고 과거 데이터 잘라냄
   */
  public async xtrimMaxlen(key: string, threshold: number) {
    return this.execute((client) =>
      (client as any).XTRIM(key, 'MAXLEN', threshold)
    );
  }

  /**
   * Execute a redis xtrim command
   *
   * @param key - The list key
   * @param minId - 밀리초타임스탬프, 해당 타임스탬프 이전 데이터 잘라냄
   */
  public async xtrimMinId(key: string, minId: number) {
    return this.execute((client) => (client as any).XTRIM(key, 'MINID', minId));
  }

  public async xrevrange(
    key: string,
    start: string,
    end: string,
    options?: { COUNT?: number }
  ): Promise<any[]> {
    return this.execute((client) =>
      (client as any).XREVRANGE(key, start, end, options)
    );
  }

  /**
   * Execute a redis BLPOP command
   *
   * @param key - The list key
   */
  public async blpop(
    key: string
  ): Promise<{ key: string; element: SingleCommandResult }> {
    return this.execute((client) => (client as any).BLPOP(key, 0));
  }

  /**
   * Execute a redis BRPOP command
   *
   * @param key - The list key
   */
  public async brpop(
    key: string
  ): Promise<{ key: string; element: SingleCommandResult }> {
    return this.execute((client) => (client as any).BRPOP(key, 0));
  }

  /**
   * Execute a redis DEL command
   *
   * @param key - The key of the value you wish to delete
   */
  public async del(key: string): Promise<number> {
    return this.execute((client) => (client as any).DEL(key));
  }

  /**
   * Execute a redis EXPIRE command
   *
   * @param key - A key to assign value to
   * @param ttl - TTL in seconds
   */
  public async expire(key: string, ttl: number): Promise<boolean> {
    return this.execute((client) => (client as any).EXPIRE(key, ttl));
  }

  /**
   * Execute a redis GET command
   *
   * @param key - The key of the value you wish to get
   */
  public async get(key: string): Promise<string> {
    return this.execute((client) => (client as any).GET(key));
  }

  /**
   * Execute a redis HDEL command
   *
   * @param key - The key of the value you wish to delete
   * @param fields - Array of additional field names to be deleted
   */
  public async hdel(key: string, fields: Array<string>): Promise<number> {
    return this.execute((client) => (client as any).HDEL(key, fields));
  }

  /**
   * Execute a redis HGET command
   *
   * @param key - The key of the hash you wish to get
   * @param field - The field name to retrieve
   */
  public async hget(key: string, field: string): Promise<string> {
    return this.execute((client) => (client as any).HGET(key, field));
  }

  /**
   * Execute a redis HMGET command
   *
   * @param key - The key of the hash you wish to get
   * @param field - The field name to retrieve
   */
  public async hmget(key: string, fields: string[]): Promise<string[]> {
    return this.execute((client) => (client as any).HMGET(key, fields));
  }

  /**
   * Execute a redis HSCAN command
   *
   * @param key - The key of the hash you wish to get
   * @param match - The match pattern to use
   * @param count - The number of keys to return
   */
  public async hscan(
    key: string,
    match: string,
    count: number
  ): Promise<{ cursor: number; tuples: [{ field: string; value: string }] }> {
    return this.execute((client) =>
      (client as any).HSCAN(key, 0, {
        MATCH: match,
        COUNT: count,
      })
    );
  }

  /**
   * Execute a redis HGETALL command
   *
   * @param key - The key of the hash you wish to get
   */
  public async hgetall(key: string): Promise<{ [index: string]: string }> {
    return this.execute((client) => (client as any).HGETALL(key));
  }

  /**
   * Execute a redis HSET command
   *
   * @param key - A key to assign the hash to
   * @param field - Name of the field to set
   * @param data - Value to assign to hash
   */
  public async hset(key: string, field: string, data: string): Promise<number> {
    return this.execute((client) => (client as any).HSET(key, field, data));
  }

  /**
   * Redis HMSET과 EXPIRE를 원자적으로 수행
   * @param key Redis 키
   * @param hashData 해시 데이터 (key-value 형태)
   * @param ttl 만료 시간 (초)
   */
  public async hmsetWithExpire(
    key: string,
    hashData: Record<string, any>,
    ttl: number
  ): Promise<void> {
    const script = `
      redis.call('HMSET', KEYS[1], unpack(ARGV, 1, #ARGV - 1))
      redis.call('EXPIRE', KEYS[1], tonumber(ARGV[#ARGV]))
    `;

    const keys = [key];
    const args = [];
    for (const [field, value] of Object.entries(hashData)) {
      args.push(
        field,
        typeof value === 'string' ? value : JSON.stringify(value)
      );
    }
    args.push(String(ttl));

    const evalOptions: EvalOptions = {
      keys,
      arguments: args,
    };

    await this.eval(script, evalOptions);
  }

  /**
   * Execute a redis HSET command for multiple fields and values
   *
   * @param key - A key to assign the hash to
   * @param arg - Object containing fields and values to set
   */
  public async hmset(
    key: string,
    object: { [field: string]: string }
  ): Promise<number> {
    return this.execute((client) => (client as any).HSET(key, object));
  }

  /**
   * Returns the number of fields contained in the hash stored at key.
   * @param key
   * @returns number of fields
   */
  public async hlen(key: string): Promise<number> {
    return this.execute((client) => (client as any).HLEN(key));
  }

  /**
   * execute a redis zscan command
   * @param key 사용할 키
   * @param match 필터링할 패턴
   * @param count 한번에 가져올 갯수 (기본값: 100)
   * @returns { cursor: number; members: [{ field: string; value: string }] }
   */
  public async zscan(
    key: string,
    match: string,
    count = 100
  ): Promise<{ cursor: number; members: [{ field: string; value: string }] }> {
    return this.execute((client) =>
      (client as any).ZSCAN(key, 0, {
        MATCH: match,
        COUNT: count,
      })
    );
  }

  public async zrank(
    key: string,
    member: string
  ): Promise<number | null | undefined> {
    return this.execute((client) => (client as any).ZRANK(key, member));
  }

  public async zincrby(
    key: string,
    increment: number,
    member: string
  ): Promise<number> {
    return this.execute((client) =>
      (client as any).ZINCRBY(key, increment, member)
    );
  }

  public async zrem(key: string, member: string): Promise<number> {
    return this.execute((client) => (client as any).ZREM(key, member));
  }

  public async zcount(
    key: string,
    min: string | number,
    max: string | number
  ): Promise<number> {
    return this.execute((client) => (client as any).ZCOUNT(key, min, max));
  }

  public async zcard(key: string): Promise<number> {
    return this.execute((client) => (client as any).ZCARD(key));
  }

  public async zrevrange(
    key: string,
    start: number,
    stop: number
  ): Promise<ZMember[]> {
    const memberCount = await this.zcount(key, '-inf', '+inf');
    if (memberCount === 0) {
      return [];
    }
    const rangeStartCount = memberCount - stop - 1;
    const rangeStopCount = memberCount - start - 1;
    const rangeWithScore = await this.zrangeWithscore(
      key,
      rangeStartCount < 0 ? 0 : rangeStartCount,
      rangeStopCount < 0 ? 0 : rangeStopCount
    );
    return rangeWithScore.reverse();
  }

  public async zrangeByScore(
    key: string,
    min: number | string,
    max: number | string,
    offset: number,
    limit: number
  ): Promise<ZMember[]> {
    const zrangeOption: ZRangeByScoreOptions = {
      LIMIT: {
        offset: offset,
        count: limit,
      },
    };
    return this.execute((client) =>
      (client as any).ZRANGEBYSCORE_WITHSCORES(key, min, max, zrangeOption)
    );
  }

  public async zscore(key: string, member: string): Promise<number> {
    return this.execute((client) => (client as any).ZSCORE(key, member));
  }

  public async zrevrank(key: string, member: string): Promise<number> {
    return this.execute((client) => (client as any).ZREVRANK(key, member));
  }

  public async zrangeWithscore(
    key: string,
    start: string | number,
    stop: string | number
  ): Promise<ZMember[]> {
    return this.execute((client) =>
      (client as any).ZRANGE_WITHSCORES(key, start, stop)
    );
  }

  public async zrange(
    key: string,
    start: string | number,
    stop: string | number
  ): Promise<string[]> {
    return this.execute((client) => (client as any).ZRANGE(key, start, stop));
  }

  public async zadd(
    key: string,
    score: string | number,
    member: string
  ): Promise<number> {
    return this.execute((client) =>
      (client as any).ZADD(key, { score: +score, value: member })
    );
  }

  public async zadds(key: string, members: ZMember[]): Promise<number> {
    return this.execute((client) => (client as any).ZADD(key, members));
  }

  public async zremrangebyscore(
    key: string,
    min: string | number,
    max: string | number
  ): Promise<number> {
    return this.execute((client) =>
      (client as any).ZREMRANGEBYSCORE(key, min, max)
    );
  }

  public async zrandmember(key: string, count: number): Promise<string[]> {
    return this.execute((client) =>
      (client as any).ZRANDMEMBER_COUNT(key, count)
    );
  }

  /**
   * Execute a redis SADD command
   * @param key
   * @param values
   * @returns
   */
  public async sadd(key: string, values: string[]): Promise<number> {
    return this.execute((client) => (client as any).SADD(key, values));
  }

  /**
   * Execute a redis SMEMBERS command
   * @param key
   * @returns
   */
  public async smembers(key: string): Promise<string[]> {
    return this.execute((client) => (client as any).SMEMBERS(key));
  }

  /**
   * Execute a redis SREM command
   * @param key
   * @param values
   * @returns
   */
  public async srem(key: string, values: string[]): Promise<number> {
    return this.execute((client) => (client as any).SREM(key, values));
  }

  /**
   * Execute a redis SCARD command
   * @param key
   * @returns
   */
  public async scard(key: string): Promise<number> {
    return this.execute((client) => (client as any).SCARD(key));
  }

  /**
   * Execute a redis SINTER command
   * @param keys
   * @returns
   */
  public async sinter(keys: string[]): Promise<string[]> {
    return this.execute((client) => (client as any).SINTER(keys));
  }

  /**
   * Execute a redis SISMEMBER command
   * @param key
   * @param value
   * @returns
   */
  public async sismember(key: string, value: string): Promise<boolean> {
    return this.execute((client) => (client as any).SISMEMBER(key, value));
  }

  /**
   * Execute a redis INCR command
   *
   * @param key - A key whose value you wish to increment
   */
  public async incr(key: string): Promise<number> {
    return this.execute((client) => (client as any).INCR(key));
  }

  /**
   * Execute a redis LPUSH command
   *
   * @param key - The list key
   * @param data - Value to assign to the list
   */
  public async lpush(key: string, data: string): Promise<number> {
    return this.execute((client) => (client as any).LPUSH(key, data));
  }

  /**
   * Execute a redis RPUSH command
   *
   * @param key - The list key
   * @param data - Value to assign to the list
   */
  public async rpush(key: string, data: string): Promise<number> {
    return this.execute((client) => (client as any).RPUSH(key, data));
  }

  /**
   * Execute a redis LTRIM command
   *
   * @param key - The list key
   */
  public async ltrim(key: string, start: number, end: number): Promise<number> {
    return this.execute((client) => (client as any).LTRIM(key, start, end));
  }

  /**
   * Execute a redis LRANGE command
   *
   * @param key - The list key
   */
  public async lrange(key: string, start = 0, end = -1): Promise<string[]> {
    return this.execute((client) => (client as any).LRANGE(key, start, end));
  }

  /**
   * Execute a redis SET command
   *
   * @param key - A key to assign value to
   * @param data - Value to assign to key
   * @param ttl - TTL (Time to Live) in seconds
   */
  public async set(
    key: string,
    data: string | number,
    ttl = 0
  ): Promise<string | null> {
    return this.execute((client) =>
      (client as any).SET(key, data, ttl ? { EX: ttl } : undefined)
    );
  }

  /**
   * Execute a redis SETNX command
   *
   * @param key - A key to assign value to
   * @param data - Value to assign to key
   * @returns
   */
  public async setNx(key: string, data: string | number): Promise<number> {
    return this.execute((client) => (client as any).SETNX(key, data));
  }

  /**
   * 다중 Set 키 생성
   * @param data
   * @returns
   */
  public async setMultiple(
    data: Array<{ key: string; value: string | number; ttl: number }>
  ): Promise<string> {
    const script = `
      for i = 1, #ARGV, 3 do
        local key = ARGV[i]
        local value = ARGV[i+1]
        local ttl = tonumber(ARGV[i+2])
        if ttl and ttl > 0 then
          redis.call("SET", key, value, "EX", ttl)
        end
      end
      return "OK"
    `;

    const args = data.flatMap((item) => [
      item.key,
      `${item.value}`,
      `${item.ttl}`,
    ]);
    const evalOptions: EvalOptions = {
      arguments: args,
    };

    const result = await this.eval(script, evalOptions);
    return result as string;
  }

  /**
   * Drain the pool and close all connections to Redis.
   */
  public async shutdown(): Promise<void> {
    await this.pool.drain();
    await this.pool.clear();
  }

  /**
   * Execute a redis TTL command
   *
   * @param {string} key - A key whose TTL(time-to-expire) will be returned
   */
  public async ttl(key: string): Promise<number> {
    return this.execute((client) => (client as any).TTL(key));
  }

  public async type(key: string): Promise<string> {
    return this.execute((client) => (client as any).TYPE(key));
  }

  /**
   * The user should be aware that if the same existing key is mentioned in the arguments multiple times,
   * it will be counted multiple times. So if somekey exists, EXISTS somekey somekey will return 2.
   * @param key
   * @returns Returns if key exists.
   */
  public async exists(key: string): Promise<number> {
    return this.execute((client) => (client as any).EXISTS(key));
  }

  public async psubscribe<T extends boolean = false>(
    patterns: string | Array<string>,
    listener: PubSubListener<T>,
    bufferMode?: T
  ): Promise<void> {
    const conn = await this.createConnection(this.redis);
    return conn.pSubscribe(patterns, listener, bufferMode);
  }

  public async renameNx(from: string, to: string) {
    return this.execute((client) => (client as any).renameNX(from, to));
  }

  public async rename(from: string, to: string) {
    return this.execute((client) => (client as any).rename(from, to));
  }

  //// DEPRECATED ////

  // 레디스 클러스터는 스크립트 로드를 지원하지 않음
  // async scriptLoad(script: string) {
  //   const conn = await this.pool.acquire();
  //   this.conn.sendCommand()
  //   return this.execute((client) => client.SCRIPT_LOAD(script));
  // }

  // /**
  //  * Execute a redis KEYS command
  //  *
  //  * @param key - The prefix of the keys to return
  //  */
  // async keys(key: string): Promise<Array<string>> {
  //   return this.execute((client) => (client as any).KEYS(key), );
  // }

  // async scan(
  //   cursor: number,
  //   match: string,
  //   count?: number,
  // ): Promise<{ cursor: number; keys: string[] }> {
  //   const scanOption = {
  //     MATCH: match,
  //     COUNT: count,
  //   };
  //   return this.execute((client) =>
  //     (client as any).SCAN(cursor, scanOption),
  //   );
  // }
}
