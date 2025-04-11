import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/StatsCards";
import VideoList from "@/components/VideoList";
import TrendingTopics from "@/components/TrendingTopics";
import UsageStats from "@/components/UsageStats";
import CreateVideoModal from "@/components/CreateVideoModal";

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch stats data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  // Fetch trending topics
  const { data: trendingTopics, isLoading: topicsLoading } = useQuery({
    queryKey: ['/api/topics/trending'],
  });

  // Fetch recent videos
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['/api/videos'],
  });

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">Dashboard</h2>
          <p className="text-sm text-neutral-700">Overview of your automated YouTube shorts</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Video
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={statsLoading} />

      {/* Recent Videos and Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Videos */}
        <div className="lg:col-span-2">
          <VideoList 
            videos={videos} 
            isLoading={videosLoading} 
            title="Recent Videos" 
            seeAllLink="/videos"
          />
        </div>

        {/* Trending Topics and Usage Stats */}
        <div className="lg:col-span-1 space-y-6">
          <TrendingTopics 
            topics={trendingTopics} 
            isLoading={topicsLoading} 
            onTopicClick={openCreateModal}
          />
          <UsageStats />
        </div>
      </div>

      {/* Create Video Modal */}
      <CreateVideoModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal}
        topicsData={trendingTopics}
      />
    </>
  );
}
