/**
 * Biometric Security Guard
 * 
 * Manages access to sensitive app areas using available hardware biometrics
 * (FaceID, TouchID, or System PIN).
 */

export class BiometricGuard {
    private static isAuthenticated = false;

    /**
     * Checks if hardware biometrics are available on the device.
     */
    static async isAvailable(): Promise<boolean> {
        if (!window.PublicKeyCredential) {
            return false;
        }

        // Check for platform authenticator availability (FaceID/TouchID)
        try {
            return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch {
            return false;
        }
    }

    /**
     * Challenges the user with a biometric prompt.
     * Use this before showing sensitive data (Card details, Transactions).
     */
    static async challenge(reason: string = "Verify Identity"): Promise<boolean> {
        if (this.isAuthenticated) return true;

        try {
            // Simulation of a WebAuthn challenge
            // In a real app, we would create a credential request here.
            // For this prototype, we'll simulate the "System Prompt" delay.
            console.log(`[BiometricGuard] Challenging user: ${reason}`);

            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate UI delay

            // For prototype purposes, we assume success if triggered
            // In a real scenario, this would throw if user cancels or fails
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error("Biometric failed", error);
            return false;
        }
    }

    /**
     * Resets the authentication state (e.g., when app goes to background).
     */
    static lock() {
        this.isAuthenticated = false;
    }
}
