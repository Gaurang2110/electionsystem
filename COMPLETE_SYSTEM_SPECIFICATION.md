# Civic AI Election Assistant: Complete System Specification

## 1. PROJECT IDENTITY & ARCHITECTURE
The **Civic AI Election Assistant** is a high-fidelity, multilingual platform designed to guide Indian citizens through the voting process using advanced AI and gamification.

- **Objective**: 100% Voter Readiness.
- **Framework**: Next.js 16 (Turbopack) with App Router.
- **Styling**: Vanilla CSS with Premium "Light Glass" design tokens (Glassmorphism).
- **State**: Zustand with LocalStorage persistence and real-time state synchronization.
- **Localization**: `next-intl` (English, Hindi, Gujarati, Marathi, Bengali, Tamil, Telugu, Punjabi).
- **Accessibility**: Native support for **Simple Mode**, **High Contrast Mode**, and **Sign Language Guides**.

---

## 2. GLOBAL STATE SPECIFICATION (`store/useAppStore.ts`)
The system's "Brain" manages all user data, progress, and gamification state locally.

### User Profile (`UserProfile`)
- `name`, `age`, `dob`, `state`, `district`, `language`, `isFirstTimeVoter`, `isRegistered`, `hasVoterId`.

### Gamification State (`GamificationState`)
- `points`: Total engagement points earned across all activities.
- `badges`: Array of unlocked achievement IDs.
- `questSteps`: Object tracking completion of `register`, `locate`, `ballot`, `ready`, and `share`.
- `unlockedStates`: Array of regions explored on the interactive map.
- `quizScore`: Highest score achieved in the knowledge challenges.

---

## 3. FEATURE SPECIFICATION

### Intelligence & Guidance
- **AI Assistant**: Unified, context-aware assistant with Path-Detection prompting.
- **Next Best Action Engine**: Dynamically calculates the most impactful next step for the user based on missing milestones.
- **Voice Orchestration**: Web Speech API for hands-free navigation and real-time audio guidance (TTS/STT).

### High-Engagement Gamification
- **Daily Quiz System (`/quiz`)**: 
  - Randomized engine selecting 10 questions from a 50-item intelligence pool.
  - Educational feedback with detailed explanations for every response.
  - Reward: +10 points per correct answer + Knowledge badges.
- **Interactive Mock Ballot (`/ballot`)**: 
  - Full EVM simulation with candidate profiles and democratic vision statements.
  - Neutrality verification algorithm calculates "Voter Independence Score".
  - Reward: +30 points + "Expert" badge.
- **Invite Community (`/share`)**: 
  - High-resolution HTML5 Canvas generation for personalized "Readiness Reports".
  - Native social sharing integration (`navigator.share`).
  - Reward: +50 points + "Community Hero" badge.

### Visualization & Maps
- **Interactive Booth Map**: React Leaflet with GeoJSON district boundaries.
- **Participation Heatmap**: State-wise turnout forecasting and visualization.
- **Sticker Gallery**: Region-specific collectibles unlocked via map exploration.

---

## 4. DATA SCHEMA SPECIFICATION

### Quiz Intelligence (`data/quiz.json`)
- **Schema**: `id`, `question`, `options[]`, `answer` (index), `explanation`.
- **Pool**: 50 election-related questions covering rights, procedures, and history.

### Candidate Profiles (`data/candidates.json`)
- **Fields**: `id`, `name`, `symbol`, `vision`, `description`.
- **Purpose**: Powering the Mock Ballot EVM simulation.

### Achievement System (`lib/gamificationService.ts`)
- **Badges**: 12+ unique achievements (e.g., `badge_registered`, `badge_democracy_expert`).
- **Logic**: Triggered by milestone completion or score thresholds.

---

## 5. USER FLOW & ACCESS MAP

### The "Readiness Journey"
1. **Onboarding**: Secure name/age entry and multilingual setup.
2. **Dashboard**: High-engagement sidebar provides real-time "Motivation Engine" feedback.
3. **Knowledge Loop**: User completes Daily Quiz to earn points and insights.
4. **Action Loop**: Complete Journey Quest (Map -> Registration -> Documents -> Mock Ballot).
5. **Community Loop**: Share the generated "Readiness Card" to inspire others and reach 100% status.

---

## 6. TECHNICAL INFRASTRUCTURE
- **Offline First**: All simulation logic, knowledge data, and state processing are browser-native.
- **Design System**: "Guided Sovereignty" — Glassmorphic cards, high-density typography, and subtle micro-animations.
- **Performance**: Zero-latency navigation via Next.js Link prefetching and Zustand state slicing.
- **Security**: Local-only processing for voter preferences; encrypted local storage for profile data.

---
*Updated on 2026-05-03 by Antigravity AI (Implementation Phase 3 Complete).*
