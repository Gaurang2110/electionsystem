import { useAppStore } from "@/store/useAppStore";
import { GamificationFlow } from "./gamificationFlow";

/**
 * CENTRAL SYSTEM ORCHESTRATOR
 * This module acts as the "Air Traffic Control" for the Civic AI system.
 * It listens to user actions and orchestrates updates across state, 
 * gamification, and predictive readiness.
 */

export const systemOrchestrator = {
  /**
   * 1. JOURNEY & QUEST EVENTS
   */
  onStepComplete: (stepId: string) => {
    const store = useAppStore.getState();
    
    // 1. Sync with legacy completedSteps if missing
    if (!store.completedSteps.includes(stepId)) {
      store.toggleStep(stepId);
    }

    // 2. Pass to gamification flow
    GamificationFlow.onStepComplete(stepId);
    
    // 3. Sync readiness
    store.calculateProgress();
  },

  /**
   * 2. ELIGIBILITY EVENTS
   */
  onEligibilityCheck: (data: { age: number; isIndian: boolean; state: string; isRegistered: boolean }) => {
    const store = useAppStore.getState();
    
    store.setEligibility({
      age: data.age,
      isIndian: data.isIndian,
      state: data.state,
      isRegistered: data.isRegistered
    });

    store.calculateProgress();

    if (data.isRegistered) {
      systemOrchestrator.onStepComplete('register');
    }
    
    store.logEvent('eligibility_checked');
  },

  /**
   * 3. MAP & DISCOVERY EVENTS
   */
  onMapInteraction: (data: { type: 'district' | 'booth'; id: string; name?: string }) => {
    const store = useAppStore.getState();

    if (data.type === 'district') {
      GamificationFlow.onStateUnlock(data.id);
    } else if (data.type === 'booth') {
      systemOrchestrator.onStepComplete('locate');
      store.incrementEngagement(15);
    }

    store.calculateProgress();
    store.logEvent(`map_${data.type}_${data.id}`);
  },

  /**
   * 4. KNOWLEDGE & QUIZ EVENTS
   */
  onQuizComplete: (score: number, total: number) => {
    const store = useAppStore.getState();
    
    GamificationFlow.onQuizComplete(score, total);
    store.calculateProgress();
    
    if (score === total) {
      store.unlockBadge('badge_quiz_master');
    }
    
    store.logEvent(`quiz_completed_${score}/${total}`);
  },

  /**
   * 5. MOCK BALLOT EVENTS
   */
  onBallotSubmit: (candidateId: string) => {
    const store = useAppStore.getState();
    
    // Complete quest step
    systemOrchestrator.onStepComplete('ballot');
    
    // Rewards
    store.unlockBadge('badge_informed_voter');
    store.addPoints(30);
    store.incrementEngagement(20);
    
    store.calculateProgress();
    store.logEvent(`ballot_submitted_${candidateId}`);
  },

  /**
   * 6. COMMUNITY & SHARE EVENTS
   */
  onShare: () => {
    const store = useAppStore.getState();
    
    // Complete quest step
    systemOrchestrator.onStepComplete('share');
    
    // Rewards
    store.unlockBadge('badge_community_hero');
    store.addPoints(50);
    store.incrementEngagement(30);
    
    store.calculateProgress();
    store.logEvent('community_share_complete');
  },

  /**
   * 7. DOCUMENT EVENTS
   */
  onDocumentUpdate: (docId: string) => {
    const store = useAppStore.getState();
    store.toggleDocument(docId);
    store.incrementEngagement(5);
    store.calculateProgress();
  },

  /**
   * 8. ASSISTANT & TOOLS
   */
  openAssistant: (context?: { page?: string; query?: string }) => {
    const store = useAppStore.getState();
    const router = window.location.pathname;
    
    const event = new CustomEvent('open-ai-assistant', { 
      detail: { 
        page: context?.page || router,
        query: context?.query,
        readiness: store.progress,
        voterType: store.voterType
      } 
    });
    window.dispatchEvent(event);
    
    store.logEvent('assistant_opened');
  },

  /**
   * 9. CONSTITUENCY & INSIGHTS
   */
  onConstituencyView: () => {
    const store = useAppStore.getState();
    store.incrementEngagement(10);
    store.logEvent('constituency_insights_viewed');
  },

  /**
   * 10. CANDIDATE MATCH EVENTS
   */
  onCandidateMatchComplete: () => {
    const store = useAppStore.getState();
    store.incrementEngagement(25);
    store.addPoints(40);
    store.unlockBadge('badge_issue_informed');
    store.calculateProgress();
    store.logEvent('candidate_match_complete');
  }
};
