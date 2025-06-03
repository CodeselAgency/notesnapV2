"use client";

import { useEffect } from "react";
import type React from "react";
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
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(
    null
  );
  // Enhanced error state management
  const [uploadError, setUploadError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { uploadFile, loading, uploads, error, clearError } = usePdf();
  const { files, loading: pdfLoading, error: pdfError, loadPdfs } = usePdf();

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
    let interval;
    if (uploadState === "processing") {
      interval = setInterval(() => {
        setCurrentProcessingStep((prev) => (prev + 1) % processingSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
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
    const currentUpload = uploads.find((upload) =>
      upload.fileId.includes(selectedFile?.name || "")
    );

    if (currentUpload) {
      setUploadProgress(currentUpload.progress);

      switch (currentUpload.status) {
        case "uploading":
          setUploadState("uploading");
          setProcessingStep("Uploading PDF...");
          setUploadError(null); // Clear any previous errors
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
          // Error message should come from the upload object or Redux error
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

  // Enhanced handleUpload with better error handling
  const handleUpload = async () => {
    if (selectedFile) {
      setUploadState("uploading");
      setProcessingStep("Uploading PDF...");
      setUploadError(null);
      clearError(); // Clear Redux errors

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
        // Call uploadFile and get the response
        const result = await uploadFile(selectedFile, boardId, onProgress);

        // Check if the result indicates an error (Redux Toolkit rejected action)
        if (result && result.type && result.type.endsWith("/rejected")) {
          // This is a rejected action, extract the error message
          const errorMessage =
            result.payload || result.error?.message || "Upload failed";
          throw new Error(errorMessage);
        }

        // Check for other error patterns
        if (result && typeof result === "object" && "error" in result) {
          const errorMessage =
            result.payload || result.error?.message || "Upload failed";
          throw new Error(errorMessage);
        }

        // Success case - check if we have the expected response structure
        if (
          result &&
          result.payload &&
          result.payload.pdf &&
          result.payload.pdf.id
        ) {
          setUploadedDocumentId(result.payload.pdf.id);
          setUploadState("success");
          setProcessingStep("Processing complete!");

          setTimeout(() => {
            loadPdfs();
            router.push(`/dashboard/snaps/${result.payload.pdf.id}`);
            resetModalState();
          }, 2000);
        } else if (result && result.payload) {
          // Handle other success response formats
          setUploadState("success");
          setProcessingStep("Processing complete!");

          setTimeout(() => {
            loadPdfs();
            resetModalState();
          }, 2000);
        }
      } catch (error: any) {
        console.error("Upload error:", error);

        setUploadState("error");
        setProcessingStep("");
        setUploadProgress(0);

        // Extract and set the specific error message
        let errorMessage = "An unexpected error occurred during upload.";

        if (typeof error === "string") {
          errorMessage = error;
        } else if (error && typeof error === "object") {
          if (error.message) {
            errorMessage = error.message;
          } else if (error.payload) {
            errorMessage = error.payload;
          } else if (error.error) {
            errorMessage = error.error;
          }
        }

        // Set the specific error message for display
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
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All boards</h1>
                <p className="text-gray-600 mt-1">
                  Manage and organize your digital boards
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4 text-white" />
                Upload PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-black border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-white shadow-sm hover:shadow-md opacity-60 cursor-not-allowed">
                <Timer className="w-4 h-4 text-white" />
                Pomodoro Timer
                <span className="text-xs text-gray-400 ml-1">
                  (Coming Soon)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My snaps</h2>
          <p className="text-gray-600 text-sm">
            Record your thoughts, ideas, and tasks in a snap. You can also add
            audio recordings, PDFs, and YouTube videos.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading boards...</div>
          </div>
        )}

        {/* Error state */}
        {pdfError && (
          <div className="text-center py-12">
            <div className="text-red-600">Error: {pdfError}</div>
          </div>
        )}

        {/* Boards list */}
        {!loading && !pdfError && (
          <div className="space-y-4">
            {filteredboards.map((board) => (
              <DocumentListItem key={board.id} document={board} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !pdfError && filteredboards.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No snaps found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first board"}
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Upload PDF
            </button>
          </div>
        )}
      </div>

      {/* Enhanced PDF Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Idle State - File Selection */}
            {uploadState === "idle" && (
              <>
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800">
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

                <div className="p-6">
                  {/* File Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select PDF file
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        {selectedFile ? (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700 font-medium">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                              MB
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
                            <div className="flex text-sm text-gray-600 justify-center">
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
                            <p className="text-xs text-gray-500">
                              PDF up to 10MB
                            </p>
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
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile}
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Upload & Process
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Processing States */}
            {(uploadState === "uploading" || uploadState === "processing") && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Processing Your PDF
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We're analyzing your document and creating study materials
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {uploadProgress}% complete
                  </p>
                </div>

                {/* Current Processing Step */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-900 font-medium">
                      {processingStep}
                    </span>
                  </div>
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
