"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { initializeAuth } from "@/store/slices/authSlice";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
