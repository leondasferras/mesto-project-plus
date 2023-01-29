import { INCORRECT_DATA_ERROR } from '../response-codes';

class IncorrectDataError extends Error {
  statusCode:number = INCORRECT_DATA_ERROR;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, IncorrectDataError.prototype);
  }
}

export default IncorrectDataError;
