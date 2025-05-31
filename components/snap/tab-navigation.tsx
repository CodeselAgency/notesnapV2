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
    <nav className="flex space-x-2 flex-1 py-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? "bg-black text-white shadow-lg"
                : "text-black/60 hover:text-black hover:bg-black/5"
            } px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200`}
          >
            <Icon className="w-4 h-4" />
            {tab.name}
          </button>
        );
      })}
    </nav>
  );
}
