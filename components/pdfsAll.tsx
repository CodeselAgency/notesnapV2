"use client";

import { useEffect } from "react";
import { usePdf } from "@/hooks/usePdf";
import { FileText } from "lucide-react";

export function PdfList() {
  const { files, loading, loadPdfs, error } = usePdf();

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  // Debug logs
  console.log("Files from state:", files);
  console.log("Loading:", loading);
  console.log("Error:", error);

  if (loading && files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No PDF files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your PDF Files ({files.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white p-4 rounded-lg shadow-md border"
          >
            <div className="flex items-start gap-3">
              <FileText className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {file.file_name || "Unnamed PDF"}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {file.file_size
                    ? `${(file.file_size / 1024 / 1024).toFixed(2)} MB`
                    : "Unknown size"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Status: {file.processing_status}
                </p>
                {file.created_at && (
                  <p className="text-xs text-gray-400">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
