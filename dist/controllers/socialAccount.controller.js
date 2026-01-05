import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../prismaClient/client.js";
import { generateMockSocialAccount } from "../mock/socialAccount.mock.js";
import { generateMockPost } from "../mock/posts.mock.js";
import { generateMockPostMetrics } from "../mock/postMetrics.mock.js";
export const connectSocialAccount = asyncHandler(async (req, res) => {
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
            platform: platform.toUpperCase(),
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
                platform: platform.toUpperCase(),
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
                postType: mockPost.postType,
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
        .json(new ApiResponse(201, result, "Social account connected successfully"));
});
//# sourceMappingURL=socialAccount.controller.js.map