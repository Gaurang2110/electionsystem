import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import documents from '@/data/documents.json';
import * as analytics from '@/lib/analytics';
import { logFirebaseEvent } from '@/lib/firebase';

interface UserProfile {
  name: string | null;
  age: number | null;
  dob: string | null;
  state: string | null;
  district: string | null;
  language: string;
  isFirstTimeVoter: boolean;
  isRegistered: boolean;
  hasVoterId: boolean;
}

interface Notification {
  id: string;
  type: 'deadline' | 'incomplete' | 'eligibility' | 'voting' | 'document';
  message_key: string;
  isRead: boolean;
  timestamp: number;
  link?: string;
  data?: Record<string, string | number>;
}

interface GamificationState {
  questSteps: {
    register: boolean;
    locate: boolean;
    ballot: boolean;
    ready: boolean;
    share: boolean;
  };
  points: number;
  badges: string[];
  unlockedStates: string[];
  quizScore: number;
  quizProgress: number;
  hasLoggedReadyState: boolean;
}

interface UserState {
  isOnboarded: boolean;
  progress: number;
  completedSteps: string[];
  eligibility: {
    age: number | null;
    isIndian: boolean | null;
    state: string | null;
    isRegistered: boolean | null;
    status: 'not-checked' | 'eligible' | 'ineligible';
  };
  documentChecklist: { id: string; completed: boolean }[];
  userName: string | null;
  voterType: 'undecided' | 'first-time' | 'regular';
  engagementScore: number;
  profile: UserProfile;
  notifications: Notification[];
  gamification: GamificationState;
  readinessCategory: 'Low' | 'Medium' | 'High';
  readinessNudge: string;
  isVoted: boolean;
  peopleHelpedCount: number;
  isSimpleMode: boolean;
  isHighContrast: boolean;
  isNotificationOpen: boolean;
  analytics: { event: string; timestamp: number }[];
  leaderboardRank: number;
  
  // Actions
  setNotificationOpen: (open: boolean) => void;
  getNextBestAction: () => { id: string; label: string; link: string; impact: string };
  getMissingSteps: () => { id: string; label: string; link: string }[];
  setOnboarded: (status: boolean) => void;
  setUserName: (name: string) => void;
  toggleStep: (stepId: string) => void;
  toggleDocument: (docId: string) => void;
  setEligibility: (data: Partial<UserState['eligibility']>) => void;
  setVoterType: (type: 'first-time' | 'regular') => void;
  incrementEngagement: (points?: number) => void;
  getReadinessScore: () => number;
  calculateProgress: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (id?: string) => void;
  checkTriggers: () => void;
  updateQuestStep: (step: keyof GamificationState['questSteps'], completed: boolean) => void;
  unlockBadge: (badgeId: string) => void;
  addPoints: (amount: number) => void;
  resetStore: () => void;
  setVoted: (voted: boolean) => void;
  recordHelpAction: () => void;
  toggleSimpleMode: () => void;
  toggleHighContrast: () => void;
  logEvent: (event: string) => void;
  finishQuiz: (score: number, total: number) => void;
  unlockState: (stateId: string) => void;
}

export const useAppStore = create<UserState>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      progress: 0,
      completedSteps: [],
      eligibility: {
        age: null,
        isIndian: null,
        state: null,
        isRegistered: null,
        status: 'not-checked',
      },
      documentChecklist: documents.map(d => ({ id: d.id, completed: false })),
      userName: null,
      voterType: 'undecided',
      engagementScore: 10,
      profile: {
        name: null,
        age: null,
        dob: null,
        state: null,
        district: null,
        language: 'en',
        isFirstTimeVoter: false,
        isRegistered: false,
        hasVoterId: false,
      },
      notifications: [],
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
        quizProgress: 3, // Default for demo
        hasLoggedReadyState: false,
      },
      readinessCategory: 'Low',
      readinessNudge: 'Complete registration to improve readiness',
      isVoted: false,
      peopleHelpedCount: 0,
      isSimpleMode: false,
      isHighContrast: false,
      isNotificationOpen: false,
      analytics: [],
      leaderboardRank: 42, // Default for demo

      setNotificationOpen: (open) => set({ isNotificationOpen: open }),
      getNextBestAction: () => {
        const { eligibility, documentChecklist, gamification, completedSteps } = get();
        
        if (eligibility.status === 'not-checked') {
          return { id: 'eligibility', label: 'Check Eligibility', link: '/eligibility', impact: '+20%' };
        }
        
        if (!gamification.questSteps.register) {
          return { id: 'registration', label: 'Complete Registration', link: '/journey', impact: '+25%' };
        }

        if (!gamification.questSteps.locate) {
          return { id: 'locate', label: 'Find Your Booth', link: '/map', impact: '+15%' };
        }

        if (documentChecklist.some(d => !d.completed)) {
          return { id: 'documents', label: 'Complete Documents', link: '/documents', impact: '+20%' };
        }

        if (!gamification.questSteps.ballot) {
          return { id: 'ballot', label: 'Practice Mock Ballot', link: '/ballot', impact: '+15%' };
        }

        if (gamification.quizScore === 0) {
          return { id: 'quiz', label: 'Test Your Knowledge', link: '/quiz', impact: '+10%' };
        }

        if (!completedSteps.includes('laboratory_evm_sim')) {
          return { id: 'laboratory', label: 'Practice technical voting', link: '/laboratory', impact: '+5%' };
        }

        return { id: 'ready', label: 'You are ready to vote!', link: '/journey', impact: '100%' };
      },

      getReadinessScore: () => get().progress,

      getMissingSteps: () => {
        const { eligibility, documentChecklist, gamification } = get();
        const missing = [];

        if (eligibility.status !== 'eligible') {
          missing.push({ id: 'eligibility', label: 'Check Eligibility', link: '/eligibility' });
        }
        
        if (documentChecklist.some(d => !d.completed)) {
          missing.push({ id: 'documents', label: 'Complete Documents', link: '/documents' });
        }

        // Add all incomplete quest steps
        if (!gamification.questSteps.register) {
          missing.push({ id: 'registration', label: 'Register to Vote', link: '/journey' });
        }
        if (!gamification.questSteps.locate) {
          missing.push({ id: 'locate', label: 'Find Your Booth', link: '/map' });
        }
        if (!gamification.questSteps.ballot) {
          missing.push({ id: 'ballot', label: 'Practice Mock Ballot', link: '/ballot' });
        }
        if (!gamification.questSteps.ready) {
          missing.push({ id: 'ready', label: 'Confirm Readiness', link: '/eligibility' });
        }
        if (!gamification.questSteps.share) {
          missing.push({ id: 'share', label: 'Invite Community', link: '/share' });
        }

        return missing;
      },

      resetStore: () => {
        localStorage.removeItem('civic-ai-storage');
        window.location.reload();
      },

      setVoted: (voted: boolean) => set({ isVoted: voted }),

      recordHelpAction: () => {
        const { peopleHelpedCount, unlockBadge } = get();
        const newCount = peopleHelpedCount + 1;
        set({ peopleHelpedCount: newCount });
        
        if (newCount >= 3) {
          unlockBadge('badge_community_helper');
        }
      },

      toggleSimpleMode: () => set((state) => ({ isSimpleMode: !state.isSimpleMode })),

      toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),

      logEvent: (eventName: string) => {
        analytics.event({
          action: eventName,
          category: 'user_action',
          label: eventName,
        });
        set((state) => ({
          analytics: [{ event: eventName, timestamp: Date.now() }, ...state.analytics].slice(0, 100)
        }));
      },

      setOnboarded: (status: boolean) => set({ isOnboarded: status }),
      setUserName: (name: string) => set((state: UserState) => ({ 
        userName: name,
        profile: { ...state.profile, name } 
      })),
      
      toggleStep: (stepId) => {
        const { completedSteps } = get();
        const newSteps = completedSteps.includes(stepId)
          ? completedSteps.filter((id) => id !== stepId)
          : [...completedSteps, stepId];
        set({ completedSteps: newSteps });
        get().calculateProgress();
      },

      toggleDocument: (docId) => {
        const { documentChecklist } = get();
        const newChecklist = documentChecklist.map((doc) =>
          doc.id === docId ? { ...doc, completed: !doc.completed } : doc
        );
        set({ documentChecklist: newChecklist });
        get().calculateProgress();
      },

      setEligibility: (data) => set((state) => {
        const newEligibility = { ...state.eligibility, ...data };
        
        // Auto-calculate status if necessary fields are present
        if (newEligibility.age !== null && newEligibility.isIndian !== null) {
          newEligibility.status = (newEligibility.age >= 18 && newEligibility.isIndian) 
            ? 'eligible' 
            : 'ineligible';
        }

        return {
          eligibility: newEligibility,
          profile: { 
            ...state.profile, 
            age: data.age ?? state.profile.age,
            state: data.state ?? state.profile.state,
            isRegistered: data.isRegistered ?? state.profile.isRegistered
          }
        };
      }),
      
      setVoterType: (type) => set((state) => ({ 
        voterType: type,
        profile: { ...state.profile, isFirstTimeVoter: type === 'first-time' }
      })),

      incrementEngagement: (points = 5) => {
        set((state) => ({ engagementScore: state.engagementScore + points }));
      },

      calculateProgress: () => {
        const { gamification, documentChecklist, eligibility, engagementScore, profile } = get();
        
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
        // Normalize: 100 engagement points = 100% of this section
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

        set({ 
          progress: totalProgress,
          readinessCategory: category,
          readinessNudge: nudge
        });
        
        // --- FIREBASE EVENT LOGGING ---
        if (totalProgress >= 80 && !gamification.hasLoggedReadyState) {
          logFirebaseEvent('user_ready_state', {
            progress: totalProgress,
            category: category,
            timestamp: Date.now()
          });
          set((state) => ({
            gamification: { ...state.gamification, hasLoggedReadyState: true }
          }));
        }

        // Trigger dynamic notifications
        get().checkTriggers();
      },

      updateProfile: (data) => set((state) => {
        const newProfile = { ...state.profile, ...data };
        return {
          profile: newProfile,
          userName: data.name ?? state.userName,
          voterType: data.isFirstTimeVoter !== undefined 
            ? (data.isFirstTimeVoter ? 'first-time' : 'regular') 
            : state.voterType,
          // Sync profile updates back to eligibility
          eligibility: {
            ...state.eligibility,
            age: data.age ?? state.eligibility.age,
            state: data.state ?? state.eligibility.state,
            isRegistered: data.isRegistered ?? state.eligibility.isRegistered,
          }
        };
      }),

      addNotification: (notif) => {
        const { notifications } = get();
        // Don't add duplicate incomplete profile notifications
        if (notif.type === 'incomplete' && notifications.some(n => n.type === 'incomplete')) return;
        
        const newNotif: Notification = {
          ...notif,
          id: Math.random().toString(36).substr(2, 9),
          isRead: false,
          timestamp: Date.now()
        };
        set({ notifications: [newNotif, ...notifications].slice(0, 20) });
      },

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          (id === undefined || n.id === id) ? { ...n, isRead: true } : n
        )
      })),

      addPoints: (amount) => set((state) => ({ 
        gamification: { ...state.gamification, points: state.gamification.points + amount } 
      })),
      
      unlockBadge: (badgeId) => set((state) => {
        if (state.gamification.badges.includes(badgeId)) return state;
        return {
          gamification: { 
            ...state.gamification, 
            badges: [...state.gamification.badges, badgeId],
            points: state.gamification.points + 50
          }
        };
      }),

      updateQuestStep: (step, completed) => {
        const state = get();
        const isNewCompletion = !state.gamification.questSteps[step] && completed;
        if (isNewCompletion) {
          get().logEvent(`journey_step_${step}_complete`);
          analytics.event({
            action: 'journey_step_complete',
            category: 'journey',
            label: step,
          });
        }
        const newQuestSteps = { ...state.gamification.questSteps, [step]: completed };
        
        set((state) => ({
          gamification: { 
            ...state.gamification, 
            questSteps: newQuestSteps,
            points: state.gamification.points + (isNewCompletion ? 20 : 0)
          }
        }));
        
        get().calculateProgress();
      },

      unlockState: (stateId) => set((state) => {
        if (state.gamification.unlockedStates.includes(stateId)) return state;
        return {
          gamification: {
            ...state.gamification,
            unlockedStates: [...state.gamification.unlockedStates, stateId],
            points: state.gamification.points + 25
          }
        };
      }),

      finishQuiz: (score, total) => {
        get().logEvent(`quiz_complete_score_${score}`);
        analytics.event({
          action: 'quiz_complete',
          category: 'gamification',
          label: `score_${score}_of_${total}`,
          value: score,
        });
        set((state) => ({
          gamification: {
            ...state.gamification,
            quizScore: state.gamification.quizScore + score,
            points: state.gamification.points + (score * 10)
          }
        }));
      },

      checkTriggers: () => {
        const { progress, eligibility, documentChecklist, completedSteps, notifications, gamification } = get();
        const currentDate = new Date('2026-04-30');
        
        // --- NOTIFICATION TRIGGERS ---
        if (progress < 50 && !notifications.some(n => n.type === 'incomplete')) {
          get().addNotification({ type: 'incomplete', message_key: 'notif_incomplete_profile', link: '/profile' });
        }

        if (eligibility.status === 'eligible' && !notifications.some(n => n.type === 'eligibility')) {
          get().addNotification({ type: 'eligibility', message_key: 'notif_eligible_now', link: '/eligibility' });
        }

        const timeline = [
          { id: 'reg_deadline', date: '2026-05-15', type: 'deadline', step: 'registration', msg: 'notif_deadline_registration' },
          { id: 'voting_day', date: '2026-05-20', type: 'voting', step: 'vote', msg: 'notif_voting_day' }
        ];

        timeline.forEach(event => {
          const eventDate = new Date(event.date);
          const diffDays = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 15 && !completedSteps.includes(event.step)) {
            if (!notifications.some(n => n.message_key === event.msg)) {
              get().addNotification({ type: event.type as 'deadline' | 'incomplete' | 'eligibility' | 'voting' | 'document', message_key: event.msg, link: event.step === 'registration' ? '/journey' : '/' });
            }
          }
        });

        const pendingDocs = documentChecklist.filter(d => !d.completed).length;
        if (pendingDocs > 0 && progress > 20 && !notifications.some(n => n.type === 'document')) {
          get().addNotification({ type: 'document', message_key: 'notif_document_pending', link: '/documents', data: { count: pendingDocs } });
        }

        // --- GAMIFICATION QUEST TRIGGERS ---
        if (eligibility.isRegistered && !gamification.questSteps.register) {
          get().updateQuestStep('register', true);
          get().unlockBadge('badge_registered');
        }

        if (completedSteps.includes('booth') && !gamification.questSteps.locate) {
          get().updateQuestStep('locate', true);
          get().unlockBadge('badge_booth_explorer');
        }

        if (completedSteps.includes('ballot') && !gamification.questSteps.ballot) {
          get().updateQuestStep('ballot', true);
          get().unlockBadge('badge_informed_voter');
        }

        if (progress >= 80 && !gamification.questSteps.ready) {
          get().updateQuestStep('ready', true);
          get().unlockBadge('badge_ready_citizen');
        }

        if (completedSteps.includes('share') && !gamification.questSteps.share) {
          get().updateQuestStep('share', true);
          get().unlockBadge('badge_community_sharer');
        }
      }
    }),
    {
      name: 'civic-ai-storage',
    }
  )
);
