import prisma from "../prismaClient/client.js";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/auth.helper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type { dataType } from "../types/type.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
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

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  const validData = loginSchema.safeParse(data);

  if (!validData.success) {
    throw new ApiError(
      400,
      "Validation failed: " + JSON.stringify(validData.error.message)
    );
  }

  const { email, password } = validData.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(400, "Invalid email");
  }

  const isPassValid = await comparePassword(password, user.password);

  if (!isPassValid) {
    throw new ApiError(400, "Wrong password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const userData: dataType = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { data: userData, accessToken }, "Login successful")
    );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  res.status(200).json(new ApiResponse(200, req.user, "Success"));
});

export const updateUser = asyncHandler(
  async (req: Request, res: Response) => {}
);
