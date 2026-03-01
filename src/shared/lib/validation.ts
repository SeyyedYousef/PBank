import { z } from 'zod';

// Afghanistan Phone Number Regex (+93 or 07...)
const phoneRegex = /^(\+93|0)?7\d{8}$/;

export const authSchemas = {
    login: z.object({
        phone: z.string().regex(phoneRegex, 'شماره تلفن معتبر نیست'),
        password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد').optional(),
    }),

    otp: z.object({
        code: z.string().length(5, 'کد تایید باید ۵ رقم باشد').regex(/^\d+$/, 'فقط عدد مجاز است'),
    })
};

export const profileSchemas = {
    update: z.object({
        name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(50),
        username: z.string()
            .min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد')
            .max(30)
            .regex(/^[a-z0-9_]+$/, 'فقط حروف انگلیسی کوچک، اعداد و _ مجاز است'),
        email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
    })
};

export type LoginInput = z.infer<typeof authSchemas.login>;
export type UpdateProfileInput = z.infer<typeof profileSchemas.update>;
