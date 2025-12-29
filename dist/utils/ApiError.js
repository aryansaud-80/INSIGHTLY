class ApiError extends Error {
    statusCode;
    message;
    success;
    errors;
    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        if (errors)
            this.errors = errors;
    }
}
export { ApiError };
//# sourceMappingURL=ApiError.js.map