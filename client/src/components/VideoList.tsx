import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, Topic } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface VideoListProps {
  videos?: Video[];
  isLoading?: boolean;
  title?: string;
  seeAllLink?: string;
  showActions?: boolean;
  emptyMessage?: string;
}

export default function VideoList({
  videos,
  isLoading = false,
  title = "Videos",
  seeAllLink,
  showActions = false,
  emptyMessage = "No videos available"
}: VideoListProps) {
  // Fetch topics to get topic names
  const { data: topics } = useQuery({
    queryKey: ['/api/topics'],
  });

  const getTopicName = (topicId: number): string => {
    if (!topics) return "";
    const topic = topics.find((t: Topic) => t.id === topicId);
    return topic?.name || "";
  };

  const getTopicTags = (topicId: number): string[] => {
    if (!topics) return [];
    const topic = topics.find((t: Topic) => t.id === topicId);
    return topic?.tags || [];
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <div className="divide-y divide-neutral-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 mb-4 sm:mb-0">
                  <Skeleton className="h-32 w-56 rounded-lg" />
                </div>
                <div className="sm:ml-6 flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center h-40">
          <p className="text-neutral-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="divide-y divide-neutral-200">
        {videos.map((video) => (
          <div key={video.id} className="p-6">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 mb-4 sm:mb-0">
                <div className="relative rounded-lg overflow-hidden h-32 w-56 bg-neutral-200">
                  <img
                    className="h-full w-full object-cover"
                    src={video.thumbnailUrl || "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"}
                    alt={video.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white bg-opacity-75 rounded-full p-2">
                      <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </button>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:ml-6 flex-1">
                <h4 className="text-base font-medium text-neutral-900 line-clamp-2">{video.title}</h4>
                <div className="mt-1 flex items-center text-sm text-neutral-700">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {video.stats?.views?.toLocaleString() || 0}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    {video.stats?.likes || 0}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(video.publishedAt || video.createdAt)}</span>
                </div>
                <div className="mt-2">
                  {getTopicTags(video.topicId).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="mr-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {showActions && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button variant="link" size="sm" className="h-6 text-xs text-secondary">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                      Edit
                    </Button>
                    <Button variant="link" size="sm" className="h-6 text-xs text-secondary">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Schedule Repost
                    </Button>
                    <Button variant="link" size="sm" className="h-6 text-xs text-secondary">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      View Analytics
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {seeAllLink && (
        <div className="px-6 py-4 bg-neutral-100 border-t border-neutral-200">
          <Link href={seeAllLink} className="text-sm font-medium text-secondary hover:text-blue-700 flex items-center justify-center">
            View All Videos
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      )}
    </Card>
  );
}
