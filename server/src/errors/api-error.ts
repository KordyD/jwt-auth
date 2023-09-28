export interface IAPIError extends Error {
  status: number;
  errors: string[];
}

export class APIError extends Error {
  public status;
  public errors;

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new APIError(401, 'Пользователь не авторизован');
  }
  static BadRequest(message: string, errors: string[] = []) {
    return new APIError(400, message, errors);
  }
}
