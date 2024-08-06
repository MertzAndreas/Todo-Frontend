// app/Dashboard/[projectId]/components/newTaskFormSchema.ts
import { z } from 'zod';

export const newTaskFormSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    dueDate: z.string().min(1, { message: 'Due date is required' }),
    taskListId: z.string().min(1, { message: 'Task list is required' }),
    iconId: z.string().min(1, { message: 'Icon is required' }),
    assignedUsersIds: z.array(z.string()),
});

export type NewTaskFormValues = z.infer<typeof newTaskFormSchema>;

export const newTaskFormSchemaDefaultValues: NewTaskFormValues = {
    title: '',
    description: '',
    dueDate: '',
    taskListId: '',
    iconId: '',
    assignedUsersIds: [],
};
