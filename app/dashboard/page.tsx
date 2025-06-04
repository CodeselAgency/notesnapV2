"use client";

import React from "react";
import { useEffect } from "react";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Timer,
  X,
  Upload,
  CheckCircle,
  Clock,
  BookOpen,
  Brain,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { usePdf } from "@/hooks/usePdf";
import DocumentListItem from "@/components/UI/DocumentListItem";

// Updated board type to match your actual data structure
type Board = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  type?: string;
  date?: string;
  initials?: string;
  starred?: boolean;
  icon?: React.ElementType;
};

// Remove unused Board type
type UploadError = Error | string | null;

interface UploadProgress {
  fileId?: string;
  progress?: number;
  status?: "uploading" | "processing" | "completed" | "error";
  documentId?: string;
  error?: string;
}

interface UploadResult {
  type?: string;
  payload?: {
    pdf?: {
      id: string;
    };
  };
  error?: {
    message: string;
  };
}

interface BasePdfFile {
  id: string;
  user_id: string;
  board_id: string | null;
  file_name: string;
  file_size: number;
  file_url: string;
  extracted_content: string;
  summary: string;
  created_at: string;
  updated_at: string;
  status: string;
  page_count: number;
  flashcards: unknown[];
  notes: unknown[];
  quiz: unknown[];
  processing_status: string;
}

type PdfFile = BasePdfFile;

interface DocumentItem extends BasePdfFile {
  board_id: string;
}

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [processingStep, setProcessingStep] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { uploadFile, loading, uploads, error, clearError } = usePdf();
  const { files, loading: pdfLoading, error: pdfError, loadPdfs } = usePdf();

  // Add console logs to track data flow
  useEffect(() => {
    console.log('Files from Redux:', files);
    console.log('Loading state:', loading);
    console.log('PDF Loading state:', pdfLoading);
    console.log('Error state:', error);
    console.log('PDF Error state:', pdfError);
  }, [files, loading, pdfLoading, error, pdfError]);

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  // Fixed the filtering logic to use 'name' instead of 'title'
  const filteredboards = files.filter(
    (board) =>
      board.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Clear any previous errors when selecting a new file
      setUploadError(null);
      clearError();
      console.log("Selected file:", file.name);
    }
  };

  // Updated processing steps with better styling
  const processingSteps = [
    {
      step: "Uploading PDF...",
      icon: Upload,
      message: "Uploading your PDF...",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      step: "Extracting content...",
      icon: FileCheck,
      message: "Extracting content...",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      step: "Generating notes...",
      icon: FileText,
      message: "Analyzing document...",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      step: "Creating quizzes...",
      icon: Brain,
      message: "Generating notes...",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      step: "Building flashcards...",
      icon: BookOpen,
      message: "Creating flashcards...",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      step: "Finalizing...",
      icon: CheckCircle,
      message: "Finalizing...",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  // Smooth animation cycling for processing steps
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (uploadState === "processing") {
      interval = setInterval(() => {
        setCurrentProcessingStep((prev) => (prev + 1) % processingSteps.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [uploadState, processingSteps.length]);

  // Enhanced error monitoring from Redux
  useEffect(() => {
    if (error && uploadState !== "idle") {
      setUploadState("error");
      setUploadError(error);
      setProcessingStep("");
      setUploadProgress(0);
    }
  }, [error, uploadState]);

  // Monitor upload progress from Redux
  useEffect(() => {
    const currentUpload = uploads.find((upload: UploadProgress) =>
      upload.fileId?.includes(selectedFile?.name || "")
    );

    if (currentUpload) {
      setUploadProgress(currentUpload.progress || 0);

      switch (currentUpload.status) {
        case "uploading":
          setUploadState("uploading");
          setProcessingStep("Uploading PDF...");
          setUploadError(null);
          break;
        case "processing":
          setUploadState("processing");
          setProcessingStep("Processing PDF...");
          setUploadError(null);
          break;
        case "completed":
          setUploadState("success");
          setProcessingStep("Processing complete!");
          setUploadError(null);

          if (currentUpload.documentId) {
            setUploadedDocumentId(currentUpload.documentId);
          }

          setTimeout(() => {
            loadPdfs();

            if (currentUpload.documentId) {
              router.push(`/dashboard/snaps/${currentUpload.documentId}`);
            }

            resetModalState();
          }, 2000);
          break;
        case "error":
          setUploadState("error");
          setUploadError(currentUpload.error || error || "Upload failed");
          setProcessingStep("");
          setUploadProgress(0);
          break;
      }
    }
  }, [uploads, selectedFile?.name, loadPdfs, router, error]);

  // Monitor general loading state
  useEffect(() => {
    if (loading && uploadState === "idle" && selectedFile) {
      setUploadState("uploading");
      setProcessingStep("Uploading PDF...");
      setUploadError(null);
    }
  }, [loading, uploadState, selectedFile]);

  const boardId = undefined;

  // Handle upload with better error handling
  const handleUpload = async () => {
    if (selectedFile) {
      setUploadState("uploading");
      setProcessingStep("Uploading PDF...");
      setUploadError(null);
      clearError();

      const onProgress = (progress: number) => {
        setUploadProgress(progress);
        if (progress > 10 && progress < 100) {
          setUploadState("processing");
          if (progress < 30) {
            setProcessingStep("Extracting content...");
          } else if (progress < 50) {
            setProcessingStep("Generating notes...");
          } else if (progress < 70) {
            setProcessingStep("Creating quizzes...");
          } else if (progress < 90) {
            setProcessingStep("Building flashcards...");
          } else {
            setProcessingStep("Finalizing...");
          }
        }
      };

      try {
        const result = await uploadFile(selectedFile, boardId, onProgress) as UploadResult;

        if (result?.type?.endsWith("/rejected")) {
          throw new Error(result.payload ? String(result.payload) : 
                        result.error?.message || "Upload failed");
        }

        if ('error' in result && result.error) {
          throw new Error(result.error.message || "Upload failed");
        }

        // Success case handling
        const pdfId = result?.payload?.pdf?.id;
        if (pdfId) {
          setUploadedDocumentId(pdfId);
          setUploadState("success");
          setProcessingStep("Processing complete!");

          setTimeout(() => {
            loadPdfs();
            router.push(`/dashboard/snaps/${pdfId}`);
            resetModalState();
          }, 2000);
        } else if (result?.payload) {
          setUploadState("success");
          setProcessingStep("Processing complete!");

          setTimeout(() => {
            loadPdfs();
            resetModalState();
          }, 2000);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setUploadState("error");
        setProcessingStep("");
        setUploadProgress(0);

        let errorMessage = "An unexpected error occurred during upload.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        } else if (err && typeof err === "object" && 'message' in err) {
          errorMessage = String(err.message);
        }
        setUploadError(errorMessage);
      }
    }
  };

  // Enhanced function to reset modal state completely
  const resetModalState = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setUploadState("idle");
    setProcessingStep("");
    setUploadProgress(0);
    setCurrentProcessingStep(0);
    setUploadedDocumentId(null);
    setUploadError(null);
    clearError(); // Clear Redux errors

    // Reset file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const closeModal = () => {
    // Only allow closing when not in progress
    if (
      uploadState === "idle" ||
      uploadState === "error" ||
      uploadState === "success"
    ) {
      resetModalState();
    }
  };

  // Prevent closing modal during upload/processing
  const canCloseModal =
    uploadState === "idle" ||
    uploadState === "error" ||
    uploadState === "success";

  const retryUpload = () => {
    setUploadState("idle");
    setUploadError(null);
    setProcessingStep("");
    setUploadProgress(0);
    setCurrentProcessingStep(0);
    clearError();
  };

  const getCurrentStepIndex = () => {
    return processingSteps.findIndex((step) => step.step === processingStep);
  };

  // Clear error when modal opens
  useEffect(() => {
    if (isUploadModalOpen) {
      clearError();
      setUploadError(null);
    }
  }, [isUploadModalOpen, clearError]);

  // Helper function to determine if error is a tier limit error
  const isTierLimitError = (errorMsg: string) => {
    return (
      errorMsg &&
      (errorMsg.toLowerCase().includes("limit") ||
        errorMsg.toLowerCase().includes("tier") ||
        errorMsg.toLowerCase().includes("upgrade"))
    );
  };

  // Updated type predicate to properly check document structure
  const validBoards = React.useMemo(() => {
    console.log('Filtering boards:', filteredboards);
    return filteredboards
      .filter((board): board is BasePdfFile => 
        board !== null &&
        typeof board.id === 'string' &&
        typeof board.file_name === 'string' &&
        typeof board.file_size === 'number'
      )
      .map(board => ({
        ...board,
        board_id: board.board_id || null,
        flashcards: Array.isArray(board.flashcards) ? board.flashcards : [],
        notes: board.notes || '',
        quiz: Array.isArray(board.quiz) ? board.quiz : [],
        processing_status: board.processing_status || 'pending'
      }));
  }, [filteredboards]);

  return (
    <div className="min-h-screen bg-white">
      {/* Backdrop blur overlay */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={canCloseModal ? closeModal : undefined}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  All boards
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-1">
                  Manage and organize your digital boards
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm font-medium text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="truncate">Upload PDF</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-black border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm font-medium text-white shadow-sm hover:shadow-md opacity-60 cursor-not-allowed">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="truncate">Timer</span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-1">
                  (Soon)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Container */}
      {/* <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
              <nav className="flex space-x-1 sm:space-x-2">
                <button
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-50"
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  All Files
                </button>
                <button
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 bg-white rounded-lg hover:bg-gray-50"
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Notes
                </button>
                <button
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 bg-white rounded-lg hover:bg-gray-50"
                >
                  <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Flashcards
                </button>
              </nav>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 sm:w-64 pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Section Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
            My snaps
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            Record your thoughts, ideas, and tasks in a snap. You can also add
            audio recordings, PDFs, and YouTube videos.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-600"></div>
              Loading boards...
            </div>
          </div>
        )}

        {/* Error state */}
        {pdfError && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-sm sm:text-base text-red-600 bg-red-50 px-4 py-3 rounded-lg">
              Error: {pdfError}
            </div>
          </div>
        )}

        {/* Boards list with proper type handling */}
        {!loading && !pdfError && (
          <div className="space-y-2 sm:space-y-3">
            {validBoards.map(documentItem => (
              <DocumentListItem 
                key={documentItem.id} 
                document={documentItem} 
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !pdfError && filteredboards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2 text-center">
              No snaps found
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 text-center max-w-sm">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first board"}
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Upload PDF
            </button>
          </div>
        )}
      </div>

      {/* Enhanced PDF Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all mx-auto">
            {/* Idle State - File Selection */}
            {uploadState === "idle" && (
              <>
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                    Upload PDF
                  </h2>
                  <button
                    onClick={closeModal}
                    disabled={!canCloseModal}
                    className={`transition-colors p-1 rounded-full ${
                      canCloseModal
                        ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Show errors in idle state */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* File Input */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Select PDF file
                    </label>
                    <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                        {selectedFile ? (
                          <div className="space-y-1 sm:space-y-2">
                            <p className="text-xs sm:text-sm text-gray-700 font-medium truncate max-w-[200px] sm:max-w-xs">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <button
                              onClick={() => {
                                setSelectedFile(null);
                                const fileInput = document.getElementById(
                                  "file-upload"
                                ) as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.value = "";
                                }
                              }}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Clear selection
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex text-xs sm:text-sm text-gray-600 justify-center">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Error Message Display */}
                  {(uploadError || error) && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-red-800 text-sm font-medium mb-1">
                            Upload Failed
                          </p>
                          <p className="text-red-700 text-sm">
                            {uploadError || error}
                          </p>

                          {/* Special handling for tier limit errors */}
                          {isTierLimitError(uploadError || error || "") && (
                            <div className="mt-3 pt-3 border-t border-red-200">
                              <p className="text-red-600 text-xs mb-2">
                                Upgrade your account to upload more PDFs
                              </p>
                              <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                                Upgrade Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile}
                      className="px-4 sm:px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto"
                    >
                      Upload & Process
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Processing States */}
            {(uploadState === "uploading" || uploadState === "processing") && (
              <div className="p-6 sm:p-8 text-center">
                {uploadState === "uploading" ? (
                  <>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Uploading PDF
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Please wait while we upload your document...
                    </p>
                  </>
                ) : (
                  <>
                    {/* Animated Icon Container */}
                    <div
                      className={`w-20 h-20 ${processingSteps[currentProcessingStep].bgColor} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform`}
                    >
                      {React.createElement(
                        processingSteps[currentProcessingStep].icon,
                        {
                          className: `w-10 h-10 ${processingSteps[currentProcessingStep].color} transition-all duration-500`,
                        }
                      )}
                    </div>

                    {/* Processing Steps Overview */}
                    <div className="space-y-2">
                      {processingSteps.map((step, index) => {
                        const currentIndex = getCurrentStepIndex();
                        const isActive = index === currentIndex;
                        const isCompleted = index < currentIndex;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                              isActive
                                ? "bg-blue-50 border border-blue-200"
                                : isCompleted
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                isActive
                                  ? "bg-blue-200"
                                  : isCompleted
                                  ? "bg-green-200"
                                  : "bg-gray-200"
                              }`}
                            >
                              <StepIcon
                                className={`w-3 h-3 ${
                                  isActive
                                    ? "text-blue-600"
                                    : isCompleted
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                isActive
                                  ? "text-blue-900"
                                  : isCompleted
                                  ? "text-green-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {step.step}
                            </span>
                            {isCompleted && (
                              <div className="ml-auto">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Success State */}
            {uploadState === "success" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Complete!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Your PDF has been successfully processed and study materials
                  are ready. Redirecting you to your document...
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="bg-blue-50 p-2 rounded">
                    <FileText className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    Notes
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <Brain className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    Quizzes
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <BookOpen className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                    Flashcards
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Error State */}
            {uploadState === "error" && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Failed
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    There was an error processing your PDF. Please try again.
                  </p>
                </div>

                {/* Enhanced Error Message Display */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-800 text-sm font-medium mb-1">
                        Error Details
                      </p>
                      <p className="text-red-700 text-sm">
                        {uploadError || error || "Upload failed"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special handling for subscription limit errors */}
                {isTierLimitError(uploadError || error || "") && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-yellow-800 text-sm font-medium mb-1">
                          Upgrade Required
                        </p>
                        <p className="text-yellow-700 text-sm mb-3">
                          You've reached your free tier limit. Upgrade to upload
                          more PDFs and unlock additional features.
                        </p>
                        <button
                          onClick={() => router.push("/pricing")}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={retryUpload}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
