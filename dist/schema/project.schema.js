import { z } from "zod";
export const projectSchema = z.object({
    name: z
        .string()
        .min(3, "Project name must be at least 3 character")
        .max(100, "Project name is too long")
        .trim(),
    description: z.string().min(10).optional(),
});
//# sourceMappingURL=project.schema.js.map