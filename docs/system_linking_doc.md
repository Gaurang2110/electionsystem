# Civic AI Election Assistant: System Linking Document

# 1. PROJECT OVERVIEW
The **Civic AI Election Assistant** is a multilingual, gamified platform designed to simplify the complex Indian election process. It serves as a personal roadmap for citizens, transforming bureaucratic requirements into an engaging, milestone-driven journey.

- **Core Goal**: “Guide users to become vote-ready”
- **Target Audience**: Indian Citizens (specifically first-time voters)
- **Primary Tech Stack**: Next.js 16 (Turbopack), Zustand (State), Framer Motion (Animations), Leaflet (Maps).

---

# 2. FEATURE INVENTORY

## Onboarding
- **Location**: `/app/[locale]/onboarding/` & `/components/onboarding/LanguageOnboarding`
- **Purpose**: Initial language selection and voter profile setup (First-time vs. Regular).
- **Status**: Working

## Dashboard
- **Location**: `/features/dashboard/DashboardScreen.tsx`
- **Purpose**: Central hub providing a snapshot of readiness, current quest, and quick actions.
- **Status**: Working

## Voting Journey
- **Location**: `/features/voting-journey/`
- **Purpose**: A linear roadmap of mandatory steps (Registration -> Verification -> Booth Finder -> Voting).
- **Status**: Working (Integrated with Gamification Quest)

## AI Assistant & Voice Control
- **Location**: `/features/ai-assistant/` & `/hooks/useVoiceControl.ts`
- **Purpose**: 8-language multilingual chat assistant with full voice navigation (STT) and proactive auditory guidance (TTS).
- **Status**: Fully Integrated (Supports Hands-free mode)

## Accessibility Hub
- **Location**: `/features/dashboard/DashboardScreen.tsx`
- **Purpose**: Entry points for Simple Mode, High Contrast Mode, and Voice Toggle.
- **Status**: Working

## Sign Language Guides
- **Location**: `/components/ui/SignLanguageGuide.tsx` & `/features/gamification/quest/ElectionQuest.tsx`
- **Purpose**: Offline-ready video guides for each major journey milestone.
- **Status**: Working (Integrated into Journey timeline)

## Booth Finder (Map)
- **Location**: `/features/maps/BoothMap.tsx`
- **Purpose**: Interactive map to locate polling booths and collect "State Stickers" through region exploration.
- **Status**: Working (Includes State Collectibles logic)

## Eligibility Checker
- **Location**: `/features/eligibility/`
- **Purpose**: A local logic-based form to verify if a user meets the 18+ and citizenship criteria.
- **Status**: Working (Updates Global Profile)

## Document Checklist
- **Location**: `/features/documents/`
- **Purpose**: Tracks readiness of required IDs (Aadhar, Voter ID, Address Proof).
- **Status**: Working (Weighted toward Readiness Score)

## Candidate Match Simulation
- **Location**: `/features/candidate-match/`
- **Purpose**: Educational tool to match user policy priorities with mock candidate platforms.
- **Status**: Working

## Turnout Forecast
- **Location**: `/features/results/HeatmapCard.tsx`
- **Purpose**: Data visualization of expected voter turnout across states using mock local data.
- **Status**: Working

---

# 3. GLOBAL STATE STRUCTURE
**Source**: `store/useAppStore.ts` (Zustand with LocalStorage Persistence)

## Readiness
- **Fields**: `progress` (0-100), `readinessCategory` (Low/Medium/High), `readinessNudge` (string).
- **Source**: Calculated locally from Journey, Checklist, and Eligibility.
- **Where Updated**: `calculateProgress()`

## Gamification
- **Fields**: `questSteps` (bool array), `points` (int), `badges` (string[]), `unlockedStates` (string[]).
- **Source**: User interactions (clicks, state unlocks, quiz completions).
- **Where Updated**: `updateQuestStep()`, `addPoints()`, `unlockBadge()`.

## Profile
- **Fields**: `name`, `age`, `state`, `isFirstTimeVoter`, `isRegistered`.
- **Source**: Onboarding form and Eligibility checker.
- **Where Updated**: `updateProfile()`, `setEligibility()`.

---

# 4. DATA FLOW MAPPING

## Predictive Readiness Score
**Inputs**:
- **Journey (40%)**: `gamification.questSteps`
- **Checklist (20%)**: `documentChecklist` completion
- **Eligibility (20%)**: Verified `eligible` status
- **Engagement (20%)**: `engagementScore` (Quiz, Map visits)

**Triggers**:
- `toggleStep()` (Journey interaction)
- `toggleDocument()` (Checklist interaction)
- `setEligibility()` (Form completion)
- `incrementEngagement()` (General activity)

**Outputs**:
- `VotingReadinessCard.tsx` UI update
- Predictive coaching nudges (Smart Nudges)

---

# 5. USER NAVIGATION FLOW

1. **Entry**: User lands on Language Onboarding.
2. **Setup**: User defines voter type (First-time/Regular).
3. **Home (Dashboard)**: User sees the "Voting Readiness" card and "Election Quest".
4. **Action**: User clicks a "Next Step" nudge (e.g., "Check Eligibility").
5. **Completion**: User completes eligibility; `calculateProgress()` triggers.
6. **Feedback**: User receives a Badge/Points + Progress bar increases.
7. **Simulation**: User explores "Mock Ballot" or "Candidate Match" in the Laboratory section.
8. **Navigation**: User uses Bottom Nav to jump between Map, Assistant, and Journey.

---

# 6. FEATURE ACCESS MAP

### Registration/Journey
- **Home**: Main "Continue Journey" CTA (with Voice Nudges) and "Quick Action" grid.
- **Quest**: Sign Language overlays on Registration, Map, and Ballot steps.

### Accessibility Tools
- **Home**: **Accessibility Hub** for instant theme/mode toggles.
- **Profile**: Settings panel for language, contrast, and voice.
- **Voice Navigator**: Global floating mic for hands-free routing.

---

# 7. TRIGGER & EVENT SYSTEM

| Event | Update Logic | UI Change |
| :--- | :--- | :--- |
| `onStateUnlock` | Adds ID to `unlockedStates`, adds 25pts | Green flash on Map, Sticker added to Gallery |
| `onQuestComplete` | Sets `questSteps[step] = true` | Milestone marked done in Journey roadmap |
| `onQuizFinish` | Adds score to `quizScore`, adds pts | Points animation, Leaderboard update |
| `onProfileUpdate` | Syncs `profile` and `eligibility` | Dashboard greeting and Readiness score update |

---

# 8. CONNECTION GAPS

- ❌ **Candidate Match -> Journey**: Completing the Candidate Match simulation does not currently trigger a "Informed Voter" quest step directly.
- ❌ **Leaderboard -> Points**: Points are updated in state but the Leaderboard displays static mock data (does not yet reflect the user's real-time point rank).
- ❌ **Myth vs Fact -> Engagement**: Reading myths does not currently increment the `engagementScore`.

---

# 9. RECOMMENDED FIXES

1. **Connect Match to Quest**: Add `updateQuestStep('ballot', true)` when the user finishes the Candidate Match simulation.
2. **Dynamic Leaderboard**: Refactor `NeighbourhoodLeaderboard.tsx` to insert the current user's `points` from `useAppStore` into the top list.
3. **Fact-Check Rewards**: Call `incrementEngagement(5)` in `MythFactScreen.tsx` when a user expands a "Fact" to reward curiosity.

---

# 10. FINAL FLOW SUMMARY
“User enters → selects native language (e.g., Tamil) → enables High Contrast via Accessibility Hub → triggers Voice Control ("Open Map") → explores booth location → follows Sign Language guides during Registration → receives auditory nudge for next steps → reaches 100% readiness.”

---
*Updated on 2026-05-01 by Antigravity AI.*
