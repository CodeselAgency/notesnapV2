import { useAppSelector, useAppDispatch } from '@/hooks/store'
import { signInWithGoogle, signOut, clearError } from '@/store/slices/authSlice'

export function useAuth() {
    const dispatch = useAppDispatch()
    const { user, loading, error, initialized } = useAppSelector((state) => state.auth)

    const signInGoogle = async () => {
        return dispatch(signInWithGoogle())
    }

    const logout = async () => {
        return dispatch(signOut())
    }

    const clearAuthError = () => {
        dispatch(clearError())
    }

    return {
        user,
        loading,
        error,
        initialized,
        signInWithGoogle: signInGoogle,
        signOut: logout,
        clearError: clearAuthError,
        isAuthenticated: !!user,
    }
}
