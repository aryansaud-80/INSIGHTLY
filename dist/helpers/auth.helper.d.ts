export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateRefreshToken: (userId: string) => string;
export declare const generateAccessToken: (userId: string) => string;
//# sourceMappingURL=auth.helper.d.ts.map