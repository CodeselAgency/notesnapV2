"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, initialized, router, redirectTo]);

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
          {" "}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children} </>;
}
