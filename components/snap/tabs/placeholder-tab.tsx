import {
  BookOpen,
  FileText,
  Brain,
  Map,
  Sparkles,
  Timer,
  Bell,
} from "lucide-react";

interface PlaceholderTabProps {
  type: "flashcards" | "notes" | "quizzes" | "mindmap";
}

const tabConfig = {
  flashcards: {
    icon: BookOpen,
    title: "Smart Flashcards",
    description:
      "Interactive flashcards will be generated from your PDF content to enhance learning.",
    buttonText: "Get Early Access",
    comingSoonDate: "Coming December 2024",
  },
  notes: {
    icon: FileText,
    title: "Smart Notes",
    description:
      "Organized notes and key takeaways from your document, automatically structured for easy review.",
    buttonText: "Get Early Access",
    comingSoonDate: "Coming November 2024",
  },
  quizzes: {
    icon: Brain,
    title: "Knowledge Testing",
    description:
      "Test your knowledge with AI-generated quizzes tailored to your document content.",
    buttonText: "Get Early Access",
    comingSoonDate: "Coming January 2025",
  },
  mindmap: {
    icon: Map,
    title: "Visual Mind Map",
    description:
      "Visual mind map of concepts and relationships within your document for better understanding.",
    buttonText: "Coming Soon",
    comingSoonDate: "Coming June 2025",
  },
};

export function PlaceholderTab({ type }: PlaceholderTabProps) {
  const config = tabConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center max-w-lg px-6">
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-8">
          <Timer className="w-4 h-4 text-black" />
          <span className="text-sm font-medium text-black">
            {config.comingSoonDate}
          </span>
        </div>

        {/* Icon Container */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Icon className="w-10 h-10 text-white" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          {config.title}
        </h3>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          {config.description}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto">
            {config.buttonText}
          </button>

          {/* Notify Me Button */}
          {/* <div className="flex items-center justify-center gap-2 mt-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">
                Notify me when available
              </span>
            </button>
          </div> */}
        </div>

        {/* Beta Access Note */}
        {/* <p className="text-sm text-gray-500 mt-8">
          Want early beta access? Join our waitlist today!
        </p> */}
      </div>
    </div>
  );
}
