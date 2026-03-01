# PBank Super Product Requirements Document (PRD)
> **Version:** 1.0.0
> **Status:** Draft / Approved
> **Author:** Antigravity (Product Lead) & User (CEO)
> **Date:** 2026-02-06

---

## 1. Executive Summary

**PBank** is a revolutionary digital wallet designed for Afghanistan, aiming to provide "Invisible Banking" with a "Sci-Fi" aesthetic. Unlike traditional banking apps, PBank focuses on radical simplicity, speed (under 5s transactions), and a visually stunning interface inspired by crypto wallets.

**Core Value Proposition:**
*   **For the People:** A reliable, simple digital wallet for everyone (Gen Z to the Unbanked).
*   **Zero Friction:** Account creation is tied to immediate, AI-powered KYC.
*   **Universal Access:** Works on high-end smartphones via the app and offline via USSD (marketed externally).

**Success Metrics (KPIs):**
1.  **Engagement:** 50% of users open the app daily.
2.  **Growth:** Successful viral adoption among Gen Z.
3.  **Revenue:** Sustainable transaction fee volume.

---

## 2. User Personas

### 2.1. The "Zoomer" (Primary Beachhead)
*   **Who:** 22-year-old student or crypto enthusiast in Kabul.
*   **Needs:** Speed, beautiful UI, Dark Mode, instant transfers.
*   **Pain Point:** Traditional banks are slow, ugly, and bureaucratic.
*   **Behavior:** Values aesthetics, likely to invite friends if the app looks "cool".

### 2.2. The "Merchant/Worker" (Secondary)
*   **Who:** A shopkeeper or a construction worker sending money to family.
*   **Needs:** Trust, reliability, easy cash-in/cash-out.
*   **Pain Point:** Distance to physical bank branches.
*   **Behavior:** Used to cash; needs Agents to convert physical money to digital.

---

## 3. Functional Requirements

### 3.1. Onboarding & KYC (The Gatekeeper)
**Flow:**
1.  **Splash Screen:** "Welcome to the Future of Banking".
2.  **Phone Input:** User enters mobile number -> Receive OTP.
3.  **Mandatory KYC:**
    *   User *cannot* proceed without verifying identity.
    *   **Action:** Upload National ID (Tazkira/Passport) + Selfie.
    *   **Backend Process:**
        *   Images sent to Cloud API (AWS Rekognition / Google Vision).
        *   **OCR:** Read name and ID number.
        *   **Face Match:** Compare selfie with ID photo.
    *   **Feedback:** "Analyzing..." (Sci-Fi animation).
4.  **Account Creation:** Upon success, account is created with the name extracted from ID.
5.  **Pin/Biometric Setup:** User sets a PIN or enables Fingerprint/FaceID.

**Edge Cases:**
*   **Blurry Image:** AI rejects -> Prompt user to retake.
*   **Face Mismatch:** Account creation blocked -> "Contact Support".
*   **Duplicate ID:** "An account with this ID already exists".

### 3.2. Home Dashboard (The Cockpit)
*   **Balance:** Displayed prominently in AFN (Afghani).
*   **Quick Actions:** 
    *   **Send (Up Arrow):** Jump to Transfer.
    *   **Receive (Down Arrow):** Show QR Code / Wallet Address.
*   **Ad Slider:** Banner area for internal announcements or partner ads (Revenue stream).
*   **Gamification (Lite):** "Shake to Pay" or daily login streaks (Missions).

### 3.3. Money Transfer (Send)
**Flow:**
1.  Tap "Send".
2.  Enter Destination (Phone Number / Wallet ID) or Select from Contacts.
3.  Enter Amount.
4.  **Confirm:** Review screen (Amount + Fee).
5.  **Auth:** Biometric scan (Fingerprint) or PIN.
6.  **Success:** Sci-Fi sound effect + "Receipt" card.

### 3.4. Money Deposit/Withdraw (Cash In/Out)
*   **Physical Layer:** 
    *   User visits an authorized PBank Agent (Shop/Currency Exchange).
    *   **Cash In:** User gives cash -> Agent sends digital balance to User.
    *   **Cash Out:** User sends digital balance to Agent -> Agent gives cash.
*   **App UI:** "Find Agent" map or list (Future scope: Just a simple transfer flow for now).

### 3.5. Security Settings
*   **2FA:** Optional (User can enable Google Authenticator/SMS 2FA in settings).
*   **Biometrics:** Default authentication method for transactions.

---

## 4. Technical Architecture

### 4.1. Core System
*   **Type:** Custodial Wallet (Centralized Database).
*   **Ledger:** Internal SQL Ledger (Double-entry bookkeeping) ensures data integrity.
*   **Frontend:** React (Vite) + TailwindCSS + Capacitor/TWA (for mobile).

### 4.2. KYC Architecture (Cost-Optimized)
*   **Service:** Custom implementation wrapping Cloud APIs.
*   **Provider:** AWS Rekognition or Google Cloud Vision (Pay-per-API-call).
*   **Logic:**
    *   Client uploads images.
    *   Server proxies request to Cloud Provider.
    *   Server parses JSON response (Confidence Score).
    *   If Confidence > 90% -> Auto Approve.
    *   If Confidence < 90% -> Manual Review Queue.

### 4.3. Offline Capability (USSD)
*   **Strategy:** Marketing-only approach.
*   **Implementation:** The app does *not* contain off-line logic.
*   **User Action:** User dials `*XXX#` (e.g., `*780#`) on their phone dialer to access the USSD menu provided by telco partnership.

---

## 5. Non-Functional Requirements

### 5.1. Performance
*   **App Load Time:** < 2 seconds.
*   **Transaction Speed:** < 5 seconds processing time.

### 5.2. Security
*   **Encryption:** All data in transit (TLS) and at rest (AES-256).
*   **Zero Trust:** No sensitive data (tokens/passwords) stored in plain text on the device.

---

## 6. Analytics Strategy (Custom)
We will build a lightweight event tracking system inspired by Firebase but self-hosted.
*   **Key Events to Track:**
    *   `app_open`: For Daily Active User (DAU) calculation.
    *   `kyc_attempt` / `kyc_success` / `kyc_failure`: To optimize funnel.
    *   `transaction_completed`: Volume tracking.
    *   `ad_impression` / `ad_click`: Revenue tracking.

---

## 7. Future Scope (Post v1.0)
*   **Advanced Gamification:** Levels, badges, leaderboards.
*   **Chat:** In-app messaging for support.
*   **Bill Payments:** Utility bills integration.
*   **Virtual Cards:** For online shopping.
