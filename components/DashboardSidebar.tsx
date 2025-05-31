"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Settings,
  Crown,
  User,
  ChevronRight,
  Sparkles,
  Zap,
  Bot,
  FileCode,
  Layout,
  X,
  LogOut,
  Mail,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useBoard } from "@/hooks/useBoard";
import { CreateBoardModal } from "./UI/CreateBoardModal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface DashboardSidebarProps {
  userEmail?: string;
  userName?: string;
  currentPlan?: string;
  usedPdfs?: number;
  maxPdfs?: number;
  usedMessages?: number;
  maxMessages?: number;
}

// Settings Modal Component
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  currentPlan?: string;
  usedPdfs: number;
  usedMessages: number;
  maxPdfs: number;
  maxMessages: number;
  onLogout?: () => void;
}

function SettingsModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  currentPlan = "Free",
  usedPdfs,
  usedMessages,
  maxPdfs,
  maxMessages,
  onLogout,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  const pdfProgress = maxPdfs ? (usedPdfs / maxPdfs) * 100 : 0;
  const messageProgress = maxMessages ? (usedMessages / maxMessages) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="text-xl font-bold text-black">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-lg transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5 text-black/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* User Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">
              Account Information
            </h3>

            {/* Name */}
            <div
              className="bg-black/5 rounded-lg p-4 hover:bg-black/10 transition-all duration-200 animate-in slide-in-from-left-2"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">Name</p>
                  <p className="text-base font-semibold text-black">
                    {userName}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div
              className="bg-black/5 rounded-lg p-4 hover:bg-black/10 transition-all duration-200 animate-in slide-in-from-left-2"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">Email</p>
                  <p className="text-base font-semibold text-black">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Tier */}
            <div
              className="bg-black/5 rounded-lg p-4 hover:bg-black/10 transition-all duration-200 animate-in slide-in-from-left-2"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black/60">
                    Subscription
                  </p>
                  <p className="text-base font-semibold text-black capitalize">
                    {currentPlan} Plan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">
              Usage Statistics
            </h3>

            {/* PDFs Usage */}
            <div
              className="bg-black/5 rounded-lg p-4 hover:bg-black/10 transition-all duration-200 animate-in slide-in-from-right-2"
              style={{ animationDelay: "400ms" }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <FileCode className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black/60">
                        PDFs Used
                      </p>
                      <p className="text-base font-semibold text-black">
                        {usedPdfs} / {maxPdfs}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">
                      {pdfProgress.toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pdfProgress}%`,
                      animationDelay: "600ms",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Messages Usage */}
            <div
              className="bg-black/5 rounded-lg p-4 hover:bg-black/10 transition-all duration-200 animate-in slide-in-from-right-2"
              style={{ animationDelay: "500ms" }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black/60">
                        Messages Used
                      </p>
                      <p className="text-base font-semibold text-black">
                        {usedMessages} / {maxMessages}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">
                      {messageProgress.toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div
                    className="bg-gray-800 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${messageProgress}%`,
                      animationDelay: "700ms",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t border-black/5 p-6 animate-in slide-in-from-bottom-2"
          style={{ animationDelay: "600ms" }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-black hover:bg-gray-800 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-semibold text-white">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar({
  userEmail = "",
  userName = "",
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [activeBoard, setActiveBoard] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [createError, setCreateError] = useState<string | undefined>();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    loadProfile,
    clearError: clearProfileError,
  } = useProfile();
  const {
    boards,
    loading: boardsLoading,
    error: boardsError,
    initialized,
    loadBoards,
    clearError: clearBoardError,
    createBoard,
  } = useBoard();
  const { signOut } = useAuth();

  const router = useRouter();

  useEffect(() => {
    loadProfile();
    if (!initialized) {
      loadBoards();
    }
  }, [loadProfile, loadBoards, initialized]);

  const { loadLimits, limits, getTierDetails } = useSubscription();

  useEffect(() => {
    loadLimits();
  }, []);

  const tierDetails = getTierDetails(profile?.subscription_tier);
  console.log(tierDetails);
  const maxPdfs = tierDetails?.max_pdfs;
  const maxMessages = tierDetails?.max_messages;

  useEffect(() => {
    // Extract board ID from pathname
    const boardMatch = pathname.match(/\/dashboard\/board\/(.+)/);
    if (boardMatch) {
      setActiveBoard(boardMatch[1]);
    } else if (pathname === "/dashboard") {
      setActiveBoard("all");
    }
  }, [pathname]);

  const usedPdfs = profile?.pdfs_used ?? 0;
  const usedMessages = profile?.messages_used ?? 0;

  const pdfProgress = maxPdfs ? (usedPdfs / maxPdfs) * 100 : 0;
  const messageProgress = maxMessages ? (usedMessages / maxMessages) * 100 : 0;

  // Color options for boards (cycling through them)
  const boardColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-red-500",
  ];

  // Get color for board based on its color property or fallback to cycling colors
  const getBoardColor = (board: any, index: number) => {
    if (board.color) {
      return board.color.startsWith("bg-") ? board.color : `bg-blue-500`;
    }
    return boardColors[index % boardColors.length];
  };

  const handleCreateNewBoard = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateBoardSubmit = async (name: string, description: string) => {
    setIsCreatingBoard(true);
    setCreateError(undefined);
    try {
      await createBoard(name, description);
      // Reload boards to get the latest data
      await loadBoards();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create board:", error);
      setCreateError("Failed to create board. Please try again.");
    } finally {
      setIsCreatingBoard(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-black/5 flex flex-col">
      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateError(undefined);
        }}
        onSubmit={handleCreateBoardSubmit}
        isLoading={isCreatingBoard}
        error={createError}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        currentPlan={profile?.subscription_tier}
        usedPdfs={usedPdfs}
        usedMessages={usedMessages}
        maxPdfs={maxPdfs || 0}
        maxMessages={maxMessages || 0}
        onLogout={handleLogout}
      />

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            {/* <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div> */}
          </div>
          <div>
            <h1 className="text-xl font-bold text-black tracking-tight">
              NoteSnap
            </h1>
            <p className="text-sm text-black/60 font-medium">Smart Notes</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Boards Section */}
        <div className="mb-6 flex-1 min-h-0">
          <div className="flex items-center justify-between mb-4 px-4">
            <h2 className="text-xs font-bold text-black/60 uppercase tracking-wider">
              Boards
            </h2>
          </div>

          {/* All Boards */}
          <div className="px-2">
            <Link href={`/dashboard/`}>
              <button
                onClick={() => setActiveBoard("all")}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 group ${
                  activeBoard === "all"
                    ? "bg-black shadow-lg"
                    : "hover:bg-black/5"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeBoard === "all" ? "bg-white" : "bg-black"
                  }`}
                ></div>
                <span
                  className={`text-sm font-semibold ${
                    activeBoard === "all" ? "text-white" : "text-black"
                  }`}
                >
                  All Boards
                </span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-all duration-200 ${
                    activeBoard === "all"
                      ? "text-white opacity-100"
                      : "text-black/40 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            </Link>
          </div>

          {/* Individual Boards */}
          {boardsLoading ? (
            <div className="px-2 space-y-2 mt-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-3 bg-black/5 rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-black/10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-black/10 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-black/5 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : boardsError ? (
            <div className="px-4 py-3 mx-2 mt-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-medium">
                Error loading boards
              </p>
              <button
                onClick={loadBoards}
                className="text-xs text-red-500 hover:text-red-700 underline mt-1"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1 mt-3 overflow-y-auto max-h-[calc(68vh-24rem)] scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent hover:scrollbar-thumb-black/30">
              {boards?.map((board: any, index: number) => (
                <div key={board.id}>
                  <Link href={`/dashboard/board/${board.id}`}>
                    <button
                      key={board.id}
                      onClick={() => board.id}
                      className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-all duration-200 group ${
                        activeBoard === board.id
                          ? "bg-black shadow-lg"
                          : "hover:bg-black/5"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 bg-black rounded-full ${
                          activeBoard === board.id ? "ring-2 ring-white/50" : ""
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate transition-colors ${
                            activeBoard === board.id
                              ? "text-white"
                              : "text-black group-hover:text-black"
                          }`}
                        >
                          {board.name}
                        </p>
                        {board.description && (
                          <p
                            className={`text-xs font-medium truncate ${
                              activeBoard === board.id
                                ? "text-white/60"
                                : "text-black/40"
                            }`}
                          >
                            {board.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          activeBoard === board.id
                            ? "text-white opacity-100"
                            : "text-black/40 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Create New Board */}
          <div className="px-2 mt-3">
            <button
              onClick={handleCreateNewBoard}
              className="w-full group relative overflow-hidden"
            >
              <div className="relative flex items-center space-x-3 px-4 py-3.5 bg-white hover:bg-black/5 rounded-lg border-2 border-dashed border-black/10 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-bold text-black">
                    Create New Board
                  </span>
                  <p className="text-xs text-black/60">
                    Start organizing your notes
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-black/40 group-hover:text-black/60 transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-black/5 bg-white/50">
        {/* Usage Stats */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border-2 border-black/5 p-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center gap-1 text-xs font-bold text-black/60 uppercase tracking-wide">
                    PDFs
                    <FileCode className="w-4 h-4 text-blue-600" />
                  </span>
                  <span className="text-xs font-bold text-black">
                    {usedPdfs || 0}/{maxPdfs || 0}
                  </span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pdfProgress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center gap-1 text-xs font-bold text-black/60 uppercase tracking-wide">
                    Messages
                    <Bot className="w-4 h-4 text-purple-600" />
                  </span>
                  <span className="text-xs font-bold text-black">
                    {usedMessages || 0}/{maxMessages || 0}
                  </span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${messageProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          <button className="w-full group relative overflow-hidden">
            <Link href="/pricing">
              <div className="relative flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">
                    Upgrade to Pro
                  </span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            </Link>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-black/5">
          <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border-2 border-black/5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black truncate">
                {userName}
              </p>
              <p className="text-xs text-black/60 truncate">{userEmail}</p>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors group"
            >
              <Settings className="w-4 h-4 text-black/40 group-hover:text-black transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
