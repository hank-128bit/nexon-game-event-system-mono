export class EventServiceError extends Error {
  constructor(
    override readonly message: string,
    public readonly code = 500,
    public readonly service = 'event'
  ) {
    super(message);
  }
}
