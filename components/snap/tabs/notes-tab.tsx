"use client";
import { useState } from "react";
import {
  FileText,
  Search,
  Copy,
  Download,
  Sparkles,
  Timer,
  Brain,
  BookOpen,
  Check,
} from "lucide-react";

interface NotesTabProps {
  pdf: {
    notes?: string | string[];
    file_name?: string;
    summary?: string;
  } | null;
}

export function NotesTab({ pdf }: NotesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  let notes: string[] = [];
  try {
    if (typeof pdf?.notes === "string") {
      notes = JSON.parse(pdf.notes);
    } else if (Array.isArray(pdf?.notes)) {
      notes = pdf.notes;
    }
  } catch (error) {
    console.error("Error parsing notes:", error);
    notes = [];
  }

  const [isCopying , setIsCopying] = useState(false);
  const summary = pdf?.summary || "";
  if ((!notes || notes.length === 0) && !summary) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-lg px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-8">
            <Timer className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">
              Generate your first notes
            </span>
          </div>

          {/* Icon Container */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Notes</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Transform your PDF content into organized, easy-to-review notes.
          </p>

          <button className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto">
            Generate Notes
          </button>

          <p className="text-sm text-gray-500 mt-8">
            Our AI will analyze your document and create comprehensive notes
          </p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string | string[]) => {
    const content = Array.isArray(text) ? text.join("\n\n") : text;
    navigator.clipboard.writeText(content);
  };

  const downloadNotes = () => {
    const notesContent = Array.isArray(notes) ? notes.join("\n\n") : notes;
    const content = `${summary ? `Summary:\n${summary}\n\n` : ""}${
      notesContent ? `Notes:\n${notesContent}` : ""
    }`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdf?.file_name || "document"}-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className="flex-1 bg-white">
      <div className="w-full mx-auto p-8">
        {/* Header with Status Badge */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
                <Brain className="w-4 h-4 text-black" />
                <span className="text-sm font-medium text-black">
                  Smart Notes
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {pdf?.file_name}
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  copyToClipboard(notes || []);
                  setIsCopying(true);
                  setTimeout(() => setIsCopying(false), 2000);
                }}
                className="p-2 bg-white text-black border-2 border-black/5 rounded-lg hover:border-black/10 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                title="Copy notes"
              >
                {isCopying ? (
                  <Check className="w-4 h-4 " />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={downloadNotes}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                title="Download notes"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
            <input
              type="text"
              placeholder="Search in notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-black bg-white rounded-xl border-2 border-black/5 focus:outline-none focus:border-black/10 transition-all duration-200 text-lg"
            />
          </div>
        </div>

        <div className="space-y-8">
          {notes && notes.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Key Points</h3>
                <div className="px-4 py-2 bg-black/5 rounded-full">
                  <span className="text-sm font-medium text-black">
                    {notes.length} notes
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notes.map((note: string, index: number) => {
                  const shouldShow =
                    !searchTerm ||
                    note.toLowerCase().includes(searchTerm.toLowerCase());
                  if (!shouldShow) return null;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg border-2 border-black/5 p-6 hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8  flex items-center justify-center flex-shrink-0 border border-black/50 rounded-full">
                          <span className="text-black text-md font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div
                          className="prose prose-gray text-black max-w-none leading-relaxed flex-1 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(note, searchTerm),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
