export interface IAPIError extends Error {
  status: number;
  errors: string[];
}

export class APIError extends Error {
  public status;
  public errors;

  constructor(status: number, message: string, errors: Object[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new APIError(401, 'User is not authorized');
  }
  static BadRequest(message: string, errors: Object[] = []) {
    return new APIError(400, message, errors);
  }
}
