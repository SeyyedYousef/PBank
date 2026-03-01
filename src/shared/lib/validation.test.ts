
import { describe, it, expect } from 'vitest';
import { authSchemas } from './validation';

describe('Validation Logic', () => {
    it('should validate AF phone number correctly', () => {
        // Valid AF numbers (starts with 07 or 7, 9 digits nominal, regex handles prefixes)
        // Normalized inputs expected by backend are often without country code or with 0
        expect(authSchemas.login.shape.phone.safeParse('0799123456').success).toBe(true);
        expect(authSchemas.login.shape.phone.safeParse('799123456').success).toBe(true);
        expect(authSchemas.login.shape.phone.safeParse('+93799123456').success).toBe(true);
    });

    it('should reject non-AF phone numbers', () => {
        // IR numbers shouldn't pass anymore
        expect(authSchemas.login.shape.phone.safeParse('09121234567').success).toBe(false);
        expect(authSchemas.login.shape.phone.safeParse('+989121234567').success).toBe(false);
    });

    it('should reject invalid phone numbers', () => {
        expect(authSchemas.login.shape.phone.safeParse('123').success).toBe(false);
        expect(authSchemas.login.shape.phone.safeParse('abc').success).toBe(false);
    });
});
