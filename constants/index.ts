import { Camera, MessageCircle, FlipHorizontal, ClipboardIcon, Network, NotebookPen } from 'lucide-react';

export interface Tab {
    id: string;
    name: string;
    icon: React.ElementType;
    gradient: string;
    description: string;
}

export const tabs: Tab[] = [
    {
        id: "snap",
        name: "Snap",
        icon: Camera,
        gradient: "from-blue-500 to-purple-500",
        description: "AI-powered document analysis",
    },
    {
        id: "chat",
        name: "Chat",
        icon: MessageCircle,
        gradient: "from-blue-500 to-purple-500",
        description: "Intelligent conversation",
    },
    {
        id: "flashcards",
        name: "Flashcards",
        icon: FlipHorizontal,
        gradient: "from-blue-500 to-purple-500",
        description: "Study with smart cards",
    },
    {
        id: "notes",
        name: "Notes",
        icon: NotebookPen,
        gradient: "from-blue-500 to-purple-500",
        description: "Organized insights",
    },
    {
        id: "quizzes",
        name: "Quizzes",
        icon: ClipboardIcon,
        gradient: "from-blue-500 to-purple-500",
        description: "Test your knowledge",
    },
    {
        id: "mindmap",
        name: "Mind Map",
        icon: Network,
        gradient: "from-blue-500 to-purple-500",
        description: "Visual connections",
    },
];

export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    type?: "summary" | "regular";
}

export interface PdfData {
    id: string;
    file_name: string;
    file_size: number;
    file_url: string;
    extracted_content?: string;
    page_count?: number;
    summary?: string;
    flashcards?: any;
    notes?: string;
    quiz?: any;
    processing_status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}
