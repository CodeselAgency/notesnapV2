"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col lg:flex-row h-screen bg-slate-50 relative">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-xl shadow-sm"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed lg:relative lg:flex w-[280px] h-screen transition-all duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } z-[70]`}
        >
          <DashboardSidebar
            userEmail={userEmail}
            userName={userName}
            currentPlan={"Free"}
            usedPdfs={0}
            maxPdfs={10}
            usedMessages={0}
            maxMessages={10}
          />
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-[65]"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white w-full lg:w-[calc(100%-280px)] pt-16 lg:pt-0">
          <div className="min-h-full relative">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
