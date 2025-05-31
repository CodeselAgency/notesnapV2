import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SubscriptionLimit {
  tier: string;
  max_pdfs: number;
  max_messages: number;
  price_monthly: number;
  price_yearly: number;
  price_weekly: number;
}

interface SubscriptionState {
  limits: SubscriptionLimit[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  initialized: boolean;
}

const initialState: SubscriptionState = {
  limits: [],
  status: "idle",
  error: null,
  initialized: false
};

export const fetchSubscriptionLimits = createAsyncThunk(
  "subscription/fetchLimits",
  async () => {
    try {
      // Remove the trailing slash to match the route
      const response = await fetch(`/api/subscription`);
      if (!response.ok) throw new Error("Failed to fetch subscription limits");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching subscription limits:", error);
      throw error;
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    resetSubscriptionStatus: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionLimits.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionLimits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.limits = action.payload;
        state.initialized = true;
      })
      .addCase(fetchSubscriptionLimits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
        state.initialized = true;
      });
  }
});

export const { resetSubscriptionStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;