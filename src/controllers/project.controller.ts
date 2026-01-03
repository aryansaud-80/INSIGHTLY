import type { Request, Response } from "express";
import prisma from "../prismaClient/client.js";
import asyncHandler from "../utils/asyncHandler.js";
import { projectSchema } from "../schema/project.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const projects = await prisma.project.findMany({
    where: { userId: req.user.id },
  });

  if (!projects.length) {
    throw new ApiError(404, "No projects found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Project ID is required");
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, project, "Project retrieved successfully"));
  }
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { id } = req.params;
    const data = req.body;

    if (!id) {
      throw new ApiError(400, "Project ID is required");
    }

    const validData = projectSchema.safeParse(data);

    if (!validData.success) {
      throw new ApiError(400, "Validation failed", validData.error.message);
    }

    const { name, description = "" } = validData.data;

    console.log("Updating project:", { id, name, description });

    const project = await prisma.project.update({
      where: {
        id: id,
        userId: req.user.id,
      },
      data: {
        name,
        description: description,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, project, "Project updated successfully"));
  }
);

const deleteProject = asyncHandler(async (req: Request, res: Response) => {});
