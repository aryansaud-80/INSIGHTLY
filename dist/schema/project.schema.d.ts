import { z } from "zod";
export declare const projectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ProjectInput = z.infer<typeof projectSchema>;
//# sourceMappingURL=project.schema.d.ts.map