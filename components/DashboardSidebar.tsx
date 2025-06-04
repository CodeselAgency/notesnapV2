"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

interface Board {
  id: string;
  name: string;
  description?: string;
  color?: string;
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">My Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-black">{userName}</h3>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <p className="text-sm text-blue-600 font-medium">
                  Active Plan : 
                </p>
                
              </div>
                <div className="flex items-center gap-3">
                <p className="text-sm text-blue-600 font-medium">{currentPlan.toUpperCase()} Plan</p>
              <Link href="/pricing" className="text-xs font-medium text-white px-3 py-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 rounded-lg flex items-center gap-2 ">
                
                  <Crown className="w-4 h-4 text-white" />
                  Upgrade
              </Link>
              </div>
            </div>
          </div>

          {/* Usage Section */}
          <div className="space-y-3">
            {/* PDFs Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">PDFs Used</span>
                <span className="font-medium">{usedPdfs} / {maxPdfs}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${pdfProgress}%` }}
                />
              </div>
            </div>

            {/* Messages Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Messages Used</span>
                <span className="font-medium">{usedMessages} / {maxMessages}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${messageProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-white bg-black rounded-xl cursor-pointer hover:bg-gray-900 transition-colors"
          >
            <span>Log Out</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Portal Component
interface PortalProps {
  container: HTMLElement;
  children: React.ReactNode;
}

function Portal({ container, children }: PortalProps) {
  return container ? createPortal(children, container) : null;
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

  // Create portal containers for modals
  const createModalContainerRef = useRef<HTMLDivElement | null>(null);
  const settingsModalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create portal containers on mount
    createModalContainerRef.current = document.createElement("div");
    settingsModalContainerRef.current = document.createElement("div");

    document.body.appendChild(createModalContainerRef.current);
    document.body.appendChild(settingsModalContainerRef.current);

    return () => {
      // Clean up on unmount
      if (createModalContainerRef.current) {
        document.body.removeChild(createModalContainerRef.current);
      }
      if (settingsModalContainerRef.current) {
        document.body.removeChild(settingsModalContainerRef.current);
      }
    };
  }, []);

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

  const { loadLimits, getTierDetails } = useSubscription();

  useEffect(() => {
    loadLimits();
  }, [loadLimits]);

  const tierDetails = getTierDetails(profile?.subscription_tier || "");
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
    router.push("/");
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-black/5 flex flex-col">
      {/* Create Board Modal Portal */}
      {createModalContainerRef.current && isCreateModalOpen && (
        <Portal container={createModalContainerRef.current}>
          <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => {
                setIsCreateModalOpen(false);
                setCreateError(undefined);
              }}
            />
            <div className="relative w-full max-w-md p-4">
              <div className="relative bg-white rounded-xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
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
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Settings Modal Portal */}
      {settingsModalContainerRef.current && isSettingsModalOpen && (
        <Portal container={settingsModalContainerRef.current}>
          <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsSettingsModalOpen(false)}
            />
            <div className="relative w-full max-w-md p-4">
              <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <SettingsModal
                  isOpen={isSettingsModalOpen}
                  onClose={() => setIsSettingsModalOpen(false)}
                  userName={userName}
                  userEmail={userEmail}
                  currentPlan={profile?.subscription_tier || ""}
                  usedPdfs={usedPdfs}
                  usedMessages={usedMessages}
                  maxPdfs={maxPdfs || 0}
                  maxMessages={maxMessages || 0}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </Portal>
      )}

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
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Your Boards
            </h2>
          </div>

          {/* All Boards */}
          <div className="px-2">
            <Link href={`/dashboard/`}>
              <button
                onClick={() => setActiveBoard("all")}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 group ${
                  activeBoard === "all"
                    ? "bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-900 shadow-lg"
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
              {boards?.map((board: Board) => (
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500/60 via-blue-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-inter-tight font-medium text-black">
                    Create New Board
                  </span>
                  <p className="text-xs text-black/60 font-inter-light opacity-80">
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
                  <span className="flex items-center justify-center gap-1 text-xs font-semibold text-black/60 uppercase tracking-wide">
                    PDFs
                    <FileCode className="w-4 h-4 text-blue-600" />
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {usedPdfs || 0}/{maxPdfs || 0}
                  </span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${pdfProgress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center gap-1 text-xs font-semibold text-black/60 uppercase tracking-wide">
                    Messages
                    <Bot className="w-4 h-4 text-purple-600" />
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {usedMessages || 0}/{maxMessages || 0}
                  </span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 via-purple-500 to-purple-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${messageProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          <button className="w-full group relative overflow-hidden">
            <Link href="/pricing">
              <div className="relative flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500/60 via-blue-500 to-blue-500 rounded-lg transition-all duration-200">
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
            <div className="w-9 h-9 bg-gradient-to-b from-blue-500 via-blue-500 to-blue-500/40 rounded-lg flex items-center justify-center text-white text-lg font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
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
