# Civic AI Election Assistant: Complete System Specification

## 1. PROJECT IDENTITY & ARCHITECTURE
The **Civic AI Election Assistant** is a high-fidelity, multilingual platform designed to guide Indian citizens through the voting process using advanced AI and gamification.

- **Objective**: 100% Voter Readiness.
- **Framework**: Next.js 16 (Turbopack) with App Router.
- **Styling**: Vanilla CSS with Premium "Light Glass" design tokens (Glassmorphism).
- **State**: Zustand with LocalStorage persistence and real-time state synchronization.
- **Localization**: `next-intl` (English, Hindi, Gujarati, Marathi, Bengali, Tamil, Telugu, Punjabi).
- **Accessibility**: Native support for **Simple Mode** (increased fonts, reduced complexity) and **High Contrast Mode** (black/white/yellow palette).

---

## 2. GLOBAL STATE SPECIFICATION (`store/useAppStore.ts`)
The system's "Brain" manages all user data, progress, and gamification state locally.

### User Profile (`UserProfile`)
- `name`, `age`, `dob`, `state`, `district`, `language`, `isFirstTimeVoter`, `isRegistered`, `hasVoterId`.

### Accessibility State
- `isSimpleMode`: boolean
- `isHighContrast`: boolean

### Gamification State (`GamificationState`)
- `points`: Total engagement points earned across all activities.
- `badges`: Array of unlocked achievement IDs.
- `questSteps`: Object tracking completion of `register`, `locate`, `ballot`, `ready`, and `share`.
- `unlockedStates`: Array of regions explored on the interactive map.
- `quizScore`: Highest score achieved in the knowledge challenges.

---

## 3. FEATURE SPECIFICATION

### Hardened Production Components
- **Hydration-Safe Rendering**: Every dynamic component (BoothMap, ChatInterface, MockBallot, etc.) implements a `mounted` state check to ensure 100% stability between server rendering and client-side hydration.
- **NextStepBar**: Context-aware guidance bar that pulls from the "Next Best Action" engine to eliminate dead-ends in Mock Ballot and Quiz flows.
- **BadgeItem**: Premium glassmorphic circular achievement components replacing legacy emoji icons in the Profile.
- **Assistant Context-Awareness**: The AI Assistant and "Need Help?" badge inject real-time user readiness and next recommended actions into every AI prompt.
- **Booth Map Safety**: Nationwide coverage with `ZoomManager` fallbacks and coordinate validation for robust mapping.

### Intelligence & Guidance
- **AI Assistant**: Unified, context-aware assistant with Path-Detection prompting and a universal floating help badge.
- **Next Best Action Engine**: Dynamically calculates the most impactful next step for the user based on missing milestones.
- **Voice Orchestration**: Web Speech API for hands-free navigation and real-time audio guidance (TTS/STT).

### High-Engagement & Educational Modules
- **Daily Quiz System (`/quiz`)**: 
  - Randomized engine selecting 10 questions from a 50-item intelligence pool.
  - Educational feedback with a premium interactive score and performance reward screen.
  - Reward: +10 points per correct answer + Knowledge badges.
- **Virtual EVM & Innovation Lab (`/laboratory`)**:
  - Educational simulations for EVM machine activation, ballot selection, and VVPAT verification.
  - Fully localized and synchronized with the system orchestrator for readiness tracking.
- **Interactive Mock Ballot (`/ballot`)**: 
  - Full EVM simulation with candidate profiles and democratic vision statements.
  - Guided post-vote experience via `NextStepBar` to drive further engagement.
  - Reward: +30 points + "Expert" badge.
- **Invite Community (`/share`)**: 
  - Restored and hardened social sharing with `useAppStore` integration.
  - Native social sharing integration (`navigator.share`) with robust error handling and clipboard fallbacks.
  - Reward: +50 points + "Community Hero" badge.

---

## 4. DATA SCHEMA SPECIFICATION

### Quiz Intelligence (`data/quiz.json`)
- **Schema**: `id`, `question`, `options[]`, `answer` (index), `explanation`.
- **Pool**: 50 election-related questions covering rights, procedures, and history.

### Polling Booth Data (`data/maps/booths.json`)
- **Coverage**: Major Indian cities (Bangalore, Chennai, Delhi, Kolkata, Mumbai, Ahmedabad, Pune, Hyderabad, Jaipur, Lucknow).
- **Schema**: `id`, `name`, `city`, `district`, `lat`, `lng`, `address`.

---

## 5. USER FLOW & ACCESS MAP

### The "Readiness Journey"
1. **Onboarding**: Secure name/age entry (mandatory) and multilingual setup.
2. **Dashboard**: High-engagement sidebar provides real-time "Motivation Engine" feedback.
3. **Knowledge Loop**: User completes Daily Quiz to earn points and insights.
4. **Action Loop**: Complete Journey Quest (Map -> Registration -> Documents -> Mock Ballot) guided by `NextStepBar`.
5. **Community Loop**: Share the generated "Readiness Card" to inspire others and reach 100% status.

---

## 6. TECHNICAL INFRASTRUCTURE
- **Offline First**: All simulation logic, knowledge data, and state processing are browser-native.
- **Design System**: "Guided Sovereignty" — Glassmorphic cards, high-density typography, and subtle micro-animations.
- **Universal Accessibility**: Global `.simple-mode` and `.high-contrast` CSS hooks applied at the root layout.

---
*Updated on 2026-05-03 by Antigravity AI (System Stabilization & Full Localization Audit Complete).*
