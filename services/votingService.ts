/**
 * Voting & Readiness Calculation Services
 * Pure logic extracted from the store to improve testability and structure.
 */

export interface ReadinessFactors {
  gamification: {
    questSteps: {
      register: boolean;
      locate: boolean;
      ballot: boolean;
      ready: boolean;
      share: boolean;
    };
  };
  documentChecklist: { completed: boolean }[];
  eligibility: {
    status: 'not-checked' | 'eligible' | 'ineligible';
  };
  engagementScore: number;
  profile: {
    isFirstTimeVoter: boolean;
  };
}

export function calculateReadiness(factors: ReadinessFactors) {
  const { gamification, documentChecklist, eligibility, engagementScore, profile } = factors;
  
  // 1. Journey Score (40% weight)
  const questSteps = Object.values(gamification.questSteps);
  const completedQuests = questSteps.filter(Boolean).length;
  const totalQuests = questSteps.length;
  const journeyScore = (completedQuests / totalQuests) * 40;

  // 2. Checklist Score (20% weight)
  const totalDocs = documentChecklist.length;
  const completedDocs = documentChecklist.filter(d => d.completed).length;
  const docsScore = totalDocs > 0 ? (completedDocs / totalDocs) * 20 : 0;

  // 3. Eligibility Score (20% weight)
  let eligibilityScore = 0;
  if (eligibility.status === 'eligible') {
    eligibilityScore = 20;
  } else if (eligibility.status !== 'not-checked') {
    eligibilityScore = 10;
  }

  // 4. Engagement Score (20% weight)
  const engagementNormalized = Math.min(100, engagementScore);
  const sectionEngagementScore = (engagementNormalized / 100) * 20;

  const totalProgress = Math.min(100, Math.round(journeyScore + docsScore + eligibilityScore + sectionEngagementScore));
  
  // 5. Category & Nudges
  let category: 'Low' | 'Medium' | 'High' = 'Low';
  let nudge = '';

  if (totalProgress >= 70) {
    category = 'High';
    nudge = profile.isFirstTimeVoter 
      ? "You're almost ready for your first vote! Incredible progress." 
      : "You're almost ready to vote. Everything looks solid!";
  } else if (totalProgress >= 40) {
    category = 'Medium';
    nudge = gamification.questSteps.locate 
      ? "Find your booth next to cross the finish line." 
      : "Keep going! You're making steady progress.";
  } else {
    category = 'Low';
    nudge = "Complete your registration to improve your voting readiness.";
  }

  return {
    progress: totalProgress,
    category,
    nudge
  };
}

/**
 * Scoring Logic
 */
export function calculateQuizPoints(score: number): number {
  return score * 10;
}
