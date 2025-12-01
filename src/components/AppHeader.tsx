import { Settings } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="w-8" /> {/* Spacer for centering */}
        <h1 className="text-xl font-bold tracking-tight">RunHNT</h1>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
