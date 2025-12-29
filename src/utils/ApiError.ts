class ApiError extends Error {
  statusCode: number;
  message: string;
  success: boolean;
  errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    if (errors) this.errors = errors;
  }
}

export { ApiError };
