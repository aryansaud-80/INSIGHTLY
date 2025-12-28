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

  export const register = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const validData = registerSchema.safeParse(data);

    if (!validData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validData.error.issues,
      });
    }

    const { name, email, password } = validData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  });
