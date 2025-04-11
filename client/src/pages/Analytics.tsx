import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics() {
  // Fetch all videos for analytics
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos'],
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }

  const processedVideos = videos || [];

  // Process video data for charts
  const viewsData = processedVideos.map((video: Video) => ({
    name: shortenTitle(video.title),
    views: video.stats?.views || 0,
  })).sort((a, b) => b.views - a.views);

  const engagementData = processedVideos.map((video: Video) => {
    const likes = video.stats?.likes || 0;
    const comments = video.stats?.comments || 0;
    const shares = video.stats?.shares || 0;
    
    return {
      name: shortenTitle(video.title),
      likes,
      comments,
      shares
    };
  });

  // Calculate engagement breakdown (total likes, comments, shares) for pie chart
  const totalEngagement = {
    likes: processedVideos.reduce((sum, video) => sum + (video.stats?.likes || 0), 0),
    comments: processedVideos.reduce((sum, video) => sum + (video.stats?.comments || 0), 0),
    shares: processedVideos.reduce((sum, video) => sum + (video.stats?.shares || 0), 0)
  };

  const engagementBreakdownData = [
    { name: 'Likes', value: totalEngagement.likes },
    { name: 'Comments', value: totalEngagement.comments },
    { name: 'Shares', value: totalEngagement.shares }
  ];

  const COLORS = ['#065FD4', '#FF0000', '#4CAF50'];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Analytics</h2>
        <p className="text-sm text-neutral-700">Track the performance of your YouTube shorts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-700">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedVideos.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-700">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || '0'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-700">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.engagementRate || '0%'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-neutral-700">Subscribers Gained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.subscribersGained || '+0'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="views" className="mb-6">
        <TabsList>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Video Views</CardTitle>
              <CardDescription>
                Compare views across your published videos
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={viewsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#065FD4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Likes, comments, and shares per video
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={engagementData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="#FF0000" />
                  <Line type="monotone" dataKey="comments" stroke="#065FD4" />
                  <Line type="monotone" dataKey="shares" stroke="#4CAF50" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>
                Distribution of likes, comments, and shares
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Videos</CardTitle>
          <CardDescription>
            Your most viewed videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viewsData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-700 font-medium mr-3">
                    {index + 1}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="font-semibold">{item.views.toLocaleString()} views</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function shortenTitle(title: string, maxLength = 20): string {
  if (!title) return "Untitled";
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
}

function AnalyticsLoadingSkeleton() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Analytics</h2>
        <p className="text-sm text-neutral-700">Track the performance of your YouTube shorts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="w-8 h-8 rounded-full mr-3" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
