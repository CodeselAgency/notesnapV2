"use client";

import type React from "react";
import { useState } from "react";
import {
  Camera,
  Share2,
  Download,
  FileText,
  Clock,
  Eye,
  MessageSquare,
  Brain,
  Sparkles,
} from "lucide-react";
import type { PdfData } from "@/constants/index";
import { ContentFormatter } from "../content-formatter";

interface SnapTabProps {
  pdf: PdfData | null;
}

export function SnapTab({ pdf }: SnapTabProps) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  if (!pdf) return null;

  const generateSummary = () => {
    if (pdf.summary) return pdf.summary;

    // Generate dynamic summary based on PDF data
    return `# Document Analysis: ${pdf.file_name}

## Key Information:
• **File Name:** ${pdf.file_name}
• **File Size:** ${(pdf.file_size / 1024 / 1024).toFixed(2)} MB
• **Pages:** ${pdf.page_count || "Unknown"} pages
• **Status:** ${pdf.processing_status}
• **Last Updated:** ${new Date(pdf.updated_at).toLocaleDateString()}

## Processing Status:
${
  pdf.processing_status === "completed"
    ? "✅ Document has been fully processed and analyzed"
    : pdf.processing_status === "processing"
    ? "⏳ Document is currently being processed"
    : pdf.processing_status === "failed"
    ? "❌ Document processing failed"
    : "⏸️ Document is pending processing"
}

## Content Overview:
${
  pdf.extracted_content
    ? `The document contains ${pdf.extracted_content.length} characters of extracted text content.`
    : "Content extraction is pending or unavailable."
}

---

This document has been analyzed using AI-powered tools to provide insights and enable interactive features.`;
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Summary Card */}
          <div className="bg-white rounded-xl border-2 border-black/5 hover:border-black/10 shadow-lg transition-all duration-200 mb-8">
            <div className="px-6 py-4 border-b border-black/5 rounded-t-xl">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-black">
                        AI Document Analysis
                      </h1>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-black/60 text-sm flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(pdf.updated_at).toLocaleDateString()}
                        </p>
                        <p className="text-black/60 text-sm flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          {pdf.processing_status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div
                className={`prose max-w-none ${
                  !isSummaryExpanded ? "line-clamp-12" : ""
                }`}
              >
                <ContentFormatter content={generateSummary()} />
              </div>

              <div className="mt-6 pt-4 border-t border-black/5">
                <button
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                  className="px-4 py-2.5 bg-black hover:bg-black/90 text-white rounded-lg transition-all duration-200 shadow-lg font-medium text-sm"
                >
                  {isSummaryExpanded ? "Show Less" : "Show Full Analysis"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              icon={MessageSquare}
              title="Ask Questions"
              description="Chat with AI about your document"
              onClick={() => {
                /* Navigate to chat tab */
              }}
            />
            <QuickActionCard
              icon={FileText}
              title="Smart Notes"
              description="Auto-generated key insights"
              onClick={() => {
                /* Navigate to notes tab */
              }}
            />
            <QuickActionCard
              icon={Brain}
              title="Test Knowledge"
              description="Generate practice quizzes"
              onClick={() => {
                /* Navigate to quizzes tab */
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-5 bg-white rounded-lg border-2 border-black/5 hover:border-black/10 shadow-lg transition-all duration-200 text-left group"
    >
      <div className="relative mb-4">
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <h3 className="font-semibold text-black mb-1.5">{title}</h3>
      <p className="text-black/60 text-sm">{description}</p>
    </button>
  );
}
