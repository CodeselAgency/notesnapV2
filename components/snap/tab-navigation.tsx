"use client";
import type { Tab } from "@/constants/index";

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="relative w-full border-b border-gray-200 bg-white">
      {/* Fade effects for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />
      
      {/* Container with horizontal padding */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {/* Scrollable container */}
        <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
          <div className="flex space-x-1 sm:space-x-2 min-w-max py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "bg-gradient-to-b from-zinc-600 to-zinc-900 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

// Add this CSS to your global styles or create a new style module
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }
