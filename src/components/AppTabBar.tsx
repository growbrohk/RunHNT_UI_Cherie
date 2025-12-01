import { Map, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppTabBarProps {
  activeTab: "feed" | "entry";
  onTabChange: (tab: "feed" | "entry") => void;
}

const AppTabBar = ({ activeTab, onTabChange }: AppTabBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-around">
        <button
          onClick={() => onTabChange("feed")}
          className={cn(
            "flex flex-col items-center gap-1 py-2 px-6 rounded-lg transition-colors",
            activeTab === "feed" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Map className="w-6 h-6" />
          <span className="text-sm font-medium">Feed</span>
        </button>
        
        <button
          onClick={() => onTabChange("entry")}
          className={cn(
            "flex flex-col items-center gap-1 py-2 px-6 rounded-lg transition-colors",
            activeTab === "entry" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Camera className="w-6 h-6" />
          <span className="text-sm font-medium">Entry</span>
        </button>
      </div>
    </nav>
  );
};

export default AppTabBar;
