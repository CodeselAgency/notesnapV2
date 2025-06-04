"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Share2, MoreVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { usePdf } from "@/hooks/usePdf";
import { TabNavigation } from "@/components/snap/tab-navigation";
import { SnapTab } from "@/components/snap/tabs/snap-tab";
import { ChatTab, ChatTabRedux } from "@/components/snap/tabs/chat-tab";
import { PlaceholderTab } from "@/components/snap/tabs/placeholder-tab";
import { LoadingState } from "@/components/snap/loadingstate";
import { ErrorState } from "@/components/snap/errorstate";
import { tabs } from "@/constants/index";
import { FlashcardsTab } from "@/components/snap/tabs/flashcards-tab";
import { NotesTab } from "@/components/snap/tabs/notes-tab";
import { QuizzesTab } from "@/components/snap/tabs/quizzes-tab";

interface Flashcard {
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface GeneratedContent {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export default function SnapPage() {
  const [activeTab, setActiveTab] = useState("snap");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    flashcards: [],
    quiz: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const pdfId = params.id;

  const {
    currentPdf,
    loadingPdf,
    error,
    loadPdfById,
    clearCurrentPdf,
    clearError,
  } = usePdf();

  useEffect(() => {
    if (pdfId) {
      clearCurrentPdf();
      clearError();
      loadPdfById(pdfId);
      // Clear generated content when loading a new PDF
      setGeneratedContent({ flashcards: [], quiz: [] });
    }

    return () => {
      clearCurrentPdf();
    };
  }, [pdfId, loadPdfById, clearCurrentPdf, clearError]);

  // Shared function to generate both flashcards and quiz
  const generateContent = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/pdfs/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ snapId: pdfId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();

      // Assuming the API returns both flashcards and quiz data
      setGeneratedContent({
        flashcards: data.flashcards?.flashcards || [],
        quiz: data.quiz?.questions || [],
      });
    } catch (error) {
      console.error("Error generating content:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "snap":
        return <SnapTab pdf={currentPdf} />;
      case "chat":
        return <ChatTabRedux pdf={currentPdf} />;
      case "flashcards":
        return (
          <FlashcardsTab
            pdf={currentPdf}
            generatedFlashcards={generatedContent.flashcards}
            setGeneratedFlashcards={(flashcards: Flashcard[]) =>
              setGeneratedContent((prev) => ({ ...prev, flashcards }))
            }
            isGenerating={isGenerating}
            onGenerate={generateContent}
          />
        );
      case "notes":
        return <NotesTab pdf={currentPdf} />;
      case "quizzes":
        return (
          <QuizzesTab
            pdf={currentPdf}
            generatedQuiz={generatedContent.quiz}
            setGeneratedQuiz={(quiz: QuizQuestion[]) =>
              setGeneratedContent((prev) => ({ ...prev, quiz }))
            }
            isGenerating={isGenerating}
            onGenerate={generateContent}
          />
        );
      case "mindmap":
        return <PlaceholderTab type="mindmap" />;
      default:
        return null;
    }
  };

  if (loadingPdf) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => loadPdfById(pdfId)} />;
  }

  if (!currentPdf) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">PDF not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Fixed Header with Tab Navigation */}
      <div className="bg-white fixed top-0 left-0 right-0 z-10 w-full lg:left-64">
        <div className="w-full">
          {/* Mobile Header */}
          <div className="lg:hidden px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {currentPdf?.title || "Document"}
              </h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 lg:px-8 py-2 flex items-center gap-2 lg:gap-4">
            {/* Desktop Back Button */}
            <button
              onClick={() => router.back()}
              className="hidden lg:flex group p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>

            {/* Tab Navigation Container */}
            <div className="flex-1 min-w-0 overflow-x-auto">
              <div className="flex items-center min-w-max">
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content with proper spacing for sidebar and header */}
      <div className="pt-[100px] lg:pt-[80px]  w-full lg:w-auto">
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">{renderTabContent()}</div>
      </div>
    </div>
  );
}
