import MobileLayout from '@/components/layout/MobileLayout';
import HeroSection from '@/components/home/HeroSection';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockChallenges = [
  {
    id: '1',
    title: 'Dance to Your Favorite Bollywood Song',
    description: 'Show us your best dance moves to any Bollywood track! Get creative and have fun.',
    creator: {
      name: 'Priya Sharma',
      avatar: '/placeholder.svg'
    },
    participantCount: 156,
    deadline: '3 days left',
    type: 'video' as const,
    mediaUrl: '/placeholder.svg',
    likes: 234,
    comments: 45
  },
  {
    id: '2',
    title: 'Street Food Photography',
    description: 'Capture the vibrant street food culture of India. Share your most appetizing shots!',
    creator: {
      name: 'Arjun Patel',
      avatar: '/placeholder.svg'
    },
    participantCount: 89,
    deadline: '5 days left',
    type: 'photo' as const,
    mediaUrl: '/placeholder.svg',
    likes: 187,
    comments: 32
  },
  {
    id: '3',
    title: 'Yoga Morning Routine',
    description: 'Share your morning yoga practice and inspire others to start their day mindfully.',
    creator: {
      name: 'Meera Singh',
      avatar: '/placeholder.svg'
    },
    participantCount: 67,
    deadline: '1 week left',
    type: 'skill' as const,
    likes: 156,
    comments: 28
  }
];

export default function Home() {
  return (
    <MobileLayout>
      <div className="animate-fade-in">
        <HeroSection />
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Trending Challenges</h2>
          
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-6">
              {mockChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </MobileLayout>
  );
}