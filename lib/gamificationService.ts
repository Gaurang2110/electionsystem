export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  points: number;
}

export const badges: Badge[] = [
  {
    id: 'badge_registered',
    label: 'Registered',
    icon: '🎖️',
    description: 'Officially added to the voter registry.',
    points: 50
  },
  {
    id: 'badge_booth_explorer',
    label: 'Booth Explorer',
    icon: '📍',
    description: 'Located your polling station on the map.',
    points: 50
  },
  {
    id: 'badge_informed_voter',
    label: 'Informed Voter',
    icon: '📚',
    description: 'Completed educational modules and ballot practice.',
    points: 50
  },
  {
    id: 'badge_ready_citizen',
    label: 'Ready Citizen',
    icon: '⚡',
    description: 'Achieved full voting readiness status.',
    points: 100
  },
  {
    id: 'badge_community_sharer',
    label: 'Community Sharer',
    icon: '📣',
    description: 'Helped others prepare for the election day.',
    points: 100
  },
  {
    id: 'badge_aware_citizen',
    label: 'Aware Citizen',
    icon: '🧐',
    description: 'Explored local constituency development and budget data.',
    points: 75
  },
  {
    id: 'badge_voted',
    label: 'I Voted!',
    icon: '🗳️',
    description: 'Completed the voting day journey and exercised your right.',
    points: 200
  },
  {
    id: 'badge_community_helper',
    label: 'Community Helper',
    icon: '🤝',
    description: 'Helped 3 or more people prepare for their voting journey.',
    points: 150
  }
];

export const getBadgeById = (id: string) => badges.find(b => b.id === id);

export const generateMockLeaderboard = (currentUserPoints: number, currentUserName: string | null) => {
  const mockData = [
    { id: 'mock_1', name: "Arun K.", points: 450, isCurrentUser: false },
    { id: 'mock_2', name: "Priya S.", points: 380, isCurrentUser: false },
    { id: 'mock_3', name: "Rahul M.", points: 320, isCurrentUser: false },
    { id: 'mock_4', name: "Sneha P.", points: 280, isCurrentUser: false },
    { id: 'mock_5', name: "Amit V.", points: 210, isCurrentUser: false },
    { id: 'mock_6', name: "Deepa R.", points: 190, isCurrentUser: false },
    { id: 'mock_7', name: "Sanjay G.", points: 150, isCurrentUser: false },
    { id: 'mock_8', name: "Anjali T.", points: 120, isCurrentUser: false },
    { id: 'mock_9', name: "Vikram B.", points: 90, isCurrentUser: false },
    { id: 'mock_10', name: "Meera J.", points: 60, isCurrentUser: false },
  ];

  const leaderboard = [
    ...mockData,
    {
      id: 'current_user',
      name: currentUserName || "Citizen (You)",
      points: currentUserPoints,
      isCurrentUser: true
    }
  ].sort((a, b) => b.points - a.points);

  return leaderboard.slice(0, 10); // Top 10 only
};
