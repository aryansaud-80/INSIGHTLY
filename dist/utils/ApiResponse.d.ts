declare class ApiResponse<T = any> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
    constructor(statusCode: number, data: T, message?: string);
}
export { ApiResponse };
//# sourceMappingURL=ApiResponse.d.ts.map