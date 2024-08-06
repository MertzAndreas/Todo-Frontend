// app/Account/Register/registerFormSchema.ts
import { z } from 'zod';

export const registerFormSchema = z
    .object({
        username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
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
        confirmPassword: z.string().min(8, { message: 'Confirm Password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const registerFormDefaultValues: RegisterFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
};
