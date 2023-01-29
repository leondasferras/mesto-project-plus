import { AUTH_ERROR } from '../response-codes';

class AuthError extends Error {
  statusCode:number = AUTH_ERROR;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export default AuthError;
