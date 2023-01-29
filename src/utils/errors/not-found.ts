import { NOT_FOUND_ERROR } from '../response-codes';

class NotFoundError extends Error {
  statusCode:number = NOT_FOUND_ERROR;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;
