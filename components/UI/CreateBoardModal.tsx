import { useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function CreateBoardModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error,
}: CreateBoardModalProps) {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardName.trim()) {
      onSubmit(boardName.trim(), description.trim());
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setDescription(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Create New Board</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="boardName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Board Name
            </label>
            <input
              type="text"
              id="boardName"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <span
                className={`text-xs ${
                  description.length === 20
                    ? "text-amber-500 font-medium"
                    : "text-slate-500"
                }`}
              >
                {description.length}/20
              </span>
            </div>
            <input
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter board description"
              className={`w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
                description.length === 20
                  ? "border-amber-200 bg-amber-50/50"
                  : ""
              }`}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!boardName.trim() || isLoading}
              className="relative px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Create Board</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </>
              ) : (
                "Create Board"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
