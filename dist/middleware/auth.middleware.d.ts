import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: "USER" | "ADMIN";
            };
        }
    }
}
declare const auth: (req: Request, res: Response, next: NextFunction) => void;
export default auth;
//# sourceMappingURL=auth.middleware.d.ts.map