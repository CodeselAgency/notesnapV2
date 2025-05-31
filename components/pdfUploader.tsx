"use client";

import { useCallback, useState } from "react";
import { usePdf } from "@/hooks/usePdf";
import { Upload, X, FileText, Loader2 } from "lucide-react";

export function PdfUploader() {
  const { uploadFile, uploads, error, clearError } = usePdf();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      const file = files[0];
      if (!file) return;

      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Upload PDF files</p>
          <p className="text-gray-500">
            Drag and drop your PDF here, or{" "}
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
              browse files
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFileSelect(e.target.files)
                }
              />
            </label>
          </p>
          <p className="text-sm text-gray-400">Max file size: 10MB</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <X className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.fileId}
              className="bg-gray-50 border border-gray-200 rounded-md p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium">
                    {upload.fileId.split("-").slice(1).join("-")}
                  </span>
                </div>
                <div className="flex items-center">
                  {upload.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-500">
                    {upload.status === "uploading" && `${upload.progress}%`}
                    {upload.status === "completed" && "Completed"}
                    {upload.status === "error" && "Error"}
                  </span>
                </div>
              </div>

              {upload.status === "uploading" && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
