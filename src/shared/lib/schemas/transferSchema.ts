import { z } from 'zod';

export const transferSchema = z.object({
    amount: z
        .number({ error: 'مبلغ باید عدد باشد' })
        .min(10, 'حداقل مبلغ ارسال ۱۰ ؋ است')
        .max(500000, 'حداکثر مبلغ ارسال ۵۰۰,۰۰۰ ؋ است'),
    recipient: z
        .string()
        .min(1, 'آدرس گیرنده الزامی است')
        .regex(/^0x[a-fA-F0-9]/, 'آدرس باید با 0x شروع شود'),
    message: z
        .string()
        .max(100, 'پیام حداکثر ۱۰۰ کاراکتر')
        .optional()
        .or(z.literal('')),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export const validateTransfer = (data: TransferFormData) => {
    const result = transferSchema.safeParse(data);
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
