import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../prismaClient/client.js";
import { generateMockSocialAccount } from "../mock/socialAccount.mock.js";
import { generateMockPost } from "../mock/posts.mock.js";
import { generateMockPostMetrics } from "../mock/postMetrics.mock.js";
import { calculateAnalyticsSummary } from "./analytics.controller.js";

export const connectSocialAccount = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const { projectId, platform } = req.params;

    if (!projectId || !platform)
      throw new ApiError(400, "Missing required parameters");

    const allowedPlatforms = ["X", "INSTAGRAM", "FACEBOOK"];

    if (!allowedPlatforms.includes(platform.toUpperCase())) {
      throw new ApiError(400, "Invalid platform");
    }

    // 1️⃣ Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // 2️⃣ Create mock social account
    const mockAccount = generateMockSocialAccount(platform.toUpperCase());

    if (!mockAccount) {
      throw new ApiError(500, "Failed to generate mock account");
    }

    const socialAccount = await prisma.socialAccount.create({
      data: {
        projectId: project.id,
        platform: platform.toUpperCase() as any,
        username: mockAccount.username,
        platformUserId: mockAccount.platformUserId,
        followerCount: mockAccount.followerCount,
        accessStatus: "MOCK",
      },
    });

    // 3️⃣ Create mock posts + metrics
    const createdPosts = [];

    for (let i = 0; i < 5; i++) {
      const post = generateMockPost(platform.toUpperCase());

      const createdPost = await prisma.post.create({
        data: {
          socialAccountId: socialAccount.id,
          contentText: post.contentText,
          platformPostId: post.platformPostId,
          postType: post.postType as any,
          publishedAt: post.publishedAt,
        },
      });

      const metrics = generateMockPostMetrics();

      await prisma.postMetrics.create({
        data: {
          postId: createdPost.id,
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares,
          saves: metrics.saves,
          impression: metrics.impression,
          engagementRate: metrics.engagementRate,
        },
      });

      createdPosts.push(createdPost);
    }

    // 4️⃣ AUTO calculate analytics summary
    await calculateAnalyticsSummary(project.id);

    // 5️⃣ Fetch updated summary
    const analyticsSummary = await prisma.analyticsSummary.findUnique({
      where: { projectId: project.id },
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          socialAccount,
          analyticsSummary,
        },
        "Social account connected & analytics updated"
      )
    );
  }
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
        "Unauthorized: This project does not belong to you"
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
        new ApiResponse(200, account, "Social account removed successfully")
      );
  }
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

    if (project.userId.trim() !== req.user.id.trim())
      throw new ApiError(
        403,
        "Unauthorized: This project does not belong to you"
      );

    const account = await prisma.socialAccount.findFirst({
      where: { id, projectId },
    });

    if (!account) throw new ApiError(404, "Social account not found");

    res
      .status(200)
      .json(
        new ApiResponse(200, account, "Social account removed successfully")
      );
  }
);

export const getSocialAccountsByProjectId = asyncHandler(
  async (req: Request, res: Response) => {
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
        "Unauthorized: This project does not belong to you"
      );

    const accounts = await prisma.socialAccount.findMany({
      where: { projectId },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, accounts, "Social accounts retrieved successfully")
      );
  }
);
