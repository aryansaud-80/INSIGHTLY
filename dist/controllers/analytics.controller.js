import prisma from "../prismaClient/client.js";
export const calculateAnalyticsSummary = async (projectId) => {
    const projectWithPosts = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            socialAccounts: {
                include: {
                    posts: { include: { postMetric: true } },
                },
            },
        },
    });
    if (!projectWithPosts)
        return;
    let totalPosts = 0;
    let totalLikes = 0;
    let totalEngagement = 0;
    let totalEngagementRate = 0;
    projectWithPosts.socialAccounts.forEach((account) => {
        account.posts.forEach((post) => {
            totalPosts += 1;
            const metrics = post.postMetric;
            if (metrics) {
                totalLikes += metrics.likes;
                totalEngagement +=
                    metrics.likes + metrics.comments + metrics.shares + metrics.saves;
                totalEngagementRate += metrics.engagementRate;
            }
        });
    });
    const avgEngagementRate = totalPosts > 0 ? +(totalEngagementRate / totalPosts).toFixed(2) : 0;
    await prisma.analyticsSummary.upsert({
        where: { projectId },
        update: {
            totalPosts,
            totalLikes,
            totalEngagement,
            avgEngagementRate,
            platform: "ALL",
        },
        create: {
            projectId,
            totalPosts,
            totalLikes,
            totalEngagement,
            avgEngagementRate,
            platform: "ALL",
        },
    });
};
//# sourceMappingURL=analytics.controller.js.map