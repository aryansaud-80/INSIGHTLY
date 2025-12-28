class ApiError extends Error {
    statusCode;
    message;
    success;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
    }
}
export { ApiError };
//# sourceMappingURL=ApiError.js.map