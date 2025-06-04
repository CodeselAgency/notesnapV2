import { useState } from "react";
import {
  FileText,
  Video,
  Music,
  Archive,
  File,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Clock,
  HardDrive,
  Pencil,
  NotebookPen,
  Notebook,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DocumentItem {
  id: string;
  user_id: string;
  board_id: string;
  file_name: string;
  file_size: number;
  file_url: string;
  extracted_content: string;
  page_count: number;
  summary: string;
  flashcards: any; // jsonb
  notes: string;
  quiz: any; // jsonb
  processing_status: string;
  created_at: string;
  updated_at: string;
}

const DocumentListItem = ({ document }: { document: DocumentItem }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return "Today";
      } else if (diffDays === 2) {
        return "Yesterday";
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
      }
    } catch (error) {
      return "Recently";
    }
  };

  // Function to get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return FileText;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return Image;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return Video;
      case "mp3":
      case "wav":
      case "flac":
        return Music;
      case "zip":
      case "rar":
      case "7z":
        return Archive;
      default:
        return File;
    }
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "processed":
        return "bg-green-50 text-green-700";
      case "processing":
        return "bg-yellow-50 text-yellow-700";
      case "failed":
      case "error":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const FileIcon = getFileIcon(document.file_name);

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
      <Link href={`/dashboard/snaps/${document.id}`}>
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-black flex-shrink-0">
              <Image src='/images/pdf-icon.png' alt="File Icon" width={24} height={24} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-md leading-tight truncate">
                  {document.file_name}
                </h3>
                {/* <div className="flex items-center gap-1">
                <button
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div> */}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    pdf
                  </span>
                  {document.page_count > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {document.page_count} {document.page_count === 1 ? "page" : "pages"}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <HardDrive className="w-2.5 h-2.5" />
                    {formatFileSize(document.file_size)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-2.5 h-2.5" />
                  {formatDate(document.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-2 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <hr className="my-1" />
          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentListItem;
