interface CIC {
  statusCode:number
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
