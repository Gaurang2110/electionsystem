import { useAppStore } from '@/store/useAppStore';

/**
 * Derived "Brain State" of the system.
 * Aggregates core intelligence markers from the store into a centralized,
 * ready-to-consume state for AI and observability pipelines.
 */
export const getSystemBrainState = () => {
  const state = useAppStore.getState();
  
  // 1. Core Readiness
  const readiness = state.progress;
  const category = state.readinessCategory;
  
  // 2. Adaptive Actions
  const nextAction = state.getNextBestAction().label;
  const lastAction = state.activityLog[0]?.type || 'none';
  
  // 3. Engagement Metrics
  const insights = state.getUserInsights();
  const engagementLevel = insights.engagement;
  
  // 4. Journey Stage Mapping
  const completedQuestCount = Object.values(state.gamification.questSteps).filter(Boolean).length;
  let completionStage = 'Initiation';
  if (completedQuestCount >= 5) completionStage = 'Mobilization';
  else if (completedQuestCount >= 3) completionStage = 'Preparation';
  else if (completedQuestCount >= 1) completionStage = 'Exploration';

  return {
    readiness,
    category,
    nextAction,
    lastAction,
    engagementLevel,
    completionStage,
    // Diagnostic Flags for Decision Engine
    isEligible: state.eligibility.status === 'eligible',
    hasIncompleteDocs: state.documentChecklist.some(d => !d.completed),
    hasUsedMap: state.gamification.questSteps.locate,
    hasPracticedBallot: state.gamification.questSteps.ballot,
    featureUsage: state.featureUsage
  };
};

/**
 * Deterministic Decision Engine.
 * Wraps the brain state to decide the single most impactful Next Best Action.
 */
export const getNextBestAction = (brain: ReturnType<typeof getSystemBrainState>) => {
  // Adaptive Learning Overrides
  if (brain.featureUsage.map === 0 && brain.readiness > 30 && !brain.hasUsedMap) {
    return "Explore your voting map"; // Priority boost for avoided map
  }
  
  if (brain.featureUsage.quiz > 3 && brain.readiness < 80) {
    return "Take another challenge"; // Priority boost for active learners
  }

  // Base Priority Logic
  if (!brain.isEligible) return "Check eligibility";
  if (brain.hasIncompleteDocs) return "Complete documents";
  if (!brain.hasUsedMap) return "Find your booth";
  if (!brain.hasPracticedBallot) return "Try mock ballot";
  if (brain.readiness >= 80) return "Share with others";
  
  return brain.nextAction;
};
