import React, { useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Linking } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import navigation utilities
import { setNavigationRef, navigateToNotFound } from '../utils/navigationHelper';

// Import screens using consolidated structure
// Main screens
import Welcome from '../screens/Welcome';
import Home from '../screens/Home';
import Discover from '../screens/Discover';
import Groups from '../screens/Groups';
import Reviews from '../screens/Reviews';
import Challenges from '../screens/Challenges';
import Profile from '../screens/Profile';
import Create from '../screens/Create';
import NotFound from '../screens/NotFound';

// Auth screens  
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import ForgotPassword from '../screens/auth/ForgotPassword';
import ResetPassword from '../screens/auth/ResetPassword';

// Onboarding screens
import ProfileSetup from '../screens/onboarding/ProfileSetup';
import Interests from '../screens/onboarding/Interests';
import Language from '../screens/onboarding/Language';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main app
// Uses consistent design system colors and modern mobile UX patterns
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Icon mapping with consistent outline/filled pattern
          const iconMap: Record<string, { filled: string; outline: string }> = {
            Home: { filled: 'home', outline: 'home-outline' },
            Reviews: { filled: 'star', outline: 'star-outline' },
            Discover: { filled: 'compass', outline: 'compass-outline' },
            Create: { filled: 'add-circle', outline: 'add-circle-outline' },
            Challenges: { filled: 'trophy', outline: 'trophy-outline' },
            Groups: { filled: 'people', outline: 'people-outline' },
            Profile: { filled: 'person', outline: 'person-outline' },
          };

          const iconName = focused 
            ? iconMap[route.name]?.filled || 'star'
            : iconMap[route.name]?.outline || 'star-outline';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1890ff', // Consistent with our button primary color
        tabBarInactiveTintColor: '#8c8c8c',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTintColor: '#333333',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      {/* Optimized tab order for better UX: Home as entry point, then discovery and social features */}
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={Discover}
        options={{
          title: 'Discover',
          headerShown: true,
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={Create}
        options={{
          title: 'Create',
          tabBarButton: (props) => {
            // Custom floating action button with consistent design
            const { onPress, accessibilityState } = props;
            return (
              <TouchableOpacity
                onPress={onPress}
                accessibilityState={accessibilityState}
                style={styles.createButton}
              >
                <View style={styles.createButtonInner}>
                  <Ionicons name="add" size={28} color="#ffffff" />
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen 
        name="Groups" 
        component={Groups}
        options={{
          title: 'Groups',
          headerShown: true,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator with improved organization and consistent design
export default function AppNavigator() {
  // Create navigation reference for global navigation
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  // Set up navigation reference when component mounts
  React.useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
  }, []);

  // Handle navigation state changes and errors
  const handleNavigationStateChange = (state: any) => {
    // Log navigation state for debugging
    if (__DEV__) {
      console.log('Navigation state changed:', state);
    }
    
    // Check for invalid navigation attempts
    const currentRoute = state?.routes?.[state.index];
    if (currentRoute && !routeExists(currentRoute.name)) {
      console.warn('Invalid route detected:', currentRoute.name);
      navigateToNotFound(`Route "${currentRoute.name}" not found`);
    }
  };

  // Handle deep linking errors
  const handleDeepLinkError = (error: string) => {
    console.warn('Deep link error:', error);
    navigateToNotFound('Invalid deep link');
  };

  // Import route validation function
  const routeExists = (routeName: string): boolean => {
    const validRoutes = [
      'Welcome', 'SignIn', 'SignUp', 'ForgotPassword', 'ResetPassword',
      'Language', 'Interests', 'ProfileSetup', 'MainApp',
      'Reviews', 'Challenges', 'NotFound'
    ];
    return validRoutes.includes(routeName);
  };

  const linking = {
    prefixes: ['indiansocialcircle://', 'https://indiansocialcircle.app'],
    config: {
      screens: {
        Welcome: '',
        SignIn: 'signin',
        SignUp: 'signup',
        ForgotPassword: 'forgot-password',
        ResetPassword: {
          path: 'reset-password',
          parse: {
            token: (token: string) => token,
          },
        },
        Language: 'onboarding/language',
        Interests: 'onboarding/interests',
        ProfileSetup: 'onboarding/profile',
        MainApp: {
          screens: {
            Home: 'home',
            Discover: 'discover',
            Create: 'create',
            Groups: 'groups',
            Profile: 'profile',
          },
        },
        Reviews: 'reviews',
        Challenges: 'challenges',
        NotFound: '*', // Catch-all for invalid routes
      },
    },
    // Custom URL parsing for Supabase hash fragments
    getInitialURL: async () => {
      // Check if app was opened via URL
      const url = await Linking.getInitialURL();
      console.log('Initial URL:', url);
      
      if (url) {
        return processSupabaseURL(url);
      }
      
      return null;
    },
    subscribe: (listener: (url: string) => void) => {
      const subscription = Linking.addEventListener('url', ({ url }) => {
        console.log('URL event:', url);
        const processedUrl = processSupabaseURL(url);
        if (processedUrl) {
          listener(processedUrl);
        }
      });

      return () => subscription?.remove();
    },
  };

  // Process Supabase URLs with hash fragments
  const processSupabaseURL = (url: string): string | null => {
    try {
      console.log('Processing URL:', url);
      
      // Check if it's a reset password URL
      if (url.includes('reset-password') || url.includes('#access_token=')) {
        // Extract tokens from URL hash
        const urlObj = new URL(url);
        const hash = urlObj.hash.substring(1); // Remove #
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log('Extracted params:', { accessToken, refreshToken, type });
        
        if (type === 'recovery' && accessToken) {
          // This is a password reset link
          return `https://indiansocialcircle.app/reset-password?token=${accessToken}&refresh_token=${refreshToken}`;
        }
      }
      
      return url;
    } catch (error) {
      console.error('Error processing Supabase URL:', error);
      return url;
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onStateChange={handleNavigationStateChange}
      fallback={undefined} // You can add a loading screen here
    >
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      >
        {/* ===== WELCOME & AUTH FLOW ===== */}
        <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{ 
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back from welcome
          }}
        />
        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{ 
            headerShown: false,
          }}
        />
        
        {/* ===== ONBOARDING FLOW ===== */}
        <Stack.Screen 
          name="Language" 
          component={Language} 
          options={{ 
            title: 'Choose Language',
            headerLeft: () => null, // No back button during onboarding
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Interests" 
          component={Interests} 
          options={{ 
            title: 'Select Your Interests',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="ProfileSetup" 
          component={ProfileSetup} 
          options={{ 
            title: 'Complete Your Profile',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        
        {/* ===== MAIN APPLICATION ===== */}
        <Stack.Screen 
          name="MainApp" 
          component={MainTabNavigator} 
          options={{ 
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back from main app
          }}
        />
        
        {/* ===== MODAL/ADDITIONAL SCREENS ===== */}
        <Stack.Screen 
          name="Reviews" 
          component={Reviews} 
          options={{ 
            title: 'Reviews',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="Challenges" 
          component={Challenges} 
          options={{ 
            title: 'Challenges',
            presentation: 'modal',
          }}
        />
        
        {/* ===== ERROR HANDLING ===== */}
        <Stack.Screen 
          name="NotFound" 
          component={NotFound} 
          options={{ 
            title: 'Page Not Found',
            headerBackTitle: 'Back',
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles for the navigation components
const styles = StyleSheet.create({
  createButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  createButtonInner: {
    backgroundColor: '#1890ff', // Consistent with our primary color
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});