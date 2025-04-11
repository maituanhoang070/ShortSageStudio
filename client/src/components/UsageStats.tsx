import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UsageStats() {
  // In a real app, these values would come from an API
  const usageStats = {
    monthlyVideos: {
      used: 3,
      total: 5,
      percentage: 60
    },
    storage: {
      used: 245,
      total: 500,
      percentage: 49
    },
    apiCalls: {
      used: 356,
      total: 1000,
      percentage: 35.6
    }
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle>Usage Stats</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-neutral-700">Monthly Videos</span>
              <span className="text-sm font-bold text-neutral-900">
                {usageStats.monthlyVideos.used}/{usageStats.monthlyVideos.total}
              </span>
            </div>
            <Progress value={usageStats.monthlyVideos.percentage} className="h-2.5 bg-neutral-200">
              <div 
                className="h-full bg-accent rounded-full" 
                style={{ width: `${usageStats.monthlyVideos.percentage}%` }}
              />
            </Progress>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-neutral-700">Storage</span>
              <span className="text-sm font-bold text-neutral-900">
                {usageStats.storage.used}MB/{usageStats.storage.total}MB
              </span>
            </div>
            <Progress value={usageStats.storage.percentage} className="h-2.5 bg-neutral-200">
              <div 
                className="h-full bg-secondary rounded-full" 
                style={{ width: `${usageStats.storage.percentage}%` }}
              />
            </Progress>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-neutral-700">API Calls</span>
              <span className="text-sm font-bold text-neutral-900">
                {usageStats.apiCalls.used}/{usageStats.apiCalls.total}
              </span>
            </div>
            <Progress value={usageStats.apiCalls.percentage} className="h-2.5 bg-neutral-200">
              <div 
                className="h-full bg-success rounded-full" 
                style={{ width: `${usageStats.apiCalls.percentage}%` }}
              />
            </Progress>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
