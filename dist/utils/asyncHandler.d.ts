import type { Request, Response, NextFunction } from "express";
declare const asyncHandler: (requestHandler: Function) => (req: Request, res: Response, next: NextFunction) => void;
export default asyncHandler;
//# sourceMappingURL=asyncHandler.d.ts.map