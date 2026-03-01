---
description: Complete roadmap from current state to app store release
---

# 🚀 PBank — نقشه راه تولید و انتشار

> از وضعیت فعلی (Prototype 78/100) تا انتشار در فروشگاه‌ها
> تخمین زمان کلی: 8-12 هفته (با تیم 2-3 نفره)

---

## 📍 وضعیت فعلی
- ✅ 17 صفحه فعال بدون "Coming Soon"
- ✅ State Management (Zustand + Encrypted Persist)
- ✅ i18n 3 زبانه (فارسی، پشتو، انگلیسی)
- ✅ PWA manifest + Service Worker
- ✅ سیستم احراز هویت (Mock)
- ✅ 19 کامپوننت UI حرفه‌ای
- ❌ بدون Backend واقعی
- ❌ تست‌ها ناکافی (~5%)
- ❌ آیکون‌ها و Assets ناقص

---

## فاز 1: تکمیل Frontend (هفته 1-2)
> هدف: رساندن Frontend به 95/100

### 1.1 — Form Validation با Zod
```
src/shared/lib/schemas/
├── transferSchema.ts      ← اعتبارسنجی مبلغ، آدرس گیرنده
├── contactSchema.ts       ← اعتبارسنجی نام، شماره تلفن
├── passwordSchema.ts      ← قوانین رمز عبور (حداقل 8 کاراکتر، ترکیبی)
└── profileSchema.ts       ← اعتبارسنجی نام نمایشی، username
```
- [ ] TransferPage: validation قبل از ارسال
- [ ] SettingsPage/ChangePassword: validation رمز فعلی + جدید
- [ ] ContactsPage/AddModal: validation نام + شماره
- [ ] ProfilePage/EditModal: validation username + display name

### 1.2 — Loading States (Skeleton)
- [ ] HomePage: skeleton برای balance و recent transactions هنگام load اولیه
- [ ] HistoryPage: skeleton برای لیست تراکنش‌ها
- [ ] ServicesPage: skeleton برای grid خدمات
- [ ] ProfilePage: skeleton برای اطلاعات کاربر
- [ ] هر صفحه باید 1-2 ثانیه loading نمایش دهد (mock delay)

### 1.3 — Error States
- [ ] ساخت کامپوننت `ErrorState.tsx` (آیکون + پیام + دکمه تلاش مجدد)
- [ ] اضافه کردن در TransferPage (موجودی ناکافی، خطای شبکه)
- [ ] اضافه کردن در HistoryPage (خطای بارگذاری)
- [ ] Toast notifications برای خطاها

### 1.4 — UX Polish
- [ ] Notification Badge روی BottomNav (عدد اعلان‌های خوانده‌نشده)
- [ ] Pull-to-Refresh gesture در History و Home
- [ ] haptic feedback فعال در دکمه‌های اصلی
- [ ] Empty state با illustration برای History خالی
- [ ] Confirm dialog قبل از لغو/بازگشت از TransferPage

---

## فاز 2: تست‌نویسی (هفته 2-3)
> هدف: حداقل 70% code coverage

### 2.1 — Unit Tests (Vitest)
```
src/store/
├── authStore.test.ts       ← تکمیل (login, logout, rotateTokens)
├── walletStore.test.ts     ← تکمیل (sendMoney edge cases, balance check)
└── gamificationStore.test.ts ← جدید (XP, levels, streaks)

src/shared/lib/
├── validation.test.ts      ← تکمیل (تمام schemas)
├── secureStorage.test.ts   ← تکمیل
└── security/encryption.test.ts ← تکمیل
```

### 2.2 — Component Tests (Testing Library)
```
src/test/
├── HomePage.test.tsx       ← تکمیل (balance display, privacy mode, navigation)
├── TransferPage.test.tsx   ← جدید (form validation, submission flow)
├── HistoryPage.test.tsx    ← جدید (filtering, search, empty state)
├── BottomNav.test.tsx      ← جدید (active state, navigation)
└── SettingsPage.test.tsx   ← جدید (theme toggle, language change)
```

### 2.3 — E2E Tests (Playwright)
```
e2e/
├── auth-flow.spec.ts       ← Onboarding → Phone → OTP → Password → Home
├── transfer-flow.spec.ts   ← Home → Transfer → Fill → Confirm → Receipt
├── history-flow.spec.ts    ← History → Filter → Detail → Share
├── settings-flow.spec.ts   ← Settings → Theme → Language → Back
└── offline-flow.spec.ts    ← آفلاین → نمایش indicator → آنلاین
```

---

## فاز 3: Backend API (هفته 3-6)
> هدف: جایگزینی Mock data با API واقعی

### 3.1 — انتخاب تکنولوژی (پیشنهاد)
```
Backend:     Node.js + Express/Fastify  یا  Go + Fiber
Database:    PostgreSQL + Redis (cache)
Auth:        JWT + Refresh Token Rotation
OTP:         SMS Gateway (Kavenegar/Twilio)
Hosting:     AWS / DigitalOcean / Liara
```

### 3.2 — API Endpoints مورد نیاز
```
POST   /auth/send-otp          ← ارسال کد تایید
POST   /auth/verify-otp        ← تایید کد
POST   /auth/login              ← ورود با رمز عبور
POST   /auth/refresh-token      ← تمدید توکن
POST   /auth/logout              ← خروج

GET    /user/profile             ← دریافت پروفایل
PATCH  /user/profile             ← ویرایش پروفایل
PATCH  /user/password            ← تغییر رمز عبور
DELETE /user/account             ← حذف حساب

GET    /wallet/balance           ← موجودی
GET    /wallet/transactions      ← لیست تراکنش‌ها (pagination)
GET    /wallet/transaction/:id   ← جزئیات تراکنش
POST   /wallet/transfer          ← انتقال وجه

GET    /contacts                 ← لیست مخاطبین
POST   /contacts                 ← افزودن مخاطب
PATCH  /contacts/:id             ← ویرایش مخاطب
DELETE /contacts/:id             ← حذف مخاطب

GET    /notifications            ← لیست اعلان‌ها
PATCH  /notifications/read-all   ← خواندن همه
PATCH  /notifications/:id/read   ← خواندن یکی

GET    /services                 ← لیست خدمات
POST   /services/mobile-topup    ← شارژ موبایل
POST   /services/bill-payment    ← پرداخت قبض
```

### 3.3 — اتصال Frontend به Backend
- [ ] جایگزینی Mock data در `walletStore.ts` با API calls
- [ ] جایگزینی Mock data در `authStore.ts` با API calls
- [ ] ساخت React Query hooks برای data fetching (از @tanstack/react-query که نصب شده)
- [ ] Optimistic updates برای Transfer و Contacts
- [ ] Infinite scroll/pagination برای History

---

## فاز 4: امنیت Production (هفته 5-6)
> هدف: آماده‌سازی امنیتی برای پول واقعی

### 4.1 — Frontend Security
- [ ] Content Security Policy (CSP) headers
- [ ] Rate limiting UI (جلوگیری از ارسال مکرر)
- [ ] Input sanitization در همه فرم‌ها
- [ ] XSS protection review
- [ ] Certificate Pinning (در Capacitor/native)
- [ ] Anti-tampering (obfuscation) در build

### 4.2 — Backend Security
- [ ] Helmet.js یا معادل
- [ ] Rate limiting API (express-rate-limit)
- [ ] SQL injection prevention (parameterized queries)
- [ ] CORS configuration
- [ ] Request signing/verification
- [ ] IP-based anomaly detection
- [ ] Transaction limits و cooldowns

### 4.3 — Compliance
- [ ] بررسی قوانین بانکداری الکترونیکی کشور مقصد
- [ ] KYC (احراز هویت) — Sumsub یا معادل محلی
- [ ] AML (ضد پولشویی) — قوانین گزارش‌دهی
- [ ] Privacy Policy (سیاست حفظ حریم خصوصی)
- [ ] Terms of Service (شرایط استفاده)
- [ ] Data Protection compliance

---

## فاز 5: تبدیل به اپ موبایل (هفته 6-8)
> هدف: ساخت APK/IPA از کد فعلی

### 5.1 — انتخاب روش (پیشنهاد: Capacitor)
```bash
# نصب Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init PBank com.pbank.app

# افزودن پلتفرم‌ها
npx cap add android
npx cap add ios

# Build و Sync
npm run build
npx cap sync
```

### 5.2 — Capacitor Plugins مورد نیاز
```bash
npm install @capacitor/camera          # دوربین برای QR Scanner
npm install @capacitor/haptics         # لرزش (Haptic Feedback)
npm install @capacitor/keyboard        # مدیریت کیبورد
npm install @capacitor/splash-screen   # Splash Screen بومی
npm install @capacitor/status-bar      # StatusBar control
npm install @capacitor/push-notifications  # Push Notifications
npm install @capacitor/biometrics      # اثر انگشت / Face ID واقعی
npm install @capacitor/share           # Share واقعی
npm install @capacitor/app             # Deep links, back button
npm install @capacitor/network         # Network status
```

### 5.3 — تنظیمات بومی
**Android:**
- [ ] Custom Splash Screen (replace Vite logo)
- [ ] App Icon (adaptive icon: foreground + background)
- [ ] Keystore generation برای signing
- [ ] ProGuard rules
- [ ] Minimum SDK: 24 (Android 7.0)
- [ ] Target SDK: 34 (Android 14)
- [ ] Back button handling
- [ ] Safe area insets

**iOS:**
- [ ] App Icon set (1024x1024 + all sizes)
- [ ] Launch Screen storyboard
- [ ] Info.plist permissions (camera, biometric)
- [ ] Provisioning profiles
- [ ] Code signing certificates
- [ ] Minimum iOS: 15.0

---

## فاز 6: Assets و Branding (هفته 6-7)
> هدف: آماده‌سازی بصری برای فروشگاه

### 6.1 — آیکون‌ها و تصاویر
- [ ] App Icon (1024x1024 PNG)
- [ ] Adaptive Icon (Android: foreground layer + background)
- [ ] PWA Icons (192x192, 512x512)
- [ ] Favicon (32x32, 16x16)
- [ ] Feature Graphic (1024x500) برای Google Play
- [ ] لوگوی PBank (SVG + PNG)

### 6.2 — اسکرین‌شات‌ها برای فروشگاه‌ها
- [ ] 5-8 اسکرین‌شات (1080x1920) با frame
  - Splash/Onboarding
  - Home (Balance + Quick Actions)
  - Transfer Flow
  - History + Details
  - Profile + Settings
  - Services
  - QR Scanner
  - Receipt (Success)

### 6.3 — متن‌های فروشگاه
- [ ] نام برنامه: PBank — کیف پول دیجیتال
- [ ] توضیح کوتاه (80 کاراکتر)
- [ ] توضیح بلند (4000 کاراکتر) با فیچرها
- [ ] کلمات کلیدی (Tags)
- [ ] دسته‌بندی: Finance
- [ ] Content Rating questionnaire

---

## فاز 7: تست نهایی و QA (هفته 8-9)
> هدف: اطمینان از کیفیت قبل از انتشار

### 7.1 — Device Testing
- [ ] تست روی حداقل 5 دستگاه Android مختلف
- [ ] تست روی iPhone (SE, 13, 15 Pro)
- [ ] تست در مود آفلاین
- [ ] تست RTL (فارسی/پشتو) و LTR (انگلیسی)
- [ ] تست Dark Mode و Light Mode
- [ ] تست Landscape (باید lock شود یا responsive باشد)

### 7.2 — Performance Testing
- [ ] Lighthouse audit > 90 (Performance, A11y, Best Practices, SEO)
- [ ] Bundle size audit (هدف: < 500KB gzipped)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Memory leak testing

### 7.3 — Security Audit
- [ ] Penetration testing (حداقل OWASP Top 10)
- [ ] API security audit
- [ ] Data encryption verification
- [ ] Token security audit
- [ ] هیچ sensitive data در console.log

### 7.4 — Beta Testing
- [ ] Google Play Internal Testing Track (20+ نفر)
- [ ] Apple TestFlight (20+ نفر)
- [ ] جمع‌آوری feedback و رفع باگ‌ها
- [ ] Crash reporting (Sentry یا Firebase Crashlytics)
- [ ] Analytics (Firebase Analytics یا Mixpanel)

---

## فاز 8: انتشار (هفته 9-12)
> هدف: حضور در Google Play و App Store

### 8.1 — Google Play
```
هزینه: $25 (یک‌بار)
زمان بررسی: 3-7 روز
```
- [ ] ثبت حساب Google Play Developer
- [ ] ساخت App Listing (عنوان، توضیحات، اسکرین‌شات)
- [ ] آپلود AAB (Android App Bundle)
- [ ] تکمیل Content Rating + Data Safety
- [ ] تنظیم Pricing (Free)
- [ ] Submit for Review

### 8.2 — App Store (iOS)
```
هزینه: $99/سال
زمان بررسی: 1-3 روز
```
- [ ] ثبت حساب Apple Developer
- [ ] ساخت App listing در App Store Connect
- [ ] آپلود IPA از Xcode/Transporter
- [ ] تکمیل App Privacy questionnaire
- [ ] Submit for Review

### 8.3 — PWA (وب)
```
هزینه: Domain + Hosting
```
- [ ] Deploy روی Vercel/Netlify/Cloudflare Pages
- [ ] SSL certificate (خودکار)
- [ ] Custom domain (pbank.af یا pbank.ir)
- [ ] CDN configuration
- [ ] Analytics setup

---

## 📋 خلاصه هزینه‌ها

| مورد | هزینه تخمینی |
|------|-------------|
| Google Play Developer Account | $25 (یک‌بار) |
| Apple Developer Account | $99/سال |
| Domain (.af یا .ir) | $10-50/سال |
| Hosting (Vercel/Cloudflare) | رایگان تا $20/ماه |
| SMS Gateway (OTP) | $50-200/ماه |
| Server (VPS/Cloud) | $10-50/ماه |
| SSL Certificate | رایگان (Let's Encrypt) |
| KYC Service (اختیاری) | $0.5-2 per verification |
| **مجموع سال اول** | **~$500-1500** |

---

## 📋 خلاصه تایم‌لاین

```
هفته 1-2  ┃ ████████░░░░ ┃ تکمیل Frontend (Validation, Loading, Error)
هفته 2-3  ┃ ░░████████░░ ┃ تست‌نویسی (Unit + E2E)
هفته 3-6  ┃ ░░░░████████ ┃ Backend API + اتصال
هفته 5-6  ┃ ░░░░░████░░░ ┃ امنیت Production
هفته 6-8  ┃ ░░░░░░████░░ ┃ Capacitor + Native
هفته 6-7  ┃ ░░░░░░██░░░░ ┃ Assets و Branding
هفته 8-9  ┃ ░░░░░░░░██░░ ┃ QA و Beta Testing
هفته 9-12 ┃ ░░░░░░░░░███ ┃ انتشار در فروشگاه‌ها
```

---

## ⚡ اگر فقط 1 نفر باشید (MVP Path)

اگر تنها هستید و سریع‌ترین مسیر را می‌خواهید:

1. **هفته 1**: Form Validation + Loading/Error States
2. **هفته 2**: Backend ساده با Supabase/Firebase (بدون کد Backend)
3. **هفته 3**: اتصال Frontend به Backend
4. **هفته 4**: Capacitor + Android Build
5. **هفته 5**: Assets + Google Play Upload (Internal Testing)
6. **هفته 6**: رفع باگ‌ها + انتشار عمومی

> مسیر MVP: **6 هفته** به جای 12
