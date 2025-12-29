import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt, {} from "jsonwebtoken";
import prisma from "../prismaClient/client.js";
const auth = asyncHandler(async (req, res, next) => {
    const jwtToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!jwtToken) {
        throw new ApiError(401, "Unauthorized: No token provided!");
    }
    try {
        const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decodedToken?.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid or expired token");
    }
});
export default auth;
//# sourceMappingURL=auth.middleware.js.map