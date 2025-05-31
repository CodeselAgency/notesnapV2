import React from "react";
import {
  FiBookOpen,
  FiClipboard,
  FiDollarSign,
  FiTool,
  FiBriefcase,
  FiFileText,
} from "react-icons/fi"; // Using Feather icons

interface UseCase {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

const useCases: UseCase[] = [
  {
    title: "Textbooks & Reading Materials", // Updated title slightly
    description:
      "Stop just reading, start interacting. Upload textbooks to NoteSnap, ask clarifying questions, and generate instant notes to master course content faster.",
    icon: FiBookOpen,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Research Papers", // Updated title slightly
    description:
      "Navigate complex academic papers effortlessly. NoteSnap helps you quickly extract key arguments, methodologies, and conclusions for your literature reviews.",
    icon: FiClipboard,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Business & Finance Docs", // Updated title slightly
    description:
      "Make sense of case studies and financial reports. Use NoteSnap to analyze data, define key terms, and grasp complex business concepts with confidence.",
    icon: FiDollarSign,
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Lecture Notes & Slides",
    description:
      "Transform static lecture materials into dynamic study aids. Query your notes with NoteSnap, create flashcards, and ensure you didn't miss crucial details.",
    icon: FiTool,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Legal Texts & Case Law", // Updated title slightly
    description:
      "Decipher dense legal documents efficiently. NoteSnap assists law students in understanding statutes, precedents, and complex arguments for better analysis.",
    icon: FiBriefcase,
    iconBgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Study Guides & Handouts",
    description:
      "Maximize the value of your study guides. Chat with handouts using NoteSnap to review specific sections, test your recall, and prepare effectively for exams.",
    icon: FiFileText,
    iconBgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

const UseCasesPage = () => {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900">
          Unlock Potential with NoteSnap
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md flex flex-col"
            >
              {/* <a
                href="#"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiArrowUpRight size={20} />
              </a> */}
              <div
                className={`p-3 rounded-lg ${useCase.iconBgColor} self-start mb-4`}
              >
                <useCase.icon className={`w-6 h-6 ${useCase.iconColor}`} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {useCase.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UseCasesPage;
