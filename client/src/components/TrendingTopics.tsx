import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Topic } from "@shared/schema";

interface TrendingTopicsProps {
  topics?: Topic[];
  isLoading?: boolean;
  onTopicClick?: (topic: Topic) => void;
}

export default function TrendingTopics({
  topics,
  isLoading = false,
  onTopicClick
}: TrendingTopicsProps) {

  const getDirectionIcon = (direction?: string) => {
    if (direction === 'up') {
      return <span className="text-success ml-1">↑</span>;
    } else if (direction === 'down') {
      return <span className="text-error ml-1">↓</span>;
    }
    return null;
  };

  const formatTrendPercentage = (score?: number) => {
    if (!score) return "+0%";
    return score > 0 ? `+${score}%` : `${score}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full mb-4" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center h-40">
          <p className="text-neutral-500">No trending topics found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle>Trending Topics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-3 text-sm text-neutral-700">
          Choose a trending topic to create your next viral video.
        </div>
        {topics.map((topic) => (
          <div 
            key={topic.id}
            className="bg-neutral-100 p-4 rounded-lg mb-4 cursor-pointer hover:bg-neutral-200 transition-colors"
            onClick={() => onTopicClick && onTopicClick(topic)}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-neutral-900">
                {topic.name}
                {getDirectionIcon(topic.trendDirection)}
              </h4>
              <Badge 
                className={topic.trendDirection === 'up' ? 'bg-success text-white' : 'bg-error text-white'}
              >
                {formatTrendPercentage(topic.trendScore)}
              </Badge>
            </div>
            <p className="text-sm text-neutral-700 mt-1 mb-2">{topic.description}</p>
            <div className="flex flex-wrap gap-2">
              {topic.tags?.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <div className="px-6 py-4 bg-neutral-100 border-t border-neutral-200">
        <a href="/topics" className="text-sm font-medium text-secondary hover:text-blue-700 flex items-center justify-center">
          Explore All Topics
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </Card>
  );
}
