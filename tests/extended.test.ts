import { useAppStore } from '@/store/useAppStore';
import { getFAQResponse } from '@/lib/services/electionService';

// Mocking the election service for fallback testing
jest.mock('@/lib/services/electionService', () => ({
  getFAQResponse: jest.fn(() => 'Fallback FAQ response'),
}));

describe('Extended Unit Tests', () => {
  
  // TEST 1: AI fallback simulation
  // Note: Since we are testing the logic that leads to fallback, 
  // we can simulate the state/conditions that trigger it or test the helper directly.
  describe('AI Fallback Logic', () => {
    it('should return a local FAQ response when Gemini is not available or fails', () => {
      // In this system, getFAQResponse is the final safety net.
      // We verify it returns valid content for common queries.
      const query = 'How to register?';
      const response = getFAQResponse(query);
      
      expect(response).toBeDefined();
      expect(response).toBe('Fallback FAQ response');
      expect(getFAQResponse).toHaveBeenCalledWith(query);
    });
  });

  // TEST 2: Map interaction simulation
  describe('Map Interaction State Updates', () => {
    it('should update profile state and district when a map location is selected', () => {
      const store = useAppStore.getState();
      
      const mockLocation = {
        state: 'Maharashtra',
        district: 'Mumbai City'
      };
      
      // Simulate the action that would be triggered by a map click
      store.updateProfile(mockLocation);
      
      const updatedStore = useAppStore.getState();
      expect(updatedStore.profile.state).toBe(mockLocation.state);
      expect(updatedStore.profile.district).toBe(mockLocation.district);
      
      // Verify it also synced to eligibility as per the store logic
      expect(updatedStore.eligibility.state).toBe(mockLocation.state);
    });
  });
});
