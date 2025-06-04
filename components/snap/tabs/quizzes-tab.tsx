"use client";
import { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  Trophy,
  Timer,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ShuffledQuestion extends QuizQuestion {
  originalIndex: number;
  shuffledOptions: string[];
  originalOptionIndices: number[];
}

interface QuizzesTabProps {
  pdf: {
    quiz?: QuizQuestion[];
    file_name?: string;
  } | null;
  generatedQuiz?: QuizQuestion[];
  setGeneratedQuiz?: (quiz: QuizQuestion[]) => void;
  isGenerating?: boolean;
  onGenerate?: () => Promise<void>;
}

export function QuizzesTab({
  pdf,
  generatedQuiz = [],
  setGeneratedQuiz,
  isGenerating = false,
  onGenerate,
}: QuizzesTabProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);

  // Use generated quiz first, then fall back to PDF data
  let quiz: QuizQuestion[] = [];

  if (generatedQuiz.length > 0) {
    quiz = generatedQuiz;
  } else if (pdf?.quiz && Array.isArray(pdf.quiz)) {
    quiz = pdf.quiz;
  }

  // Shuffle function
  const shuffleArray = <T,>(array: T[]): [T[], number[]] => {
    const indices = array.map((_, index) => index);
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return [shuffled, indices];
  };

  // Shuffle questions and their options
  const shuffleQuiz = (questions: QuizQuestion[]): ShuffledQuestion[] => {
    const [shuffledQuestions, questionIndices] = shuffleArray(questions);
    
    return shuffledQuestions.map((q, index) => {
      const [shuffledOptions, optionIndices] = shuffleArray(q.options);
      return {
        ...q,
        originalIndex: questionIndices[index],
        shuffledOptions,
        originalOptionIndices: optionIndices,
        correctAnswer: optionIndices.indexOf(q.correctAnswer) // Update correct answer index
      };
    });
  };

  // Initialize shuffled questions
  useEffect(() => {
    if (quiz.length > 0) {
      setShuffledQuestions(shuffleQuiz(quiz));
    }
  }, [quiz]);

  const generateQuiz = async () => {
    if (onGenerate) {
      await onGenerate();
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
    setShuffledQuestions(shuffleQuiz(quiz));
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-lg px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-8">
            <Loader2 className="w-4 h-4 text-black animate-spin" />
            <span className="text-sm font-medium text-black">
              Generating quiz...
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
            Creating Your Quiz
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Our AI is analyzing your PDF content and creating personalized quiz
            questions...
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

  if (!shuffledQuestions.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-lg px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-8">
            <Timer className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">
              Generate your first quiz
            </span>
          </div>

          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto shadow-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Knowledge Testing
          </h3>
          <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
            Test your understanding with AI-generated quizzes tailored to your
            content.
          </p>

          <button
            onClick={generateQuiz}
            disabled={isGenerating}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </div>
            ) : (
              "Generate Quiz"
            )}
          </button>

          <p className="text-sm text-gray-500 mt-8">
            Our AI will analyze your document and create personalized questions
          </p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizCompleted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      const question = shuffledQuestions[index];
      return score + (answer === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const currentQ = shuffledQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const score = calculateScore();
  const percentage = Math.round((score / shuffledQuestions.length) * 100);

  if (showResults) {
    return (
      <div className="flex-1 bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-black/5 p-12 text-center">
            {/* Trophy Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20  rounded-xl flex items-center justify-center mx-auto l">
                <Trophy className="w-14 h-14 text-blue-500 stroke-2" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your Score 
            </h2>

            <div className="text-6xl font-bold text-black mb-2">
              {percentage}%
            </div>
            <p className="text-base text-gray-600 mb-8">
              You scored {score} out of {shuffledQuestions.length} questions correctly
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {shuffledQuestions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      isCorrect
                        ? "border-black/5 bg-green-50"
                        : "border-black/5 bg-red-50"
                    }`}
                  >
                    <span className="text-sm font-medium text-black">
                      Question {index + 1}
                    </span>
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Try Again with New Order
              </button>
              <button
                onClick={generateQuiz}
                className="px-6 py-3 bg-white text-black border-2 border-black/5 rounded-lg font-medium hover:border-black/10 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Generate New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Reset Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full mb-3">
              <Brain className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-black">
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{pdf?.file_name}</h2>
          </div>
          <button
            onClick={resetQuiz}
            className="px-3 py-1.5 text-sm bg-white text-black border-2 border-black/5 rounded-lg font-medium hover:border-black/10 transition-all duration-200 shadow hover:shadow-md cursor-pointer"
          >
            Restart Quiz
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-black/5 p-6 mb-6">
          <h3 className="text-xl font-bold text-black mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.shuffledOptions.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ.correctAnswer;
              const showFeedback = isSelected;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== undefined}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer !== undefined 
                      ? isCorrect
                        ? "border-green-300"
                        : isSelected
                        ? "border-red-300"
                        : "border-black/5 bg-white opacity-50"
                      : "border-black/5 bg-white hover:border-black/10 hover:shadow-lg cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-base ${
                      isSelected ? "font-medium" : "font-normal"
                    } ${
                      showFeedback
                        ? isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                        : "text-black"
                    }`}>
                      {option}
                    </span>
                    {showFeedback && (
                      isCorrect
                        ? <CheckCircle className="w-5 h-5 text-green-500" />
                        : <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== undefined && currentQ.explanation && (
            <div className="mt-6 p-4 bg-black/5 rounded-lg">
              <p className="text-sm text-black/80 font-medium font-sans">
                <strong>Explanation:</strong> {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-white text-black border-2 border-black/5 rounded-lg font-medium hover:border-black/10 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-1.5">
            {shuffledQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentQuestion
                    ? "bg-black"
                    : selectedAnswers[index] !== undefined
                    ? selectedAnswers[index] === shuffledQuestions[index].correctAnswer
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-black/10"
                }`}
              />
            ))}
          </div>

          {selectedAnswer !== undefined && (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
            >
              {currentQuestion === shuffledQuestions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>

          )}

          
        </div>
        <p className="text-sm text-gray-400 mt-4 text-center max-w-xl mx-auto">
        These questions are automatically generated based on your document. If the document lacks certain information, some questions may be incomplete or less accurate.
          </p>
      </div>
    </div>
  );
}
