import { useAppSelector, useAppDispatch } from "./store";
import { fetchProfile, clearProfile } from "@/store/slices/profileSlice";
import { useCallback } from "react";

export function useProfile() {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.profile);

  const loadProfile = useCallback(() => {
    return dispatch(fetchProfile());
  }, [dispatch]);

  const clearProfileError = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    clearError: clearProfileError,
  };
}
