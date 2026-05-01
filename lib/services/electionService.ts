import elections from '@/data/elections.json';
import booths from '@/data/booths.json';
import documents from '@/data/documents.json';
import faq from '@/data/faq.json';

export const getElectionTimeline = () => {
  return elections.map(event => ({
    ...event,
    daysLeft: Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }));
};

export const getBoothByPincode = (pincode: string) => {
  const boothData = (booths as Record<string, any>)[pincode];
  return boothData || [];
};

export const checkEligibility = (userData: { age: number | null; isIndian: boolean | null }) => {
  if (!userData.age || userData.isIndian === null) return { status: 'incomplete', message: 'Please provide all details' };
  
  if (userData.age >= 18 && userData.isIndian) {
    return { status: 'eligible', message: 'You are eligible to vote!' };
  } else if (userData.age < 18) {
    return { status: 'ineligible', message: 'You must be 18 or older to vote.' };
  } else {
    return { status: 'ineligible', message: 'Only Indian citizens are eligible to vote.' };
  }
};

export const getChecklist = () => {
  return documents;
};

export const getFAQResponse = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  
  // Simple keyword matching with scoring
  const matches = faq.map(item => {
    let score = 0;
    item.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword.toLowerCase())) score++;
    });
    return { ...item, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matches.length > 0) return matches[0].answer;

  return "I'm not sure about that. Try asking about registration, documents, or booth location. You can also visit voters.eci.gov.in for official details.";
};
