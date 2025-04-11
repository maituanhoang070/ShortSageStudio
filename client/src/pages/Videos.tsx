import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoList from "@/components/VideoList";
import CreateVideoModal from "@/components/CreateVideoModal";
import { Button } from "@/components/ui/button";
import { Video } from "@shared/schema";

export default function Videos() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch all videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos'],
  });

  // Group videos by status
  const groupedVideos = {
    published: videos?.filter((video: Video) => video.status === 'published') || [],
    processing: videos?.filter((video: Video) => video.status === 'processing') || [],
    draft: videos?.filter((video: Video) => video.status === 'draft') || []
  };

  // Fetch trending topics
  const { data: topics } = useQuery({
    queryKey: ['/api/topics/trending'],
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">My Videos</h2>
          <p className="text-sm text-neutral-700">Manage your YouTube shorts videos</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 md:mt-0"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Video
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Video Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-100 rounded-lg">
              <div className="text-2xl font-bold">{groupedVideos.published.length}</div>
              <div className="text-sm text-neutral-700">Published Videos</div>
            </div>
            <div className="p-4 bg-neutral-100 rounded-lg">
              <div className="text-2xl font-bold">{groupedVideos.processing.length}</div>
              <div className="text-sm text-neutral-700">Processing</div>
            </div>
            <div className="p-4 bg-neutral-100 rounded-lg">
              <div className="text-2xl font-bold">{groupedVideos.draft.length}</div>
              <div className="text-sm text-neutral-700">Drafts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <VideoList 
            videos={videos} 
            isLoading={isLoading} 
            showActions 
            emptyMessage="No videos yet. Create your first video!"
          />
        </TabsContent>
        
        <TabsContent value="published">
          <VideoList 
            videos={groupedVideos.published} 
            isLoading={isLoading} 
            showActions 
            emptyMessage="No published videos yet."
          />
        </TabsContent>
        
        <TabsContent value="processing">
          <VideoList 
            videos={groupedVideos.processing} 
            isLoading={isLoading} 
            showActions 
            emptyMessage="No videos in processing."
          />
        </TabsContent>
        
        <TabsContent value="draft">
          <VideoList 
            videos={groupedVideos.draft} 
            isLoading={isLoading} 
            showActions 
            emptyMessage="No draft videos."
          />
        </TabsContent>
      </Tabs>

      <CreateVideoModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        topicsData={topics}
      />
    </>
  );
}
