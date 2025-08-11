import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import reusable components
import Container from '@components/layout/Container';
import Header from '@components/layout/Header';
import ChallengeCard from '@components/challenges/ChallengeCard';
import ReviewCard from '@components/reviews/ReviewCard';
import { Button } from '@ui/core';
import { StatCard } from '@ui/mobile';

const mockChallenges = [
  {
    id: '1',
    title: 'Dance to Your Favorite Bollywood Song',
    description: 'Show us your best dance moves to any Bollywood track! Get creative and have fun.',
    creator: {
      name: 'Priya Sharma',
      avatar: '👩'
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
      avatar: '👨'
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
      avatar: '👩'
    },
    participantCount: 67,
    deadline: '7 days left',
    type: 'skill' as const,
    mediaUrl: '/placeholder.svg',
    likes: 145,
    comments: 28
  }
];

const mockReviews = [
  {
    id: '1',
    reviewer: {
      name: 'Amit Verma',
      avatar: '👨',
      location: 'Mumbai'
    },
    reviewedUser: {
      name: 'Priya Sharma',
      avatar: '👩',
      profession: 'Photographer'
    },
    rating: 5,
    reviewText: 'Priya did an amazing job with our family photoshoot. Very professional and creative!',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 3,
    category: 'Professional'
  },
  {
    id: '2',
    reviewer: {
      name: 'Sneha Reddy',
      avatar: '👩',
      location: 'Bangalore'
    },
    reviewedUser: {
      name: 'Raj Kumar',
      avatar: '👨',
      profession: 'Chef'
    },
    rating: 4,
    reviewText: 'Great cooking skills! The biryani was authentic and delicious.',
    timestamp: '5 hours ago',
    likes: 8,
    comments: 2,
    category: 'Service'
  }
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Container scroll={true} safe={true} padding="none">
      {/* Gradient Header */}
      <LinearGradient
        colors={['#ff6b6b', '#ee5a52']}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Namaste! 🙏</Text>
            <Text style={styles.subtitle}>Welcome back to your community</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications' as never)}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats Section */}
        <View style={styles.statsRow}>
          <StatCard
            icon="people"
            iconBackground="#1890ff"
            value="1.2K"
            label="Connections"
          />
          <StatCard
            icon="star"
            iconBackground="#f39c12"
            value="4.8"
            label="Rating"
          />
          <StatCard
            icon="trophy"
            iconBackground="#27ae60"
            value="23"
            label="Challenges"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('CreateChallenge' as never)}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#e6f7ff' }]}>
                  <Ionicons name="add-circle-outline" size={24} color="#1890ff" />
                </View>
                <Text style={styles.actionLabel}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Discover' as never)}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#f3e5f5' }]}>
                  <Ionicons name="search-outline" size={24} color="#8e44ad" />
                </View>
                <Text style={styles.actionLabel}>Discover</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Groups' as never)}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#e6ffe6' }]}>
                  <Ionicons name="people-outline" size={24} color="#27ae60" />
                </View>
                <Text style={styles.actionLabel}>Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Reviews' as never)}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#fff7e6' }]}>
                  <Ionicons name="star-outline" size={24} color="#f39c12" />
                </View>
                <Text style={styles.actionLabel}>Reviews</Text>
              </TouchableOpacity>
            </View>
        </View>

        {/* Trending Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Challenges 🔥</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Challenges' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={() => console.log('Join challenge:', challenge.id)}
              onLike={() => console.log('Like challenge:', challenge.id)}
              onComment={() => console.log('Comment on challenge:', challenge.id)}
            />
          ))}
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews ⭐</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reviews' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onLike={() => console.log('Like review:', review.id)}
              onComment={() => console.log('Comment on review:', review.id)}
              onViewProfile={() => console.log('View profile')}
            />
          ))}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  gradientHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  content: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: '500',
  },
});