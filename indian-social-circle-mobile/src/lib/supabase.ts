import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here';

// Validate configuration
if (!supabaseUrl || supabaseUrl.includes('your-project') || supabaseUrl.includes('your-supabase-url')) {
  console.warn('⚠️ Supabase URL not configured properly. Please set EXPO_PUBLIC_SUPABASE_URL in your .env file');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey.includes('your-supabase-anon-key')) {
  console.warn('⚠️ Supabase Anon Key not configured properly. Please set EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client with AsyncStorage for persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Types for better TypeScript support
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  location?: string;
  interests?: string[];
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}

// Authentication helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name: string, phone?: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Sign out
  signOut: async (): Promise<AuthResponse> => {
    try {
      console.log('🟢 authHelpers: Starting Supabase signOut');
      const { error } = await supabase.auth.signOut();
      console.log('🟢 authHelpers: Supabase signOut completed, error:', error);

      if (error) {
        console.log('🟢 authHelpers: SignOut failed with error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('🟢 authHelpers: SignOut successful');
      return { success: true };
    } catch (error) {
      console.log('🟢 authHelpers: SignOut exception:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  // Reset password
  resetPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://indiansocialcircle.app/reset-password',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  },

  // Update password with reset token
  updatePassword: async (newPassword: string, resetToken?: string, refreshToken?: string): Promise<AuthResponse> => {
    try {
      console.log('🟢 authHelpers: updatePassword called with token:', !!resetToken);
      
      if (resetToken && refreshToken) {
        // Set the session using the tokens from the reset link
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: resetToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.log('🟢 authHelpers: setSession error:', sessionError.message);
          return { success: false, error: sessionError.message };
        }

        console.log('🟢 authHelpers: Session set successfully');
      }

      // Update password for the current user (now authenticated via the reset token)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.log('🟢 authHelpers: updatePassword error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('🟢 authHelpers: updatePassword successful');
      return { success: true };
    } catch (error) {
      console.log('🟢 authHelpers: updatePassword error:', (error as Error).message);
      return { success: false, error: (error as Error).message };
    }
  },
};

export default supabase;