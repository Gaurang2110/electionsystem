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
-   **Low Engagement**: Traditional government portals lack interactive and personalized experiences.

### The Solution
*   🤖 **AI-Driven Assistant**: Real-time, context-aware guidance powered by Gemini.
*   🧭 **Guided Journey**: A step-by-step sequential roadmap that simplifies the voting lifecycle.
*   🎮 **Gamified Experience**: Readiness scores, badges, and progress tracking to drive consistent participation.

---

## 👤 Target Persona
> **"First-time Indian voters, especially in low-awareness and low-connectivity regions."**

The system is optimized for users who need a "digital companion" to navigate their democratic rights for the first time, supporting regional languages and offline-first accessibility.

---

## ⚙️ Key Features
*   🤖 **AI Assistant**: Context-aware, multilingual chat (Gemini 1.5 Flash).
*   🧭 **Voting Journey**: A logic-driven sequential roadmap of voting milestones.
*   📊 **Readiness Score**: A real-time engine that calculates "Voting Readiness" based on user actions.
*   🗺️ **Interactive Booth Map**: Localized polling station finder using Leaflet.
*   🎮 **Quiz & Gamification**: Interactive learning through points, ranks, and daily challenges.
*   🧪 **Mock Ballot**: A safe, technical simulation of the EVM + VVPAT voting process.
*   🌐 **Multilingual Support**: High-fidelity translations for 8+ Indian languages.
*   ♿ **Accessibility**: Dedicated 'Simple Mode' and 'High Contrast' themes for inclusive usage.

---

## 🧠 System Architecture

The architecture follows a decoupled, intelligence-first design to ensure reliability even in low-connectivity environments.

*   **Frontend**: Built with **Next.js 16** (App Router) using Turbopack for ultra-fast builds.
*   **State Management**: **Zustand** handles the global 'System Orchestrator' and 'Readiness Engine'.
*   **AI Layer**: **Google Gemini 1.5 Flash** integrated via server-side API routes for contextual guidance.
*   **Data Persistence**: **Local JSON + LocalStorage** ensure an offline-first experience.
*   **Deployment**: **Google Cloud Run** for scalable, serverless production hosting.

---

## 📊 Architecture Diagram

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

## 🗺️ Data Flow
1.  **User Actions**: Every interaction (quiz completed, profile updated) triggers a state change in the **Zustand Store**.
2.  **State Sync**: The **Readiness Engine** re-calculates the user's score and "Next Best Action" immediately.
3.  **Contextual AI**: The **Gemini Assistant** receives the current state to provide hyper-personalized advice.
4.  **UI Updates**: The frontend reflects progress through dynamic animations and gamified milestones.

---

## ☁️ Google Services Used
*   **Google Gemini (AI)**: Acts as the "Cognitive Core," translating complex ECI guidelines into simple, conversational guidance.
*   **Google Cloud Run (Deployment)**: Provides a high-performance, containerized environment in the `asia-south1` region to ensure low-latency access for Indian users.

---

## 🔄 How It Works (Flow)
1.  **Onboarding**: User selects language and identifies as a first-time voter.
2.  **Readiness Score**: The dashboard immediately visualizes the user's current readiness percentage.
3.  **Smart Suggestions**: The system proactively suggests the most critical "Next Step" (e.g., Check Eligibility).
4.  **Action Centers**: User interacts with specific modules:
    *   **Quiz**: Learn voting laws.
    *   **Map**: Locate polling station.
    *   **Ballot**: Practice using the EVM simulator.
5.  **Progress Sync**: State is updated, unlocking badges and increasing the impact score.
6.  **AI Orchestration**: The AI assistant stays present on every screen, offering context-specific help.

---

## 📦 Project Structure
```text
/app         # Next.js App Router (Routes & API)
/features    # Core business modules (AI, Journey, Gamification)
/components  # Shared UI & Layout components
/store       # Global State (Zustand Orchestrator)
/data        # Localized mock data & JSON logic
/lib         # Utility functions & API clients
```

---

## ⚠️ Assumptions
*   **Offline-First**: The application is designed to function primarily offline, with AI features requiring intermittent connectivity.
*   **Mock Data**: Uses sanitized mock data for the 2026 election cycle to protect user privacy.
*   **Scalability**: The architecture is built to support millions of concurrent users via serverless scaling.

---

## 🚀 Deployment
The application is fully containerized using **Docker** and deployed on **Google Cloud Run**.
*   **Runtime**: Node.js 20 (Alpine)
*   **Region**: `asia-south1` (Mumbai)
*   **Automation**: Managed via Google Cloud SDK and Cloud Build.

---

## 🎯 Final Impact
> **"Civic AI Election Assistant transforms voting from a confusing bureaucratic process into a guided, intelligent, and engaging experience, empowering the next generation of citizens."**

---
**Submission Ready | Powered by Google Cloud & Gemini AI**