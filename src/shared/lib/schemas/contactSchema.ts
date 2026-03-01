import { z } from 'zod';

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
        .max(50, 'نام حداکثر ۵۰ کاراکتر'),
    phone: z
        .string()
        .min(10, 'شماره تلفن نامعتبر')
        .regex(/^(\+93|0)[0-9]{9}$/, 'فرمت شماره: 07xx xxx xxx یا +93xxxxxxxxx'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const validateContact = (data: ContactFormData) => {
    const result = contactSchema.safeParse(data);
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
