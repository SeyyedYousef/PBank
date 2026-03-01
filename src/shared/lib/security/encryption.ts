/**
 * Military-Grade Encryption Service (Prototype Simulation)
 * 
 * In a real-world scenario, this would interface with the device's Secure Enclave
 * or TEE (Trusted Execution Environment). For this prototype, we simulate
 * high-entropy AES-256 encryption with salt and IV rotation.
 */

export class EncryptionService {
    private static readonly ALGORITHM = 'AES-GCM';
    private static readonly KEY_LENGTH = 256;
    private static readonly SALT_LENGTH = 16;
    private static readonly IV_LENGTH = 12;

    /**
     * Encrypts sensitive payloads before they touch the local storage or network.
     * @param data The raw data object or string
     * @returns Encrypted string (IV + Salt + Ciphertext in Base64)
     */
    static async encrypt(data: any): Promise<string> {
        // 1. Prepare Data
        const encodedData = new TextEncoder().encode(JSON.stringify(data));

        // 2. Generate Random Salt & IV
        const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
        const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

        // 3. Derive Key (PBKDF2 simulation)
        const keyMaterial = await this.getKeyMaterial();
        const key = await this.deriveKey(keyMaterial, salt);

        // 4. Encrypt
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: this.ALGORITHM,
                iv: iv as unknown as BufferSource
            },
            key,
            encodedData
        );

        // 5. Pack (Salt + IV + Ciphertext)
        return this.packAndEncode(salt, iv, new Uint8Array(encryptedContent));
    }

    /**
     * Decrypts the payload, verifying integrity via GCM tag (implicit).
     */
    static async decrypt<T>(encryptedString: string): Promise<T | null> {
        try {
            const { salt, iv, ciphertext } = this.decodeAndUnpack(encryptedString);

            const keyMaterial = await this.getKeyMaterial();
            const key = await this.deriveKey(keyMaterial, salt);

            const decryptedContent = await window.crypto.subtle.decrypt(
                {
                    name: this.ALGORITHM,
                    iv: iv as unknown as BufferSource
                },
                key,
                ciphertext as unknown as BufferSource
            );

            const decodedString = new TextDecoder().decode(decryptedContent);
            return JSON.parse(decodedString) as T;
        } catch (error) {
            console.error('Security Breach: Decryption failed or tampered data detected.', error);
            return null;
        }
    }

    // --- Internal Helpers ---

    private static async getKeyMaterial(): Promise<CryptoKey> {
        // In production, this comes from a user entropy input or Secure Enclave
        const secret = "PBANK_MASTER_SECRET_KEY_V1";
        const enc = new TextEncoder();
        return window.crypto.subtle.importKey(
            "raw",
            enc.encode(secret),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
    }

    private static async deriveKey(keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt as unknown as BufferSource,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: this.KEY_LENGTH },
            false,
            ["encrypt", "decrypt"]
        );
    }

    private static packAndEncode(salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): string {
        // Concatenate buffers
        const packed = new Uint8Array(salt.length + iv.length + ciphertext.length);
        packed.set(salt, 0);
        packed.set(iv, salt.length);
        packed.set(ciphertext, salt.length + iv.length);

        // Base64 encode
        return btoa(String.fromCharCode(...packed));
    }

    private static decodeAndUnpack(input: string): { salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array } {
        const binaryString = atob(input);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const salt = bytes.slice(0, this.SALT_LENGTH);
        const iv = bytes.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
        const ciphertext = bytes.slice(this.SALT_LENGTH + this.IV_LENGTH);

        return { salt, iv, ciphertext };
    }
}
