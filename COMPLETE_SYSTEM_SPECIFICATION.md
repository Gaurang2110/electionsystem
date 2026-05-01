# Civic AI Election Assistant: Complete System Specification

## 1. PROJECT IDENTITY & ARCHITECTURE
The **Civic AI Election Assistant** is a high-fidelity, multilingual platform designed to guide Indian citizens through the voting process using advanced AI and gamification.

- **Objective**: 100% Voter Readiness.
- **Framework**: Next.js 16 (Turbopack) with App Router.
- **Styling**: Vanilla CSS with Glassmorphism / Glass design tokens.
- **State**: Zustand with LocalStorage persistence.
- **Localization**: `next-intl` (English, Hindi, Gujarati, Marathi, Bengali, Tamil, Telugu, Punjabi).
- **Accessibility**: Native support for **Simple Mode**, **High Contrast Mode**, and **Sign Language Guides**.

---

## 2. GLOBAL STATE SPECIFICATION (`store/useAppStore.ts`)
The system's "Brain" manages all user data, progress, and gamification state locally.

### User Profile (`UserProfile`)
- `name`, `age`, `dob`, `state`, `district`, `language`, `isFirstTimeVoter`, `isRegistered`, `hasVoterId`.

### Accessibility State
- `isSimpleMode`: Enlarged UI, simplified text, automated voice guidance.
- `isHighContrast`: Pure black/white/yellow theme for low-vision support.

### Voting Readiness Engine
Calculates the `progress` score (0-100%) based on four weighted factors:
- **Journey (40%)**: Milestone completion in the Quest.
- **Checklist (20%)**: Required document preparation.
- **Eligibility (20%)**: Verification status.
- **Engagement (20%)**: Participation points (Cap: 100).

---

## 3. FEATURE SPECIFICATION

### AI Assistant & Voice Control (`/features/ai-assistant/`)
- **AI Model**: `gemini-2.0-flash-exp` (via Google Generative AI).
- **Voice Navigation (STT)**: 
  - **Engine**: Web Speech API (`SpeechRecognition`).
  - **Functionality**: Hands-free navigation via commands like "Open Map", "Check Eligibility", or "What should I do next?".
- **Voice Guidance (TTS)**: 
  - **Engine**: `speechSynthesis`.
  - **Capabilities**: Real-time auditory nudges, confirmation of actions, and next-step explanations.
  - **Language Sync**: TTS automatically switches between 8 Indian languages based on app locale.

### Sign Language Video Guides (`/components/ui/SignLanguageGuide.tsx`)
- **Format**: Short (5-10s) MP4 videos stored locally (`/public/videos/`).
- **Integration**: Mapped to key milestones: `registration`, `map`, `voting`.
- **Performance**: Lazy-loaded with `preload="metadata"` and browser-cached for offline access.

### Accessibility Hub (`/features/dashboard/`)
- **Central Entry Points**: Unified home-screen toggles for all assistance features.
- **High Contrast Mode**: Pure black backgrounds, thick borders, and high-visibility yellow interactive elements.

### Interactive Booth Map (`/features/maps/BoothMap.tsx`)
- **Engine**: React Leaflet with custom GeoJSON (India Districts).
- **Interactivity**: `cursor: pointer` on all boundaries, `mouseover` highlighting, and `click` to unlock.
- **State Collectibles**: Unlocks region-specific stickers; increments `engagementScore` (+25).

---

## 4. DATA SCHEMA SPECIFICATION

### Turnout Data (`data/turnout.json`)
Used for the **Turnout Forecast** visualization.
- **Fields**: `state` (string), `turnout` (number).
- **Color Logic**: `<50` (Rose), `50-70` (Amber), `>70` (Emerald).

### Document Checklist (`data/documents.json`)
- **Types**: Identity, Address, Age.
- **Status**: Linked to readiness score (20% weight).

---

## 5. USER FLOW & ACCESS MAP

### Primary User Journey
1. **Onboarding**: Select from 8 languages; choose Voter Type.
2. **Dashboard**: Access **Accessibility Hub** for visual/voice assistance.
3. **Exploration**: Use **Voice Control** to open maps or check eligibility.
4. **Learning**: Watch **Sign Language Guides** during the voting quest.
5. **Readiness**: Reach 100% with automated **Voice Nudges** from the Universal CTA.

---

## 6. EVENT & TRIGGER SYSTEM (`checkTriggers`)
- **onStepComplete**: Updates `questSteps` and triggers progress recalculation.
- **onStateUnlock**: Increments `engagementScore` (+25) and adds to `unlockedStates`.
- **onProgressThreshold**: Progress `>= 80%` auto-unlocks the `badge_ready_citizen`.
- **Voice Nudge Trigger**: `UniversalContinueCTA` speaks the next step when a new priority task is identified.

---

## 7. TECHNICAL SPECIFICATIONS
- **SEO**: Dynamic Meta titles/descriptions per locale. Semantic HTML5 tags.
- **Offline First**: All speech models, video guides (after first load), and logic are browser-native.
- **Design System**: Glassmorphism with adaptive High Contrast overrides.
- **Security**: Gemini API calls wrapped in server-side routes (`/api/chat`).

---
*Updated on 2026-05-01 by Antigravity AI.*
