import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../prismaClient/client.js";

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

const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jwtToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!jwtToken) {
      throw new ApiError(401, "Unauthorized: No token provided!");
    }

    try {
      const decodedToken = jwt.verify(
        jwtToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

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
    } catch (error) {
      throw new ApiError(401, "Unauthorized: Invalid or expired token");
    }
  }
);

export default auth;
