import { useState } from "react";
import {
  Star,
  MoreVertical,
  Copy,
  Edit3,
  Trash2,
  FolderPlus,
  Clock,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";

// Updated interface to match your actual data structure
interface Board {
  id: string; // Changed from number to string
  name: string; // Changed from title to name
  description: string;
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Optional properties for backward compatibility
  type?: string;
  starred?: boolean;
  icon?: React.ElementType;
}

const BoardListItem = ({ board }: { board: Board }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Function to get board color
  const getBoardColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      black: "bg-black",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
    };
    return colorMap[color.toLowerCase()] || "bg-gray-500";
  };

  // Function to get initials from board name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
      <Link href={`/dashboard/snap/${board.id}`}>
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${getBoardColor(
                board.color
              )} rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-inner-md`}
            >
              {/* Show icon if available, otherwise show initials */}
              {board.icon ? (
                <board.icon className="w-5 h-5" />
              ) : (
                <span className="text-sm">{getInitials(board.name)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-md leading-tight truncate">
                  {board.name}
                </h3>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                    <ChevronsRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                {board.description || "No description"}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {board.type || "board"}
                  </span>
                  {board.is_default && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      Default
                    </span>
                  )}
                  <button className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <FolderPlus className="w-2.5 h-2.5 mr-1" />
                    Add to Board
                  </button>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-2.5 h-2.5" />
                  {formatDate(board.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BoardListItem;
