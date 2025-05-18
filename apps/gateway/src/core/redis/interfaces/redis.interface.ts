export type SingleCommandResult =
  | string
  | number
  | boolean
  | Buffer
  | { [x: string]: string | Buffer }
  | { key: string | Buffer; element: string | Buffer }
  | (string | Buffer)[];

export type RedisJSONArray = Array<RedisJSON>;
export interface RedisJSONObject {
  [key: string]: RedisJSON;
  [key: number]: RedisJSON;
}
export declare type RedisJSON = null | boolean | number | string | Date | RedisJSONArray | RedisJSONObject;

export interface GetOptions {
  path?: string | Array<string>;
  INDENT?: string;
  NEWLINE?: string;
  SPACE?: string;
  NOESCAPE?: true;
}

export declare type RedisCommandRawReply = string | number | Buffer | null | undefined | Array<RedisCommandRawReply>;
export declare type RedisCommandArgument = string | Buffer;
export declare type RedisCommandArguments = Array<RedisCommandArgument> & {
  preserve?: unknown;
};

export interface ZMember {
  score: number;
  value: RedisCommandArgument;
}

export interface EvalOptions {
  keys?: Array<string>;
  arguments?: Array<string>;
}

export interface ZRangeByScoreOptions {
  LIMIT?: {
    offset: number;
    count: number;
  };
}

export type PubSubListener<RETURN_BUFFERS extends boolean = false> = <
  T extends RETURN_BUFFERS extends true ? Buffer : string,
>(
  message: T,
  channel: T
) => unknown;

export interface XAddOptions {
  NOMKSTREAM?: true;
  TRIM?: {
    strategy?: 'MAXLEN' | 'MINID';
    strategyModifier?: '=' | '~';
    threshold: number;
    limit?: number;
  };
}

export interface XReadGroupStream {
  key: RedisCommandArgument;
  id: RedisCommandArgument;
}
export interface XReadGroupOptions {
  COUNT?: number;
  BLOCK?: number;
  NOACK?: true;
}
