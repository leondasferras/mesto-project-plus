import { CONFLICTING_REQUEST_ERROR } from '../response-codes';

class ConflictingRequestError extends Error {
  statusCode:number = CONFLICTING_REQUEST_ERROR;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictingRequestError.prototype);
  }
}

export default ConflictingRequestError;
