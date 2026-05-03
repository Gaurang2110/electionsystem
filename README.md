# 🗳️ Civic AI Election Assistant

> **AI-powered, multilingual, offline-first voting assistant**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=googlecloud)](https://civic-ai-election-assistant-704557478516.asia-south1.run.app/)

---

## 🚀 Overview
**Civic AI Election Assistant** is a smart decision engine designed to bridge the gap between complex election processes and first-time voters. By leveraging Google Gemini and a gamified readiness framework, it transforms civic participation into a guided, high-engagement journey.

### 🔗 Live Demo
**[https://civic-ai-election-assistant-704557478516.asia-south1.run.app](https://civic-ai-election-assistant-704557478516.asia-south1.run.app/)**

---

## 🎯 Problem & Solution

### The Problem
*   **Awareness Gap**: First-time voters often feel overwhelmed by the lack of clear, consolidated information.
*   **Complexity**: Election procedures (registration, booth finding, ID requirements) are often fragmented.
*   **Low Engagement**: Traditional government portals lack interactive and personalized experiences.

### The Solution
*   🤖 **AI-Driven Assistant**: Real-time, context-aware guidance powered by Gemini.
*   🧭 **Guided Journey**: A step-by-step sequential roadmap that simplifies the voting lifecycle.
*   🎮 **Gamified Experience**: Readiness scores, badges, and progress tracking to drive consistent participation.

---

## ☁️ Google Services Used
The platform leverages a comprehensive suite of Google technologies to ensure intelligence, scalability, and actionable insights:

*   🤖 **Google Gemini AI**: Powering the core conversational engine for contextual voting guidance and document analysis.
*   🔥 **Firebase**: Integrated for lightweight, asynchronous event logging (e.g., tracking when users reach high-readiness states).
*   📊 **Google Analytics (GA4)**: Real-time user journey tracking, page view analytics, and goal completion monitoring (Quiz/Journey).
*   ☁️ **Google Cloud Run**: Secure, containerized serverless hosting in the `asia-south1` region for maximum regional performance.

---

## 🏗️ System Architecture

```text
       [ User Interface ]
               ↓
    [ Frontend (Next.js 16) ]
               ↓
  [ State Layer (Zustand Store) ] ←───→ [ Local Storage (Offline) ]
               ↓
[ Business Logic (Readiness Engine) ]
               ↓
   [ AI Layer (Google Gemini) ]
               ↓
     [ Google Cloud Run ]
```

---

## 🧪 Testing
The application includes a robust suite of unit tests to ensure the reliability of its core decision logic.

*   **Readiness Score Logic**: Verified calculations for progress percentage based on milestone completions.
*   **Quiz & Gamification**: Validated scoring mechanisms, point awards, and badge unlocking triggers.
*   **Decision Engine**: Tested the "Next Best Action" logic to ensure suggestions are contextually accurate for different user states.

**Run tests using:** `npm test`

---

## ⚙️ Key Features
*   🤖 **AI Assistant**: Context-aware, multilingual chat (Gemini 1.5 Flash).
*   🧭 **Voting Journey**: A logic-driven sequential roadmap of voting milestones.
*   📊 **Readiness Score**: A real-time engine that calculates "Voting Readiness" based on user actions.
*   🗺️ **Interactive Booth Map**: Localized polling station finder using Leaflet.
*   🎮 **Quiz & Gamification**: Interactive learning through points, ranks, and daily challenges.
*   🧪 **Mock Ballot**: A safe, technical simulation of the EVM + VVPAT voting process.
*   🌐 **Localization**: High-fidelity support for 8+ Indian languages.
*   ♿ **Accessibility**: 'Simple Mode' and 'High Contrast' themes for inclusive usage.

---

## 🚀 How It Works (Flow)
1.  **Onboarding**: User selects language and identifies as a first-time voter.
2.  **Readiness Score**: The dashboard immediately visualizes the user's readiness percentage.
3.  **Smart Suggestions**: The system proactively suggests the most critical "Next Step" (e.g., Check Eligibility).
4.  **Action Centers**: User interacts with Quiz, Map, and Ballot modules.
5.  **Synchronization**: State is updated, unlocking badges and increasing the impact score.
6.  **Intelligence**: AI assistant and analytics monitor progress to provide optimized guidance.

---

## 📦 Project Structure
```text
/app         # Next.js App Router (Routes & API)
/features    # Core business modules (AI, Journey, Gamification)
/components  # Shared UI & Layout components
/store       # Global State (Zustand Orchestrator)
/tests       # Unit tests for core logic (Jest)
/lib         # Utility functions (Analytics, Firebase, AI)
```

---

## 🎯 Final Impact
> **"Civic AI Election Assistant transforms voting from a confusing bureaucratic process into a guided, intelligent, and engaging experience, empowering the next generation of citizens."**

---
**Submission Ready | Powered by Google Cloud & Gemini AI**