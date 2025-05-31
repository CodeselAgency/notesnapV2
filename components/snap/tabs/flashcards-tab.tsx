"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  Brain,
  Timer,
  Loader2,
} from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardsTabProps {
  pdf: {
    flashcards?: Flashcard[] | any[];
    quiz?: any[];
    file_name?: string;
  } | null;
  generatedFlashcards?: Flashcard[];
  setGeneratedFlashcards?: (flashcards: Flashcard[]) => void;
  isGenerating?: boolean;
  onGenerate?: () => Promise<void>;
}

export function FlashcardsTab({
  pdf,
  generatedFlashcards = [],
  setGeneratedFlashcards,
  isGenerating = false,
  onGenerate,
}: FlashcardsTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Use generated flashcards first, then fall back to PDF data
  let flashcards: Flashcard[] = [];

  if (generatedFlashcards.length > 0) {
    flashcards = generatedFlashcards;
  } else if (pdf?.flashcards && Array.isArray(pdf.flashcards)) {
    flashcards = pdf.flashcards;
  } else if (pdf?.quiz && Array.isArray(pdf.quiz)) {
    flashcards = pdf.quiz.map(
      (q: {
        question: string;
        explanation?: string;
        options: string[];
        correctAnswer: number;
      }) => ({
        question: q.question,
        answer:
          q.explanation || q.options[q.correctAnswer] || "No answer available",
      })
    );
  }

  const generateFlashcards = async () => {
    if (onGenerate) {
      await onGenerate();
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-lg px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-8">
            <Loader2 className="w-4 h-4 text-black animate-spin" />
            <span className="text-sm font-medium text-black">
              Generating flashcards...
            </span>
          </div>

          {/* Icon Container */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Creating Your Flashcards
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Our AI is analyzing your PDF content and creating personalized
            flashcards...
          </p>

          <div className="w-full max-w-sm mx-auto">
            <div className="w-full bg-black/5 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-lg px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-8">
            <Timer className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">
              Generate your first flashcards
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

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Smart Flashcards
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Transform your PDF content into interactive flashcards for effective
            learning.
          </p>

          <button
            onClick={generateFlashcards}
            disabled={isGenerating}
            className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </div>
            ) : (
              "Generate Flashcards"
            )}
          </button>

          <p className="text-sm text-gray-500 mt-8">
            Our AI will analyze your document and create personalized flashcards
          </p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex-1 bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Status Badge */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
              <Brain className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-black">
                Learning Session
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {pdf?.file_name}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-black mb-1">
              {currentIndex + 1}/{flashcards.length}
            </div>
            <div className="text-sm text-gray-500">Cards Reviewed</div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <div
              className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={flipCard}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Question Side */}
              <div
                className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border-2 border-black/5 flex items-center justify-center p-12 backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-black/40 mb-6">
                    QUESTION
                  </div>
                  <p className="text-2xl font-medium text-black leading-relaxed">
                    {currentCard.question}
                  </p>
                  <div className="mt-8 text-sm text-black/40">
                    Tap to reveal answer
                  </div>
                </div>
              </div>

              {/* Answer Side */}
              <div
                className="absolute inset-0 w-full h-full bg-black rounded-2xl shadow-xl flex items-center justify-center p-12 backface-hidden rotate-y-180"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-white/60 mb-6">
                    ANSWER
                  </div>
                  <p className="text-2xl font-medium text-white leading-relaxed">
                    {currentCard.answer}
                  </p>
                  <div className="mt-8 text-sm text-white/40">
                    Tap to see question
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevCard}
              disabled={flashcards.length <= 1}
              className="p-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsFlipped(false)}
              className="p-4 bg-white text-black border-2 border-black/5 rounded-xl hover:border-black/10 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={nextCard}
              disabled={flashcards.length <= 1}
              className="p-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="w-full bg-black/5 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
