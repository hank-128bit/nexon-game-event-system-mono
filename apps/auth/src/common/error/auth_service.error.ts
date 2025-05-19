export class AuthServiceError extends Error {
  constructor(
    override readonly message: string,
    public readonly code = 500,
    public readonly service = 'auth'
  ) {
    super(message);
  }
}
