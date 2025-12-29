declare class ApiError extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    errors?: any;
    constructor(statusCode: number, message: string, errors?: any);
}
export { ApiError };
//# sourceMappingURL=ApiError.d.ts.map