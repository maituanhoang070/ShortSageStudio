import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Topic } from "@shared/schema";
import CreateVideoModal from "@/components/CreateVideoModal";

export default function Topics() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [topicAnalysis, setTopicAnalysis] = useState<any>(null);

  // Fetch all topics
  const { data: topics, isLoading } = useQuery({
    queryKey: ['/api/topics'],
  });

  const analyzeTopicTrend = async (topic: Topic) => {
    setSelectedTopic(topic);
    setAnalysisLoading(true);
    
    try {
      const response = await fetch(`/api/topics/${topic.id}/analyze`);
      if (!response.ok) throw new Error("Failed to analyze topic");
      
      const analysis = await response.json();
      setTopicAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing topic:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const openCreateModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsCreateModalOpen(true);
  };

  // Group topics by trend direction
  const groupedTopics = {
    trending: topics?.filter((topic: Topic) => topic.trendDirection === 'up' && topic.trendScore > 80) || [],
    stable: topics?.filter((topic: Topic) => topic.trendDirection === 'stable' || (topic.trendDirection === 'up' && topic.trendScore <= 80)) || [],
    declining: topics?.filter((topic: Topic) => topic.trendDirection === 'down') || []
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">Topic Discovery</h2>
          <p className="text-sm text-neutral-700">Find trending topics for your YouTube shorts</p>
        </div>
      </div>

      <Tabs defaultValue="trending" className="mb-6">
        <TabsList>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="stable">Stable Topics</TabsTrigger>
          <TabsTrigger value="declining">Declining Topics</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="trending" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTopics.trending.map((topic: Topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onAnalyze={analyzeTopicTrend}
                    onCreateVideo={() => openCreateModal(topic)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="stable" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTopics.stable.map((topic: Topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onAnalyze={analyzeTopicTrend}
                    onCreateVideo={() => openCreateModal(topic)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="declining" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTopics.declining.map((topic: Topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onAnalyze={analyzeTopicTrend}
                    onCreateVideo={() => openCreateModal(topic)}
                  />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {selectedTopic && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Topic Analysis: {selectedTopic.name}</span>
              <Badge 
                variant={selectedTopic.trendDirection === 'up' ? 'success' : 'destructive'}
                className="ml-2"
              >
                {selectedTopic.trendDirection === 'up' ? '+' : '-'}
                {selectedTopic.trendScore}%
              </Badge>
            </CardTitle>
            <CardDescription>{selectedTopic.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : topicAnalysis ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Recommended Angles</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {topicAnalysis.recommendedAngles.map((angle: string, idx: number) => (
                      <li key={idx} className="text-sm">{angle}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Angles to Avoid</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {topicAnalysis.avoidedAngles.map((angle: string, idx: number) => (
                      <li key={idx} className="text-sm text-red-600">{angle}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Sample Title Ideas</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {topicAnalysis.sampleTitles.map((title: string, idx: number) => (
                      <li key={idx} className="text-sm font-medium">{title}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => openCreateModal(selectedTopic)}
                  >
                    Create Video with This Topic
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">Select a topic to analyze</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <CreateVideoModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        topicsData={topics}
        initialTopic={selectedTopic}
      />
    </>
  );
}

interface TopicCardProps {
  topic: Topic;
  onAnalyze: (topic: Topic) => void;
  onCreateVideo: () => void;
}

function TopicCard({ topic, onAnalyze, onCreateVideo }: TopicCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>{topic.name}</span>
          <Badge 
            variant={topic.trendDirection === 'up' ? 'success' : 'destructive'}
            className="ml-2"
          >
            {topic.trendDirection === 'up' ? '+' : '-'}
            {topic.trendScore}%
          </Badge>
        </CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {topic.tags?.map((tag, idx) => (
            <Badge key={idx} variant="outline">{tag}</Badge>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onAnalyze(topic)}>
            Analyze Trend
          </Button>
          <Button size="sm" onClick={onCreateVideo}>
            Create Video
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
