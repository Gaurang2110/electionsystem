import { useAppStore } from '@/store/useAppStore';

describe('User Journey Flow Integration', () => {
  beforeEach(() => {
    // Reset store to a clean state for testing the flow
    useAppStore.setState({
      progress: 0,
      gamification: {
        questSteps: {
          register: false,
          locate: false,
          ballot: false,
          ready: false,
          share: false,
        },
        points: 0,
        badges: [],
        unlockedStates: [],
        quizScore: 0,
        quizProgress: 3,
        hasLoggedReadyState: false,
      },
      eligibility: {
        age: null,
        isIndian: null,
        state: null,
        isRegistered: null,
        status: 'not-checked',
      },
      profile: { name: '', age: '', state: '', language: 'en' },
      documentChecklist: [],
      engagementScore: 0,
      activityLog: [],
    });
  });

  test('Full Journey: Onboarding -> Quiz -> Readiness Update', () => {
    const { 
      updateProfile, 
      setEligibility, 
      calculateProgress, 
      finishQuiz, 
      updateQuestStep,
      getUserInsights 
    } = useAppStore.getState();

    // 1. STEP: Onboarding
    // User fills profile and verifies eligibility
    updateProfile({ name: 'Test User', language: 'en' });
    setEligibility({ age: 25, isIndian: true, isRegistered: true });
    calculateProgress();

    let state = useAppStore.getState();
    expect(state.profile.name).toBe('Test User');
    expect(state.eligibility.status).toBe('eligible');
    expect(state.progress).toBeGreaterThan(0);
    const progressAfterOnboarding = state.progress;

    // 2. STEP: Knowledge Acquisition (Quiz)
    // User takes the quiz and scores points
    finishQuiz(10, 10); // Perfect score
    calculateProgress();

    state = useAppStore.getState();
    expect(state.gamification.quizScore).toBe(10);
    expect(state.gamification.points).toBeGreaterThan(0);
    expect(state.progress).toBeGreaterThan(progressAfterOnboarding);
    const progressAfterQuiz = state.progress;

    // 3. STEP: Action Completion (Locate Booth)
    // User interacts with map and marks booth as located
    updateQuestStep('locate', true);
    calculateProgress();

    state = useAppStore.getState();
    expect(state.gamification.questSteps.locate).toBe(true);
    expect(state.progress).toBeGreaterThan(progressAfterQuiz);
    
    // 4. VERIFICATION: Intelligence Insights
    // Verify that the journey is reflected in the intelligence layer
    const insights = getUserInsights();
    expect(insights.totalActions).toBeGreaterThan(0);
    expect(state.activityLog.length).toBeGreaterThan(0);
  });
});
