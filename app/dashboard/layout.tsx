"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name;

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50">
        <DashboardSidebar
          userEmail={userEmail}
          userName={userName}
          currentPlan={"Free"}
          usedPdfs={0}
          maxPdfs={10}
          usedMessages={0}
          maxMessages={10}
        />
        <main className="flex-1 overflow-auto bg-white">
          <div className="">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
