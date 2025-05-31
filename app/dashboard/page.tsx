"use client";

import { useEffect } from "react";
import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation"; // Add this import
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
} from "lucide-react";
import BoardListItem from "@/components/UI/BoardItemList";
import { useDispatch } from "react-redux";
import { createBoard } from "@/store/slices/boardSlice";
import { usePdf } from "@/hooks/usePdf";
import { useBoard } from "@/hooks/useBoard";
import DocumentListItem from "@/components/UI/DocumentListItem";

// Updated board type to match your actual data structure
type Board = {
  id: string;
  user_id: string;
  name: string; // Changed from 'title' to 'name'
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
  ); // Add this state

  const dispatch = useDispatch();
  const router = useRouter(); // Add this hook
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
      console.log("Selected file:", file.name);
    }
  };

  // Updated processing steps with better styling
  const processingSteps = [
    {
      icon: Upload,
      message: "Uploading your PDF...",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FileCheck,
      message: "Extracting content...",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Brain,
      message: "Analyzing document...",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FileText,
      message: "Generating notes...",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: BookOpen,
      message: "Creating flashcards...",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  // Smooth animation cycling for processing steps
  useEffect(() => {
    let interval;
    if (uploadState === "processing") {
      interval = setInterval(() => {
        setCurrentProcessingStep((prev) => (prev + 1) % processingSteps.length);
      }, 2000); // Change step every 2 seconds
    }
    return () => clearInterval(interval);
  }, [uploadState]);

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
          break;
        case "processing":
          setUploadState("processing");
          setProcessingStep("Processing PDF...");
          break;
        case "completed":
          setUploadState("success");
          setProcessingStep("Processing complete!");

          // Store the uploaded document ID if available
          if (currentUpload.documentId) {
            setUploadedDocumentId(currentUpload.documentId);
          }

          // Auto close after success and redirect
          setTimeout(() => {
            // Refresh the PDF list to show the new document
            loadPdfs();

            // If we have a document ID, redirect to it
            if (currentUpload.documentId) {
              router.push(`/dashboard/snaps/${currentUpload.documentId}`);
            }

            // Reset modal state
            setIsUploadModalOpen(false);
            setSelectedFile(null);
            setUploadState("idle");
            setProcessingStep("");
            setUploadProgress(0);
            setCurrentProcessingStep(0);
            setUploadedDocumentId(null);
          }, 2000);
          break;
        case "error":
          setUploadState("error");
          break;
      }
    }
  }, [uploads, selectedFile?.name, loadPdfs, router]);

  // Monitor general loading state
  useEffect(() => {
    if (loading && uploadState === "idle" && selectedFile) {
      setUploadState("uploading");
      setProcessingStep("Uploading PDF...");
    }
  }, [loading, uploadState, selectedFile]);

  const boardId = undefined;

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        setUploadState("uploading");
        setProcessingStep("Uploading PDF...");

        // After a short delay, switch to processing for better UX
        setTimeout(() => {
          if (uploadState !== "error") {
            setUploadState("processing");
          }
        }, 1500);

        // Progress callback to track upload progress
        const onProgress = (progress: number) => {
          setUploadProgress(progress);
          if (progress > 10 && progress < 100) {
            setUploadState("processing");
            // Set different processing steps based on progress
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

        // Call uploadFile and get the response
        const response = await uploadFile(selectedFile, boardId, onProgress);
        // Log the response to see what we get back
        console.log("Upload response:", response.payload.pdf.id);

        // If the response contains the document ID, store it
        if (response && response.payload.pdf.id) {
          setUploadedDocumentId(response.payload.pdf.id);

          // If upload is immediately successful, handle the success state
          setUploadState("success");
          setProcessingStep("Processing complete!");

          // Refresh the PDF list and redirect after a short delay
          setTimeout(() => {
            loadPdfs();
            router.push(`/dashboard/snaps/${response.payload.pdf.id}`);

            // Reset modal state
            setIsUploadModalOpen(false);
            setSelectedFile(null);
            setUploadState("idle");
            setProcessingStep("");
            setUploadProgress(0);
            setCurrentProcessingStep(0);
            setUploadedDocumentId(null);
          }, 2000);
        }
      } catch (error: any) {
        console.log("Upload failed:", error.message);
        setUploadState("error");
      }
    }
  };

  const closeModal = () => {
    if (
      uploadState === "idle" ||
      uploadState === "error" ||
      uploadState === "success"
    ) {
      clearError();
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadState("idle");
      setProcessingStep("");
      setUploadProgress(0);
      setCurrentProcessingStep(0);
      setUploadedDocumentId(null); // Reset this too
    }
  };

  const getCurrentStepIndex = () => {
    return processingSteps.findIndex((step) => step.step === processingStep);
  };

  // Clear error when modal opens
  useEffect(() => {
    if (isUploadModalOpen && error) {
      clearError();
    }
  }, [isUploadModalOpen, error, clearError]);

  return (
    <div className="min-h-screen bg-white">
      {/* Backdrop blur overlay */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-40">
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

              {/* Action Buttons */}
              {/* <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                  <Plus className="w-4 h-4" />
                  New board
                </button>
              </div> */}
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
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Show errors in idle state */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

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
              <div className="p-8 text-center">
                {uploadState === "uploading" ? (
                  // Simple uploading state
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Uploading PDF
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Please wait while we upload your document...
                    </p>

                    {/* Simple progress animation */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </>
                ) : (
                  // Enhanced smooth processing animation
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

                    {/* Main Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Processing Your PDF
                    </h3>

                    {/* Current Step Message */}
                    <div className="min-h-[3rem] flex items-center justify-center mb-6">
                      <p
                        className={`text-sm font-medium transition-all duration-500 ${processingSteps[currentProcessingStep].color}`}
                      >
                        {processingSteps[currentProcessingStep].message}
                      </p>
                    </div>

                    {/* Animated Progress Indicators */}
                    <div className="flex justify-center gap-2 mb-6">
                      {processingSteps.map((step, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            index === currentProcessingStep
                              ? `${step.color.replace(
                                  "text-",
                                  "bg-"
                                )} scale-125`
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Fun Processing Message */}
                    <div className="bg-gray-50 rounded-lg p-4 relative overflow-hidden">
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
                        <CheckCircle className="w-4 h-4 animate-pulse" />
                        <span>Creating study materials just for you...</span>
                        <CheckCircle className="w-4 h-4 animate-pulse" />
                      </div>

                      {/* Floating particles animation */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-1 h-1 ${processingSteps[
                              currentProcessingStep
                            ].color.replace(
                              "text-",
                              "bg-"
                            )} rounded-full animate-bounce`}
                            style={{
                              left: `${20 + i * 12}%`,
                              top: `${30 + (i % 3) * 10}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: "2s",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Error Display in processing states */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                    <button
                      onClick={() => {
                        clearError();
                        setUploadState("idle");
                        setProcessingStep("");
                        setUploadProgress(0);
                        setCurrentProcessingStep(0);
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Try again
                    </button>
                  </div>
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

            {/* Error State */}
            {uploadState === "error" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Failed
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {error ||
                    "You've reached your free tier limit. Upgrade to upload more PDFs."}
                </p>

                {/* Special handling for subscription limit errors */}
                {error && error.includes("limit") ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      You've reached your free tier limit. Upgrade to upload
                      more PDFs.
                    </p>
                    <button className="mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Upgrade Account
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      clearError();
                      setUploadState("idle");
                      setProcessingStep("");
                      setUploadProgress(0);
                      setCurrentProcessingStep(0);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}

                <button
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors block w-full"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
