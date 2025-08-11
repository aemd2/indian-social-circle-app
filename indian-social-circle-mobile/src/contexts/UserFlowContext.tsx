import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Types for user flow state
interface UserFlowState {
  // User authentication state
  isAuthenticated: boolean;
  user: any | null;
  onboardingCompleted: boolean;
  
  // App state
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Feature states
  notifications: any[];
  unreadCount: number;
  currentLanguage: string;
  selectedInterests: string[];
  
  // Edge case handling
  isNewUser: boolean;
  hasSeenTutorial: boolean;
  lastSyncTime: number;
}

// Action types for user flow management
type UserFlowAction =
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_ONBOARDING_COMPLETED'; payload: boolean }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_INTERESTS'; payload: string[] }
  | { type: 'SET_NEW_USER'; payload: boolean }
  | { type: 'SET_TUTORIAL_SEEN'; payload: boolean }
  | { type: 'SET_LAST_SYNC'; payload: number }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: UserFlowState = {
  isAuthenticated: false,
  user: null,
  onboardingCompleted: false,
  isOnline: true,
  isLoading: false,
  error: null,
  notifications: [],
  unreadCount: 0,
  currentLanguage: 'en',
  selectedInterests: [],
  isNewUser: true,
  hasSeenTutorial: false,
  lastSyncTime: Date.now(),
};

// Reducer for user flow state management
function userFlowReducer(state: UserFlowState, action: UserFlowAction): UserFlowState {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_ONBOARDING_COMPLETED':
      return { ...state, onboardingCompleted: action.payload };
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      const newUnreadCount = state.unreadCount + 1;
      return { 
        ...state, 
        notifications: newNotifications,
        unreadCount: newUnreadCount
      };
    
    case 'MARK_NOTIFICATION_READ':
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload 
          ? { ...notification, read: true }
          : notification
      );
      const updatedUnreadCount = Math.max(0, state.unreadCount - 1);
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedUnreadCount
      };
    
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    
    case 'SET_INTERESTS':
      return { ...state, selectedInterests: action.payload };
    
    case 'SET_NEW_USER':
      return { ...state, isNewUser: action.payload };
    
    case 'SET_TUTORIAL_SEEN':
      return { ...state, hasSeenTutorial: action.payload };
    
    case 'SET_LAST_SYNC':
      return { ...state, lastSyncTime: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface UserFlowContextType {
  state: UserFlowState;
  dispatch: React.Dispatch<UserFlowAction>;
  
  // User flow methods
  completeOnboarding: (userData: any) => Promise<void>;
  handleOfflineAction: (action: () => Promise<void>) => Promise<void>;
  showTutorial: () => void;
  markTutorialSeen: () => void;
  syncData: () => Promise<void>;
  handleError: (error: Error, context: string) => void;
  clearError: () => void;
}

// Create context
const UserFlowContext = createContext<UserFlowContextType | undefined>(undefined);

// Provider component
export function UserFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userFlowReducer, initialState);

  // Load persisted state on app start
  useEffect(() => {
    loadPersistedState();
    setupNetworkListener();
  }, []);

  // Load persisted state from AsyncStorage
  const loadPersistedState = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [
        user,
        onboardingCompleted,
        currentLanguage,
        selectedInterests,
        hasSeenTutorial,
        lastSyncTime
      ] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('onboardingCompleted'),
        AsyncStorage.getItem('currentLanguage'),
        AsyncStorage.getItem('selectedInterests'),
        AsyncStorage.getItem('hasSeenTutorial'),
        AsyncStorage.getItem('lastSyncTime'),
      ]);

      if (user) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      }

      if (onboardingCompleted) {
        dispatch({ type: 'SET_ONBOARDING_COMPLETED', payload: JSON.parse(onboardingCompleted) });
      }

      if (currentLanguage) {
        dispatch({ type: 'SET_LANGUAGE', payload: currentLanguage });
      }

      if (selectedInterests) {
        dispatch({ type: 'SET_INTERESTS', payload: JSON.parse(selectedInterests) });
      }

      if (hasSeenTutorial) {
        dispatch({ type: 'SET_TUTORIAL_SEEN', payload: JSON.parse(hasSeenTutorial) });
      }

      if (lastSyncTime) {
        dispatch({ type: 'SET_LAST_SYNC', payload: JSON.parse(lastSyncTime) });
      }

    } catch (error) {
      console.error('Error loading persisted state:', error);
      handleError(error as Error, 'loadPersistedState');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Setup network status listener
  const setupNetworkListener = () => {
    NetInfo.addEventListener((state: any) => {
      const isOnline = state.isConnected ?? false;
      dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });
      
      // Sync data when coming back online
      if (isOnline && state.isConnected) {
        syncData();
      }
    });
  };

  // Complete onboarding flow
  const completeOnboarding = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Save user data
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
      
      dispatch({ type: 'SET_USER', payload: userData });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_ONBOARDING_COMPLETED', payload: true });
      dispatch({ type: 'SET_NEW_USER', payload: false });
      
      // Sync with server if online
      if (state.isOnline) {
        await syncData();
      }
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      handleError(error as Error, 'completeOnboarding');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handle offline actions with queue
  const handleOfflineAction = async (action: () => Promise<void>) => {
    if (state.isOnline) {
      try {
        await action();
      } catch (error) {
        handleError(error as Error, 'handleOfflineAction');
      }
    } else {
      // Queue action for later execution
      const offlineQueue = await AsyncStorage.getItem('offlineQueue') || '[]';
      const queue = JSON.parse(offlineQueue);
      queue.push({ action: action.toString(), timestamp: Date.now() });
      await AsyncStorage.setItem('offlineQueue', JSON.stringify(queue));
      
      dispatch({ type: 'SET_ERROR', payload: 'Action queued for when you\'re back online' });
    }
  };

  // Show tutorial for new users
  const showTutorial = () => {
    if (state.isNewUser && !state.hasSeenTutorial) {
      // Tutorial logic would go here
      console.log('Showing tutorial for new user');
    }
  };

  // Mark tutorial as seen
  const markTutorialSeen = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTutorial', JSON.stringify(true));
      dispatch({ type: 'SET_TUTORIAL_SEEN', payload: true });
    } catch (error) {
      console.error('Error marking tutorial as seen:', error);
    }
  };

  // Sync data with server
  const syncData = async () => {
    if (!state.isOnline) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Process offline queue
      const offlineQueue = await AsyncStorage.getItem('offlineQueue') || '[]';
      const queue = JSON.parse(offlineQueue);
      
      if (queue.length > 0) {
        // Process queued actions
        for (const item of queue) {
          try {
            // Execute queued action
            console.log('Processing queued action:', item);
          } catch (error) {
            console.error('Error processing queued action:', error);
          }
        }
        
        // Clear queue
        await AsyncStorage.removeItem('offlineQueue');
      }
      
      // Update last sync time
      const now = Date.now();
      await AsyncStorage.setItem('lastSyncTime', JSON.stringify(now));
      dispatch({ type: 'SET_LAST_SYNC', payload: now });
      
    } catch (error) {
      console.error('Error syncing data:', error);
      handleError(error as Error, 'syncData');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handle errors with context
  const handleError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    let userMessage = 'An unexpected error occurred';
    
    // Handle specific error types
    if (error.message.includes('network')) {
      userMessage = 'Network error. Please check your connection.';
    } else if (error.message.includes('unauthorized')) {
      userMessage = 'Please sign in again.';
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } else if (error.message.includes('validation')) {
      userMessage = 'Please check your input and try again.';
    }
    
    dispatch({ type: 'SET_ERROR', payload: userMessage });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: UserFlowContextType = {
    state,
    dispatch,
    completeOnboarding,
    handleOfflineAction,
    showTutorial,
    markTutorialSeen,
    syncData,
    handleError,
    clearError,
  };

  return (
    <UserFlowContext.Provider value={value}>
      {children}
    </UserFlowContext.Provider>
  );
}

// Hook to use user flow context
export function useUserFlow() {
  const context = useContext(UserFlowContext);
  if (context === undefined) {
    throw new Error('useUserFlow must be used within a UserFlowProvider');
  }
  return context;
}