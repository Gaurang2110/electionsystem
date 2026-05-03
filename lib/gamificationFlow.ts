import { useAppStore } from "@/store/useAppStore";
import { getBadgeById } from "./gamificationService";

/**
 * GAMIFICATION FLOW CONTROLLER
 * Orchestrates user-driven events, state updates, and UI triggers
 * into a cohesive civic achievement journey.
 */

export const GamificationFlow = {
  /**
   * 1. STEP COMPLETION FLOW
   * Triggered when a user completes a journey milestone
   */
  onStepComplete: (stepId: string) => {
    const store = useAppStore.getState();
    
    // Check if already completed to avoid redundant triggers
    const questSteps = store.gamification.questSteps;
    if (stepId in questSteps && (questSteps as any)[stepId]) return;

    console.log(`[FLOW] Completing Step: ${stepId}`);

    // 1. Mark step as completed & Update progress % (handled in store)
    // 2. Add points (+20 handled in updateQuestStep)
    if (stepId in questSteps) {
      store.updateQuestStep(stepId as any, true);
    }

    // 3. Unlock badge based on step
    const badgeMapping: Record<string, string> = {
      'register': 'badge_registered',
      'locate': 'badge_booth_explorer',
      'ballot': 'badge_democracy_expert',
      'ready': 'badge_ready_citizen',
      'share': 'badge_community_sharer'
    };

    const badgeId = badgeMapping[stepId];
    if (badgeId) {
      store.unlockBadge(badgeId);
    }

    // 4. Update Leaderboard (Simulation)
    // This happens reactively via store subscription in components
  },

  /**
   * 2. QUIZ FLOW
   * Triggered after correct answers or as a standalone activity
   */
  onQuizComplete: (score: number, total: number) => {
    const store = useAppStore.getState();
    console.log(`[FLOW] Quiz Completed. Score: ${score}/${total}`);
    
    // Points added in store.finishQuiz
    store.finishQuiz(score, total);
  },

  /**
   * 3. STICKER UNLOCK FLOW
   * Triggered by map interactions
   */
  onStateUnlock: (stateId: string) => {
    const store = useAppStore.getState();
    
    if (store.gamification.unlockedStates.includes(stateId)) return;

    console.log(`[FLOW] New State Unlocked: ${stateId}`);
    store.unlockState(stateId);
  },

  /**
   * 4. SHARE FLOW
   * Triggered when user shares their readiness
   */
  onShare: () => {
    const store = useAppStore.getState();
    console.log(`[FLOW] Social Share Triggered`);
    
    // Share is a quest step
    GamificationFlow.onStepComplete('share');
    store.incrementEngagement(10); // Extra bonus for sharing
  },

  /**
   * 5. CONTINUOUS GUIDANCE
   * Finds the first incomplete step to suggest to the user
   */
  getNextStep: () => {
    const { gamification } = useAppStore.getState();
    const steps = [
      { id: 'register', label: 'Verify Registration', link: '/journey' },
      { id: 'locate', label: 'Find Voting Booth', link: '/map' },
      { id: 'ballot', label: 'Practice Mock Ballot', link: '/ballot' },
      { id: 'ready', label: 'Confirm Readiness', link: '/eligibility' },
      { id: 'share', label: 'Invite Community', link: '/share' }
    ];

    return steps.find(s => !(gamification.questSteps as any)[s.id]) || null;
  },

  /**
   * 6. INITIALIZATION
   * Checks for background triggers on app entry
   */
  init: () => {
    useAppStore.getState().checkTriggers();
  }
};

/**
 * FLOW DIAGRAM:
 * 
 * User Action (Map Click) -> onStateUnlock -> Update Store -> Points/Sticker Update -> UI Notification
 * User Action (Journey Step) -> onStepComplete -> Update Store -> Unlock Badge -> Points Update -> Show Overlay -> Trigger Quiz Suggestion
 * User Action (Quiz Answer) -> onQuizComplete -> Update Store -> Points Update -> Update Leaderboard Rank
 */
