declare class ApiError extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    constructor(statusCode: number, message: string);
}
export { ApiError };
//# sourceMappingURL=ApiError.d.ts.map