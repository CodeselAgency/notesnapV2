// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
    initialized: boolean
}

const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
    initialized: false,
}

// API route calls
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async () => {
        const response = await fetch('/api/auth/user')

        if (!response.ok) {
            if (response.status === 401) {
                return null // User not authenticated
            }
            throw new Error('Failed to fetch user')
        }

        const data = await response.json()
        return data.user
    }
)

export const signInWithGoogle = createAsyncThunk(
    'auth/signInWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ provider: 'google' }),
            })

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to sign in')
            }

            const data = await response.json()

            // Redirect to Google OAuth
            if (data.url) {
                window.location.href = data.url
                return null
            }

            return data.user
        } catch (error) {
            return rejectWithValue('Network error occurred')
        }
    }
)

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
            })

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to sign out')
            }

            return null
        } catch (error) {
            return rejectWithValue('Network error occurred')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        clearUser: (state) => {
            state.user = null
            state.loading = false
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
            state.loading = false
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Initialize auth
            .addCase(initializeAuth.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
                state.initialized = true
                state.error = null
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.loading = false
                state.initialized = true
                state.error = action.error.message || 'Failed to initialize auth'
            })

            // Google sign in
            .addCase(signInWithGoogle.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signInWithGoogle.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload
                }
                state.loading = false
                state.error = null
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string || 'Failed to sign in with Google'
            })

            // Sign out
            .addCase(signOut.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signOut.fulfilled, (state) => {
                state.user = null
                state.loading = false
                state.error = null
            })
            .addCase(signOut.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string || 'Failed to sign out'
            })
    },
})

export const { setUser, clearUser, setLoading, setError, clearError } = authSlice.actions
export default authSlice.reducer