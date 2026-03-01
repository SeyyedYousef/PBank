# PBank (Project AntiGravity) - UI/UX Design Rules & System
> Version: 1.0.0 (2026 Edition)
> Core Philosophy: "Radical Simplicity" & "Invisible Banking"
> Target Platforms: iOS & Android (Unified Brand Identity)

---

## 0. Visual Styles (The Mix)
*   **Onboarding:** Inspired by **Google NotebookLM**. Fluid, Aurora gradients, colorful, welcoming.
*   **Core App:** Deep Space Glassmorphism (Purple/Dark).
*   **Transactions:** Crypto Wallet Style (Clean, specific, high contrast).

---

## 1. Design Principles (The "Soul" of PBank)

1.  Complexity Reduction: Never require 3 taps when 1 swipe works. Hide advanced options until needed.
2.  Dark Mode First: The app is native to dark environments. Light mode is secondary or non-existent.
3.  Bento Grid Layout: Information is organized in modular, rectangular tiles (like a Bento box), not linear lists.
4.  Depth over Flat: Use Neo-Glassmorphism to create hierarchy. The background is deep space; content floats on glass.
5.  Purple Haze: Purple is not just a color; it's the light source. It glows, it doesn't just paint.

---

## 2. Color Palette (The 2026 Purple System)

### Primary Colors
* Cosmic Purple (Primary Brand): #7F00FF (Used for primary CTAs, active states)
* Electric Violet (Accent/Glow): #BF55EC (Used for gradients, glow effects)
* Void Dark (Background): #05040A (Main app background - NOT pure black)
* Deep Aubergine (Surface): #120B1F (Secondary background for cards before blur)

### Semantic Colors
* Success (Mint Neon): #00FF94 (Softened for dark mode)
* Error (Crimson Neon): #FF2E63
* Warning (Amber Glow): #FFC700

### Glassmorphism Styles (The "PBank Glass")
* Glass Light: rgba(255, 255, 255, 0.1) (Standard card background)
* Glass Heavy: rgba(255, 255, 255, 0.05) (Secondary/Inactive cards)
* Border Stroke: rgba(255, 255, 255, 0.15) (1px width)

---

## 3. Typography System

Font Family:
* Persian: Vazirmatn (Round variation) or Yekan Bakh (Heavy weights preferred).
* English/Numbers: Inter or Space Grotesk (for a tech feel).

Hierarchy Rules:
1.  Display Numbers (Balance): HUGE. Font-weight: 800. Letter-spacing: -1px. (e.g., wallet balance).
2.  Headings: Font-weight: 700.
3.  Body: Font-weight: 400. High readability. Color: #E0E0E0 (Never pure white).
4.  Captions/Labels: Font-weight: 500. Color: #A090B0 (Muted purple-grey).

> Rule: Never use currency symbols (toman/$) next to the main balance if it clutters the view. Use a smaller font size or distinct color to denote currency.

---

## 4. Component Rules (The Construction Kit)

### 4.1. The "Bento" Cards
All dashboard widgets (Balance, Cards, Recent Transactions) must follow the Bento Rule:
* Shape: Rectangular containers.
* Border Radius: 24px (Continuous/Squircle).
* Effect:
    * Background: Glass Light
    * Backdrop Blur: 20px (or blur(20px))
    * Border: 1px solid rgba(255,255,255,0.1)
    * Shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37)

### 4.2. Buttons (CTAs)
* Primary Button:
    * Height: 56px
    * Radius: 16px or Full Pill (based on context).
    * Background: Linear Gradient (135deg, #7F00FF to #BF55EC).
    * Shadow: 0 0 15px rgba(127, 0, 255, 0.5) (Glow effect).
    * Text: White, Bold.
* Secondary Button:
    * Background: Transparent.
    * Border: 1px solid #BF55EC.

### 4.3. Navigation (Floating Bar)
* Style: Floating Bottom Bar (Not attached to the screen bottom).
* Position: 20px from bottom, 20px from sides.
* Appearance: Heavy Glassmorphism.
* Items: Icons only. No text labels unless active. The active item glows purple.

---

## 5. Interaction & Motion Rules

### 5.1. Gestures over Clicks
* Transactions: Do not use a form initially. Use "Drag and Drop" logic.
    * *Action:* Drag coin icon -> Drop on user avatar = Send Money page.
* Back Action: Swipe from left/right edge is mandatory. No explicit top-left back buttons unless necessary.

### 5.2. Micro-Interactions
* Haptic Feedback: MANDATORY.
    * *Success:* Light, crisp tick.
    * *Error:* Double heavy vibration.
    * *Button Press:* Very light tap.
* Loading: Never use a spinning circle. Use a "Shimmer" effect (skeleton loader) on the Bento cards or a pulsing purple glow.

---

## 6. Layout & Spacing (Grid System)

* Base Unit: 8px.
* Standard Padding: 20px (Screen edges).
* Gap between Bento Cards: 12px or 16px.
* Safe Areas:
    * Top: Respect the Notch/Dynamic Island.
    * Bottom: Ensure floating nav doesn't overlap the Home Indicator.

---

## 7. Graphics & Iconography

* Icons: Use "Duotone" or "Glass" style icons.
    * *Stroke width:* 1.5px.
    * *Corner:* Rounded.
* Illustrations: 3D Abstract Shapes with purple lighting (Glass/Crystal textures). No flat vector people.

---
---

> Final Check: Does this screen look like a sci-fi interface but feel as simple as a piece of paper? If yes, it is PBank.
