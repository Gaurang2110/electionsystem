import { useAppStore } from "@/store/useAppStore";
import { GamificationFlow } from "./gamificationFlow";

/**
 * CENTRAL SYSTEM ORCHESTRATOR
 * This module acts as the "Air Traffic Control" for the Civic AI system.
 * It listens to user actions and orchestrates updates across state, 
 * gamification, and predictive readiness without holding business logic itself.
 */

export const systemOrchestrator = {
  /**
   * Triggered when a user completes the eligibility verification form.
   */
  onEligibilityCheck: (data: { age: number; isIndian: boolean; state: string; isRegistered: boolean }) => {
    const store = useAppStore.getState();
    
    // 1. Update Core Profile & Eligibility State
    store.setEligibility({
      age: data.age,
      isIndian: data.isIndian,
      state: data.state,
      isRegistered: data.isRegistered
    });

    // 2. Recalculate Global Readiness Score
    store.calculateProgress();

    // 3. Trigger Gamification Logic if newly registered
    if (data.isRegistered) {
      GamificationFlow.onStepComplete('register');
    }

    console.log("[ORCHESTRATOR] Eligibility check processed.");
  },

  /**
   * Triggered when a user completes a major journey milestone (e.g., Booth Finding).
   */
  onStepComplete: (stepId: string) => {
    // 1. Pass to Gamification Flow (handles badges, points, quest steps)
    GamificationFlow.onStepComplete(stepId);

    // 2. Ensure Readiness Score is synced
    useAppStore.getState().calculateProgress();

    console.log(`[ORCHESTRATOR] Step '${stepId}' completion orchestrated.`);
  },

  /**
   * Triggered by map interactions like district discovery or booth location.
   */
  onMapInteraction: (data: { type: 'district' | 'booth'; id: string; name?: string }) => {
    const store = useAppStore.getState();

    if (data.type === 'district') {
      // 1. Trigger State Sticker Unlock
      GamificationFlow.onStateUnlock(data.id);
    } else if (data.type === 'booth') {
      // 2. Mark "Locate Booth" quest step as complete
      GamificationFlow.onStepComplete('locate');
      store.incrementEngagement(15);
    }

    // 3. Recalculate readiness to reflect engagement increase
    store.calculateProgress();

    console.log(`[ORCHESTRATOR] Map interaction (${data.type}) processed.`);
  },

  /**
   * Triggered upon completion of a civic knowledge quiz.
   */
  onQuizComplete: (score: number, total: number) => {
    // 1. Update Quiz State & Rewards
    GamificationFlow.onQuizComplete(score, total);

    // 2. Recalculate readiness (Engagement factor)
    useAppStore.getState().calculateProgress();

    console.log(`[ORCHESTRATOR] Quiz results (${score}/${total}) synchronized.`);
  },

  /**
   * Triggered when a user toggles a document in their checklist.
   */
  onDocumentUpdate: (docId: string) => {
    const store = useAppStore.getState();

    // 1. Toggle Document Status
    store.toggleDocument(docId);

    // 2. Increment micro-engagement
    store.incrementEngagement(2);

    // 3. Recalculate readiness (Checklist factor)
    store.calculateProgress();

    console.log(`[ORCHESTRATOR] Document '${docId}' status update handled.`);
  },

  /**
   * Triggered when a user completes the Candidate Match simulation.
   */
  onCandidateMatchComplete: () => {
    const store = useAppStore.getState();

    // 1. Mark "Informed Voter" (ballot) quest step as complete
    GamificationFlow.onStepComplete('ballot');

    // 2. Reward with bonus engagement points for analytical thinking
    store.incrementEngagement(20);
    store.addPoints(50);

    // 3. Recalculate global readiness
    store.calculateProgress();

    console.log("[ORCHESTRATOR] Candidate match simulation synchronized.");
  },

  /**
   * Triggered when a user views the Constituency Insights dashboard.
   */
  onConstituencyView: () => {
    const store = useAppStore.getState();

    // 1. Reward engagement points for civic curiosity
    store.incrementEngagement(15);
    store.addPoints(30);

    // 2. Unlock "Aware Citizen" badge
    store.unlockBadge('badge_aware_citizen');

    // 3. Recalculate readiness
    store.calculateProgress();

    console.log("[ORCHESTRATOR] Constituency insights engagement handled.");
  },

  /**
   * Opens the AI Assistant panel with current context.
   */
  openAssistant: (context?: { page?: string; query?: string }) => {
    const store = useAppStore.getState();
    const router = window.location.pathname;
    
    // Logic to trigger the assistant sidebar/drawer
    // We can use a global event or update store state if assistant visibility is managed there
    const event = new CustomEvent('open-ai-assistant', { 
      detail: { 
        page: context?.page || router,
        query: context?.query,
        readiness: store.progress,
        voterType: store.voterType
      } 
    });
    window.dispatchEvent(event);
    
    console.log("[ORCHESTRATOR] AI Assistant trigger dispatched with context.");
  }
};

/**
 * EXAMPLE USAGE:
 * 
 * // In a component:
 * import { systemOrchestrator } from "@/lib/systemOrchestrator";
 * 
 * const handleFinishQuiz = (score) => {
 *   systemOrchestrator.onQuizComplete(score, 10);
 * };
 */
