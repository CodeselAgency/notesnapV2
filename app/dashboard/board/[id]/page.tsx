"use client";
import { usePdf } from "@/hooks/usePdf";
import type React from "react";

import { useBoard } from "@/hooks/useBoard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import {
  Upload,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  ArrowLeft,
  BookOpen,
  Brain,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

// Enhanced Upload Component with improved error handling
function PdfUploader({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const { uploadFile, uploads, error, clearError } = usePdf();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [processingStep, setProcessingStep] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // Add local error state for better error handling
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { id } = useParams();
  const boardId = id as string;

  const processingSteps = [
    { step: "Uploading PDF...", icon: Upload },
    { step: "Extracting content...", icon: FileCheck },
    { step: "Generating notes...", icon: FileText },
    { step: "Creating quizzes...", icon: Brain },
    { step: "Building flashcards...", icon: BookOpen },
    { step: "Finalizing...", icon: CheckCircle },
  ];

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedFile(file);
        // Clear any previous errors when selecting a new file
        setUploadError(null);
        clearError();
      }
    },
    [clearError]
  );

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

          // Call the callback to refresh the file list
          if (onUploadSuccess) {
            onUploadSuccess();
          }

          setTimeout(() => {
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
  }, [uploads, selectedFile?.name, onUploadSuccess, error]);

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      try {
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

        // Success case is handled by the useEffect monitoring uploads
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
  }, [selectedFile, uploadFile, boardId, clearError]);

  // Enhanced function to reset modal state completely
  const resetModalState = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setUploadState("idle");
    setProcessingStep("");
    setUploadProgress(0);
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
    <>
      {/* Upload Trigger Button */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-500 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium text-white shadow-sm hover:shadow-md"
      >
        <FileText className="w-4 h-4 text-white" />
        Upload PDF
      </button>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={canCloseModal ? closeModal : undefined}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          </div>

          {/* Modal */}
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
              {(uploadState === "uploading" ||
                uploadState === "processing") && (
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
                    are ready.
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
                            You've reached your free tier limit. Upgrade to
                            upload more PDFs and unlock additional features.
                          </p>
                          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
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
        </>
      )}
    </>
  );
}

export default function BoardPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    loadPdfsByBoardId,
    files,
    loading: pdfLoading,
    error: pdfError,
    clearError: clearPdfError,
  } = usePdf();

  // Add board hook
  const {
    loadBoardById,
    currentBoard,
    loading,
    error: boardError,
    clearError: clearBoardError,
  } = useBoard();

  const boardId = id as string;

  const refreshFiles = useCallback(() => {
    if (boardId) {
      loadPdfsByBoardId(boardId);
    }
  }, [boardId, loadPdfsByBoardId]);

  // Load board data
  useEffect(() => {
    if (boardId) {
      loadBoardById(boardId);
    }
  }, [boardId, loadBoardById]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  useEffect(() => {
    return () => {
      clearPdfError();
      clearBoardError();
    };
  }, [clearPdfError, clearBoardError, id]);

  const handleBackToBoards = () => {
    router.push("/dashboard"); // Adjust the route as needed
  };

  // Show loading state while board or PDFs are loading
  const isLoading = loading || pdfLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-black/5">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-black/5 rounded-lg"></div>
                  <div className="h-8 bg-black/5 rounded-lg w-48"></div>
                </div>
                <div className="h-4 bg-black/5 rounded-lg w-96 mb-6"></div>
                <div className="flex gap-3">
                  <div className="h-10 bg-black/5 rounded-lg w-32"></div>
                  <div className="h-10 bg-black/5 rounded-lg w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-black/5 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error if board couldn't be loaded
  if (boardError && !currentBoard) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-black/5 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Board Not Found</h2>
          <p className="text-black/60 mb-4">
            The board you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={handleBackToBoards}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-black/90 transition-all duration-200 text-sm font-medium"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-black/5">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToBoards}
                  className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back to boards</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-black">
                    {currentBoard?.name || `Board ${boardId}`}
                  </h1>
                  <p className="text-black/60 mt-1">
                    {currentBoard?.description ||
                      "Manage your PDFs and study materials for this board"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <PdfUploader onUploadSuccess={refreshFiles} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banners */}
        {boardError && (
          <div className="mb-6 p-4 bg-black/5 border-2 border-black/10 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-black/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-black">Board Error</h3>
                <div className="mt-2 text-sm text-black/60">{boardError}</div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={clearBoardError}
                    className="text-sm bg-black/5 text-black px-3 py-1 rounded-lg hover:bg-black/10 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {pdfError && (
          <div className="mb-6 p-4 bg-black/5 border-2 border-black/10 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-black/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-black">PDF Error</h3>
                <div className="mt-2 text-sm text-black/60">{pdfError}</div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={clearPdfError}
                    className="text-sm bg-black/5 text-black px-3 py-1 rounded-lg hover:bg-black/10 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-2">
            PDFs in this board
          </h2>
          <p className="text-black/60 text-sm">
            Your uploaded documents and generated study materials
          </p>
        </div>

        {/* PDFs Grid */}
        {files.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <Link href={`/dashboard/snaps/${file.id}`} key={file.id}>
                <div className="bg-white border-2 border-black/5 hover:border-black/10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
                  {/* File Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-black truncate">
                            {file.file_name}
                          </h3>
                          <p className="text-xs text-black/60">
                            {(file.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {file.page_count} pages
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${
                          file.processing_status === "completed"
                            ? "bg-black text-white"
                            : file.processing_status === "processing"
                            ? "bg-black/10 text-black"
                            : "bg-black/5 text-black/60"
                        }`}
                      >
                        {file.processing_status === "completed" ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" /> Processed
                          </>
                        ) : file.processing_status === "processing" ? (
                          <>
                            <Clock className="w-3 h-3 mr-1 animate-spin" />{" "}
                            Processing
                          </>
                        ) : (
                          "Pending"
                        )}
                      </span>
                    </div>

                    {/* Summary */}
                    {file.summary && (
                      <p className="text-sm text-black/60 line-clamp-3 mb-4">
                        {file.summary}
                      </p>
                    )}

                    {/* Study Materials (if processed) */}
                    {file.processing_status === "completed" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-black/5 p-2 rounded-lg text-center">
                          <FileText className="w-4 h-4 mx-auto mb-1 text-black" />
                          <span className="text-xs text-black font-medium">
                            Notes
                          </span>
                        </div>
                        <div className="bg-black/5 p-2 rounded-lg text-center">
                          <Brain className="w-4 h-4 mx-auto mb-1 text-black" />
                          <span className="text-xs text-black font-medium">
                            Quizzes
                          </span>
                        </div>
                        <div className="bg-black/5 p-2 rounded-lg text-center">
                          <BookOpen className="w-4 h-4 mx-auto mb-1 text-black" />
                          <span className="text-xs text-black font-medium">
                            Cards
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">
              No PDFs uploaded yet
            </h3>
            <p className="text-black/60 mb-6">
              Get started by uploading your first PDF to this board. We'll
              automatically generate study materials for you.
            </p>
            <div className="inline-block">
              <PdfUploader onUploadSuccess={refreshFiles} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
