import { z } from 'zod';

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'رمز فعلی الزامی است'),
    newPassword: z
        .string()
        .min(8, 'رمز جدید باید حداقل ۸ کاراکتر باشد')
        .regex(/[A-Z]/, 'باید حداقل یک حرف بزرگ داشته باشد')
        .regex(/[0-9]/, 'باید حداقل یک عدد داشته باشد'),
    confirmPassword: z
        .string()
        .min(1, 'تکرار رمز الزامی است'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'رمزهای عبور مطابقت ندارند',
    path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const validatePassword = (data: ChangePasswordFormData) => {
    const result = changePasswordSchema.safeParse(data);
    if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue: z.core.$ZodIssue) => {
            const field = issue.path[0] as string;
            errors[field] = issue.message;
        });
        return { success: false, errors };
    }
    return { success: true, errors: {} };
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
};
