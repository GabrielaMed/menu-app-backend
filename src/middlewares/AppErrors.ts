export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly errorType: string;

  constructor(message: string, statusCode = 400, errorType = 'unknow') {
    this.message = message;
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}
