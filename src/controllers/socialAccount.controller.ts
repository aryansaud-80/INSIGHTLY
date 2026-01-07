import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../prismaClient/client.js";
import { generateMockSocialAccount } from "../mock/socialAccount.mock.js";
import { generateMockPost } from "../mock/posts.mock.js";
import { generateMockPostMetrics } from "../mock/postMetrics.mock.js";

export const connectSocialAccount = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const { projectId, platform } = req.params;

    const allowedPlatforms = ["X", "INSTAGRAM", "FACEBOOK"];

    if (!platform || !allowedPlatforms.includes(platform.toUpperCase())) {
      throw new ApiError(400, "Invalid platform");
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId ?? "",
        userId: req.user.id,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const mockAccount = generateMockSocialAccount(platform.toUpperCase());

    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        projectId: project.id,
        platform: platform.toUpperCase() as any,
        platformUserId: mockAccount?.platformUserId ?? "",
      },
    });

    if (existingAccount) {
      throw new ApiError(400, "This social account is already connected");
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdAccount = await tx.socialAccount.create({
        data: {
          projectId: project.id,
          platform: platform.toUpperCase() as any,
          username: mockAccount?.username ?? "",
          platformUserId: mockAccount?.platformUserId ?? "",
          followerCount: mockAccount?.followerCount ?? 0,
          accessStatus: "MOCK",
        },
      });

      const mockPost = generateMockPost(platform.toUpperCase());

      const createdPost = await tx.post.create({
        data: {
          socialAccountId: createdAccount.id,
          platformPostId: mockPost.platformPostId,
          contentText: mockPost.contentText,
          postType: mockPost.postType as any,
          publishedAt: mockPost.publishedAt,
        },
      });

      const mockMetrics = generateMockPostMetrics();

      const createdMetrics = await tx.postMetrics.create({
        data: {
          postId: createdPost.id,
          likes: mockMetrics?.likes ?? 0,
          comments: mockMetrics?.comments ?? 0,
          shares: mockMetrics?.shares ?? 0,
          impression: mockMetrics?.impression ?? 0,
          saves: mockMetrics?.saves ?? 0,
          engagementRate: mockMetrics?.engagementRate ?? 0,
        },
      });

      return {
        socialAccount: createdAccount,
        post: createdPost,
        postMetrics: createdMetrics,
      };
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, result, "Social account connected successfully"),
      );
  },
);

export const removeSocialAccount = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id, projectId } = req.params;

    if (!id || !projectId) throw new ApiError(400, "Invalid ID or Project ID");

    // Step 1: Check project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new ApiError(404, "Project not found");

    if (project.userId.trim() !== req.user.id.trim()) {
      throw new ApiError(
        403,
        "Unauthorized: This project does not belong to you",
      );
    }

    // Step 2: Check social account under this project
    const account = await prisma.socialAccount.findFirst({
      where: { id, projectId },
    });

    if (!account) throw new ApiError(404, "Social account not found");

    // Step 3: Safe to delete
    await prisma.socialAccount.delete({ where: { id } });

    res
      .status(200)
      .json(
        new ApiResponse(200, account, "Social account removed successfully"),
      );
  },
);

export const getSocialAccountById = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id, projectId } = req.params;

    if (!id || !projectId) throw new ApiError(400, "Invalid ID or Project ID");

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new ApiError(404, "Project not found");

    if (project.userId.tirm() !== req.user.id.trim())
      throw new ApiError(
        403,
        "Unauthorized: This project does not belong to you",
      );

    const account = await prisma.socialAccount.findFirst({
      where: { id, projectId },
    });

    if (!account) throw new ApiError(404, "Social account not found");
    
    
    res
      .status(200)
      .json(
        new ApiResponse(200, account, "Social account removed successfully"),
      );
  },
);

export const getSocialAccountsByProjectId = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { projectId } = req.params;

  if (!projectId) throw new ApiError(400, "Invalid Project ID");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new ApiError(404, "Project not found");

  if (project.userId.trim() !== req.user.id.trim())
    throw new ApiError(
      403,
      "Unauthorized: This project does not belong to you",
    );

  const accounts = await prisma.socialAccount.findMany({
    where: { projectId },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, accounts, "Social accounts retrieved successfully"),
    );
});