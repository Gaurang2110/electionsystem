import { useAppStore } from '@/store/useAppStore';

describe('Election Assistant Store Logic', () => {
  beforeEach(() => {
    // Reset store before each test
    const { resetStore } = useAppStore.getState();
    // Since resetStore reloads the page in the actual app, 
    // we'll just manually reset the state for testing
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
      documentChecklist: [],
      engagementScore: 10,
    });
  });

  // TEST 1: Readiness score calculation
  test('Readiness score increases when eligibility is confirmed', () => {
    const { setEligibility, calculateProgress } = useAppStore.getState();
    
    setEligibility({ age: 25, isIndian: true });
    calculateProgress();
    
    const { progress } = useAppStore.getState();
    // Eligibility score weight is 20%
    // Engagement score (10) normalized is (10/100)*20 = 2%
    // Total should be ~22%
    expect(progress).toBeGreaterThanOrEqual(20);
  });

  // TEST 2: Quiz scoring
  test('Quiz completion updates points and total score correctly', () => {
    const { finishQuiz } = useAppStore.getState();
    const initialPoints = useAppStore.getState().gamification.points;
    
    // Correctly answering 5 questions (10 points each)
    finishQuiz(5, 5);
    
    const { gamification } = useAppStore.getState();
    expect(gamification.quizScore).toBe(5);
    expect(gamification.points).toBe(initialPoints + 50);
  });

  // TEST 3: Next step logic
  test('Suggests "Check Eligibility" when status is not-checked', () => {
    const { getNextBestAction } = useAppStore.getState();
    
    const action = getNextBestAction();
    expect(action.id).toBe('eligibility');
    expect(action.label).toContain('Check Eligibility');
  });

  test('Suggests "Complete Registration" when eligibility is done but registration is not', () => {
    const { setEligibility, getNextBestAction } = useAppStore.getState();
    
    setEligibility({ age: 25, isIndian: true });
    const action = getNextBestAction();
    
    expect(action.id).toBe('registration');
  });
});
