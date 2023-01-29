import { PERMISSIONS_ERROR } from '../response-codes';

class PermissionError extends Error {
  statusCode:number = PERMISSIONS_ERROR;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}

export default PermissionError;
