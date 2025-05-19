import { ModuleMetadata } from '@nestjs/common';

export interface RedisOptions {
  /**
   * Cluster 모드 사용 여부 (default: false)
   */
  isCluster?: boolean;

  /**
   * @example
   * ex. non-cluster : 'redis://localhost:6379'
   * ex. cluster : 'redis://localhost:6379,redis://localhost:6380,redis://localhost:6381'
   */
  url: string;

  /**
   * ACL username ([see ACL guide](https://redis.io/topics/acl))
   */
  username?: string;
  /**
   * ACL password or the old "--requirepass" password
   */
  password?: string;

  /**
   * Connection Pool 최대 크기 (default: 30)
   */
  maxConnections?: number;

  /**
   * ex. true (default)
   * redis의 key에 대한 debug log를 출력할지 여부
   */
  enableDebug?: boolean;

  /**
   * 레디스 연결이 비정상적으로 끊어졌을 때
   * 설정된 재시도 횟수를 초과하면 프로세스를 종료할지 여부
   * 종료시 process.exit(1) 호출함.
   * 기본값: false
   */
  exitProcessOnConnectionError?: boolean;

  socket?: {
    /**
     * Connection Timeout (in milliseconds)
     */
    connectTimeout?: number;
    /**
     * Toggle [`Nagle's algorithm`](https://nodejs.org/api/net.html#net_socket_setnodelay_nodelay)
     */
    noDelay?: boolean;
    /**
     * Toggle [`keep-alive`](https://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay)
     */
    keepAlive?: number | false;

    /**
     * 연결이 끊어졌을 때 재시도 횟수.
     * @default 10
     * @example
     * retryCount: 10
     * retryCount: 0 // 재시도 하지 않음
     */
    retryCount?: number;

    /**
     * 숫자를 사용하면 해당 숫자(ms) 만큼 기다린 후 연결을 재시도한다.
     * 함수를 사용하면 함수의 리턴값 만큼 기다린 후 연결을 재시도한다.
     * 함수 사용 예: (currentRetries) => Math.min(currentRetries * 50, 500);
     */
    interval?: number | ((currentRetries: any) => number);
  };
}

export type RedisOptionsFactory = (...args: any) => Promise<RedisOptions> | RedisOptions;

export interface RedisAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: RedisOptionsFactory;
  /**
   * If true, the module will be global-scoped.
   * @default true
   */
  isGlobal?: boolean;
}

export interface RedisFeatureAsyncOptions extends Omit<RedisAsyncOptions, 'isGlobal'> {
  /* 여러 레디스 연결을 사용할 경우 고유한 커넥션 이름
   * 단일 연결 시 생략 가능
   * 여러 개 연결 시 반드시 명시해야 함.
   */
  connectionName: string;
}
