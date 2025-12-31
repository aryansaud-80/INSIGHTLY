import prisma from "../prismaClient/client.js";
import asyncHandler from "../utils/asyncHandler.js";
import { projectSchema } from "../schema/project.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const createProject = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Not authenticated");
    }
    const data = req.body;
    const validData = projectSchema.safeParse(data);
    if (!validData.success) {
        throw new ApiError(400, "Validation failed", validData.error.message);
    }
    const { name, description } = validData.data;
    const project = await prisma.project.create({
        data: {
            userId: req.user.id,
            name,
            description: description ?? "",
        },
    });
    res
        .status(200)
        .json(new ApiResponse(200, project, "Project created successfully"));
});
//# sourceMappingURL=project.controller.js.map