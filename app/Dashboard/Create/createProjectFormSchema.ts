// app/Dashboard/Create/createProjectFormSchema.ts
import { z } from 'zod';

export const createProjectFormSchema = z.object({
    name: z.string().min(3, { message: 'Project name must be at least 3 characters' }),
    description: z.string(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;

export const createProjectDefaultFormValues: CreateProjectFormValues = {
    name: '',
    description: '',
};
