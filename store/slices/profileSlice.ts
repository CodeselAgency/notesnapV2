import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the profile interface for TypeScript (optional)
interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  subscription_tier: 'free' | 'premium' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  messages_used: number;
  pdfs_used: number;
  auto_renew: boolean;
  current_subscription_id: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/profile/`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data[0]; // Return the first profile object
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch profile"
      );
    }
  }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: Partial<Profile>, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to update profile"
      );
    }
  }
);

// Initial state
const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  lastFetchTime: null,
};

// Profile slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Clear profile data (useful for logout)
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.lastFetchTime = null;
    },
    
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Update specific profile fields locally (optimistic updates)
    updateProfileField: (state, action: PayloadAction<{ field: keyof Profile; value: any }>) => {
      if (state.profile) {
        const { field, value } = action.payload;
        (state.profile as any)[field] = value;
      }
    },
    
    // Update usage counters
    incrementMessagesUsed: (state) => {
      if (state.profile) {
        state.profile.messages_used += 1;
      }
    },
    
    incrementPdfsUsed: (state) => {
      if (state.profile) {
        state.profile.pdfs_used += 1;
      }
    },
    
    // Update subscription info
    updateSubscription: (state, action: PayloadAction<{
      tier?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      nextBillingDate?: string;
      subscriptionId?: string;
      autoRenew?: boolean;
    }>) => {
      if (state.profile) {
        const updates = action.payload;
        if (updates.tier) state.profile.subscription_tier = updates.tier as any;
        if (updates.status) state.profile.subscription_status = updates.status as any;
        if (updates.startDate) state.profile.subscription_start_date = updates.startDate;
        if (updates.endDate) state.profile.subscription_end_date = updates.endDate;
        if (updates.nextBillingDate) state.profile.next_billing_date = updates.nextBillingDate;
        if (updates.subscriptionId) state.profile.current_subscription_id = updates.subscriptionId;
        if (updates.autoRenew !== undefined) state.profile.auto_renew = updates.autoRenew;
      }
    },
  },
  
  extraReducers: (builder) => {
    // Fetch profile cases
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearProfile,
  clearError,
  updateProfileField,
  incrementMessagesUsed,
  incrementPdfsUsed,
  updateSubscription,
} = profileSlice.actions;

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;
export const selectIsSubscriptionActive = (state: { profile: ProfileState }) => 
  state.profile.profile?.subscription_status === 'active';
export const selectSubscriptionTier = (state: { profile: ProfileState }) => 
  state.profile.profile?.subscription_tier;
export const selectUsageStats = (state: { profile: ProfileState }) => ({
  messagesUsed: state.profile.profile?.messages_used || 0,
  pdfsUsed: state.profile.profile?.pdfs_used || 0,
});

export default profileSlice.reducer;