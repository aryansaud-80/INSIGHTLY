import prisma from "../prismaClient/client.js";
import asyncHandler from "../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, } from "../helpers/auth.helper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt, {} from "jsonwebtoken";
const Options = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "PRODUCTION",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
export const register = asyncHandler(async (req, res) => {
    const data = req.body;
    const validData = registerSchema.safeParse(data);
    if (!validData.success) {
        throw new ApiError(400, "Validation failed", validData.error.issues);
    }
    const { name, email, password, role } = validData.data;
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new ApiError(409, "User already exist");
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    res
        .status(201)
        .json(new ApiResponse(201, user, "User registered successfully"));
});
export const loginUser = asyncHandler(async (req, res) => {
    const data = req.body;
    console.log(data);
    const validData = loginSchema.safeParse(data);
    if (!validData.success) {
        throw new ApiError(400, "Validation failed: ", validData.error.issues);
    }
    const { email, password } = validData.data;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    console.log(user);
    if (!user) {
        throw new ApiError(400, "Invalid email");
    }
    const isPassValid = await comparePassword(password, user.password);
    if (!isPassValid) {
        throw new ApiError(400, "Wrong password");
    }
    console.log(isPassValid);
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    console.log(accessToken, refreshToken);
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    console.log(userData);
    res.cookie("refreshToken", refreshToken, Options);
    console.log("Cookie set!");
    res
        .status(200)
        .json(new ApiResponse(200, { user: userData, accessToken }, "Login successful"));
});
export const RefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded?.userId },
        });
        if (!user || !user.refreshToken) {
            throw new ApiError(401, "Unauthorized");
        }
        if (refreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token mismatch");
        }
        const newRefreshToken = generateRefreshToken(user.id);
        const newAccessToken = generateAccessToken(user.id);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        res.cookie("refreshToken", newRefreshToken, Options);
        res
            .status(200)
            .json(new ApiResponse(200, { user: userData, accessToken: newAccessToken }, "Token refreshed successfully"));
    }
    catch (err) {
        console.error(err);
        throw new ApiError(401, "Invalid refresh token");
    }
});
export const logout = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "PRODUCTION",
    });
    res
        .status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});
//# sourceMappingURL=auth.controller.js.map