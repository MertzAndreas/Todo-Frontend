import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.string().email({ message: 'Must be a valid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .refine((value) => /[a-z]/.test(value), {
            message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[A-Z]/.test(value), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
            message: 'Password must contain at least one number',
        }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const loginFormDefaultValues: LoginFormValues = {
    email: '',
    password: '',
};
