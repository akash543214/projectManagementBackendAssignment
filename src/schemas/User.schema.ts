import { z } from 'zod';

// Registration Schema
export const RegisterUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
    
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
        .max(254, "Email must be less than 254 characters"),
    
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be less than 128 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .refine((password) => {
            const commonPasswords = [
                'password', '12345678', 'qwerty123', 'admin123', 
                'welcome123', 'password123', '123456789'
            ];
            return !commonPasswords.includes(password.toLowerCase());
        }, "Password is too common, please choose a stronger password")
});

// Login Schema
export const LoginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
        .max(254, "Email must be less than 254 characters"),
    
    password: z
        .string()
        .min(1, "Password is required")
        .max(128, "Password is too long")
});


// TypeScript types inferred from schemas
export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
export type LoginUserRequest = z.infer<typeof LoginUserSchema>;



