// Import types from schema
import { 
  User as SchemaUser, 
  Topic as SchemaTopic, 
  Video as SchemaVideo, 
  Template as SchemaTemplate,
  VideoStats as SchemaVideoStats,
  InsertUser,
  InsertTopic,
  InsertVideo,
  InsertTemplate
} from "@shared/schema";

// Re-export the types
export type User = SchemaUser;
export type Topic = SchemaTopic;
export type Video = SchemaVideo;
export type Template = SchemaTemplate;
export type VideoStats = SchemaVideoStats;

// Re-export the insert types
export type NewUser = InsertUser;
export type NewTopic = InsertTopic;
export type NewVideo = InsertVideo;
export type NewTemplate = InsertTemplate;

// Form-specific types
export interface VideoFormData {
  title: string;
  topicId: string;
  description: string;
  style: string;
  voiceType: string;
  addWatermark: boolean;
}

export interface CreateVideoParams {
  title: string;
  topicId: number;
  description?: string;
  templateId: number;
  userId: number;
}

// API response types
export interface TopicAnalysis {
  topic: string;
  score: number;
  direction: string;
  recommendedAngles: string[];
  avoidedAngles: string[];
  relatedTags: string[];
  sampleTitles: string[];
}

export interface StatsResponse {
  videosCreated: number;
  totalViews: string;
  engagementRate: string;
  subscribersGained: string;
}

// UI state types
export interface FilterOptions {
  status?: string;
  topicId?: number;
  dateRange?: [Date, Date];
  sortBy?: 'date' | 'views' | 'engagement';
  sortDirection?: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}
