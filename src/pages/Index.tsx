import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppTabBar from "@/components/AppTabBar";
import EntryView from "@/components/EntryView";
import FeedView from "@/components/FeedView";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"feed" | "entry">("entry");
  const [showFeed, setShowFeed] = useState(false);

  const handleTabChange = (tab: "feed" | "entry") => {
    setActiveTab(tab);
    if (tab === "feed") {
      setShowFeed(true);
    } else {
      setShowFeed(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="pt-14 pb-20">
        {!showFeed && <EntryView />}
      </main>

      {showFeed && <FeedView onClose={() => setShowFeed(false)} />}

      <AppTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
