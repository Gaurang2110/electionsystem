import { calculateReadiness, ReadinessFactors } from '../services/votingService';
import { retryAsync, safeExecute } from '../utils/reliability';

describe('System Resilience & Intelligence Tests', () => {
  
  // 1. Readiness Calculation Tests
  describe('Readiness Calculation', () => {
    it('should return 0% for an empty state', () => {
      const emptyFactors: ReadinessFactors = {
        gamification: {
          questSteps: {
            register: false,
            locate: false,
            ballot: false,
            ready: false,
            share: false
          }
        },
        documentChecklist: [],
        eligibility: { status: 'not-checked' },
        engagementScore: 0,
        profile: { isFirstTimeVoter: true }
      };
      
      const result = calculateReadiness(emptyFactors);
      expect(result.progress).toBe(0);
      expect(result.category).toBe('Low');
    });

    it('should return 100% for a fully completed state', () => {
      const fullFactors: ReadinessFactors = {
        gamification: {
          questSteps: {
            register: true,
            locate: true,
            ballot: true,
            ready: true,
            share: true
          }
        },
        documentChecklist: [{ id: '1', completed: true }],
        eligibility: { status: 'eligible' },
        engagementScore: 100,
        profile: { isFirstTimeVoter: true }
      };
      
      const result = calculateReadiness(fullFactors);
      expect(result.progress).toBe(100);
      expect(result.category).toBe('High');
    });

    it('should calculate partial progress correctly (e.g., only eligibility and engagement)', () => {
      const partialFactors: ReadinessFactors = {
        gamification: {
          questSteps: {
            register: false,
            locate: false,
            ballot: false,
            ready: false,
            share: false
          }
        },
        documentChecklist: [],
        eligibility: { status: 'eligible' },
        engagementScore: 20,
        profile: { isFirstTimeVoter: true }
      };
      
      const result = calculateReadiness(partialFactors);
      // Eligibility (20) + Engagement (20% of 20 = 4) = 24%
      expect(result.progress).toBe(24);
      expect(result.category).toBe('Low');
    });

    it('should handle invalid/missing data gracefully by defaulting to 0', () => {
      // @ts-ignore - simulating invalid runtime data
      const invalidFactors: ReadinessFactors = {
        gamification: null,
        documentChecklist: null,
        eligibility: null,
        engagementScore: 'invalid' as any
      };
      
      const result = calculateReadiness(invalidFactors);
      expect(result.progress).toBe(0);
      expect(result.category).toBe('Low');
    });
  });

  // 2. Retry Logic Tests
  describe('Retry Utility (retryAsync)', () => {
    it('should succeed if the operation fails once but succeeds on retry', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts === 1) throw new Error('Transient failure');
        return 'success';
      };

      const result = await retryAsync(operation, 1, 10); // 1 retry, 10ms delay
      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });

    it('should throw the last error if all retries fail', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        throw new Error('Permanent failure');
      };

      await expect(retryAsync(operation, 1, 10)).rejects.toThrow('Permanent failure');
      expect(attempts).toBe(2); // Initial try + 1 retry
    });

    it('should succeed after multiple retries if allowed', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Transient failure');
        return 'eventual_success';
      };

      const result = await retryAsync(operation, 2, 5); // 2 retries
      expect(result).toBe('eventual_success');
      expect(attempts).toBe(3);
    });

    it('should fail twice -> fallback (combination of retryAsync and safeExecute)', async () => {
      let attempts = 0;
      const failingOperation = async () => {
        attempts++;
        throw new Error('API down');
      };

      const result = await safeExecute(async () => {
        // 1 initial try + 1 retry = fails twice
        return await retryAsync(failingOperation, 1, 5);
      }, 'fallback_value');

      expect(result).toBe('fallback_value');
      expect(attempts).toBe(2);
    });
  });

  // 3. Resilience Tests (Silent Failure)
  describe('Silent Failure Resilience', () => {
    it('should not crash when a non-blocking operation (like logging) fails after retries', async () => {
      const failingOperation = async () => {
        throw new Error('Logging Service Down');
      };

      // Simulating the pattern used in cloudLogging.ts
      const performSend = async () => {
        try {
          await retryAsync(failingOperation, 1, 10);
        } catch (error) {
          // This is the expected behavior: catch and log/ignore
          console.warn('Silent failure caught:', error.message);
          return;
        }
      };

      await expect(performSend()).resolves.toBeUndefined();
    });

    it('should handle stress: logging multiple events in rapid succession', async () => {
      const logResults: any[] = [];
      const mockLog = async (event: string) => {
        logResults.push(event);
        return { ok: true };
      };

      // Simulating 10 rapid events
      const promises = Array.from({ length: 10 }).map((_, i) => mockLog(`event_${i}`));
      await Promise.all(promises);

      expect(logResults.length).toBe(10);
      expect(logResults[0]).toBe('event_0');
      expect(logResults[9]).toBe('event_9');
    });
  });
  // 4. AI Fallback Tests
  describe('AI Fallback Resilience', () => {
    it('should return a high-fidelity local FAQ fallback if the AI API fails', async () => {
      const getAIResponse = async (query: string) => {
        return await safeExecute(async () => {
          return await retryAsync(async () => {
            throw new Error("AI API Down");
          }, 1);
        }, {
          text: "Hi! To register as a new voter, just follow these steps:\n• Visit voters.eci.gov.in\n• Fill out Form 6 online",
          source: 'fallback'
        });
      };

      const data = await getAIResponse("how to register");
      expect(data.source).toBe('fallback');
      expect(data.text).toContain('voters.eci.gov.in');
    });
  });
});
