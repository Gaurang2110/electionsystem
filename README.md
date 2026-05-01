# Civic AI Election Assistant (India)

A premium, mobile-first web application designed to help Indian citizens navigate the election process with ease.

## Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Core Features
- **Onboarding**: Smooth entry with interactive branding.
- **Progress Tracking**: Real-time readiness calculation based on completed tasks.
- **AI Assistant**: Mock chat interface ready for Gemini API integration.
- **Eligibility Checker**: Interactive form to verify voting rights.
- **Document Checklist**: Persistent checklist for essential registration documents.
- **Election Timeline**: Visual timeline for important deadlines and milestones.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Folder Structure
- `/app`: App Router pages and layout.
- `/components`: Reusable UI and Layout components.
- `/features`: Feature-based modular logic and components.
- `/store`: Zustand state management with persistence.
- `/utils`: Helper functions and styling utilities.

## AI Readiness
The `/features/ai-assistant` is structured to easily integrate with an API route. You can add a `POST /api/chat` endpoint and update the `handleSend` function in `ChatInterface.tsx` to call your AI model.
