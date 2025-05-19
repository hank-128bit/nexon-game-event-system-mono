export class RpcResponseError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: number,
    public readonly service?: 'auth' | 'event'
  ) {
    super(message);
  }
}
