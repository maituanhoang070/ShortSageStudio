import { apiRequest } from "@/lib/queryClient";
import { API } from "@/lib/constants";
import type { InsertVideo, InsertTopic } from "@shared/schema";

/**
 * Topic related API functions
 */
export const topicsApi = {
  /**
   * Get all topics
   */
  getTopics: async () => {
    const response = await apiRequest("GET", API.TOPICS);
    return response.json();
  },

  /**
   * Get trending topics
   */
  getTrendingTopics: async () => {
    const response = await apiRequest("GET", API.TRENDING_TOPICS);
    return response.json();
  },

  /**
   * Analyze a topic
   */
  analyzeTopic: async (id: number) => {
    const response = await apiRequest("GET", API.TOPIC_ANALYZE(id));
    return response.json();
  },

  /**
   * Create a new topic
   */
  createTopic: async (topic: InsertTopic) => {
    const response = await apiRequest("POST", API.TOPICS, topic);
    return response.json();
  }
};

/**
 * Video related API functions
 */
export const videosApi = {
  /**
   * Get all videos
   */
  getVideos: async () => {
    const response = await apiRequest("GET", API.VIDEOS);
    return response.json();
  },

  /**
   * Get a single video
   */
  getVideo: async (id: number) => {
    const response = await apiRequest("GET", API.VIDEO(id));
    return response.json();
  },

  /**
   * Get videos for a user
   */
  getUserVideos: async (userId: number) => {
    const response = await apiRequest("GET", API.USER_VIDEOS(userId));
    return response.json();
  },

  /**
   * Generate a new video
   */
  generateVideo: async (data: {
    topicId: number;
    templateId: number;
    title: string;
    description?: string;
    userId: number;
  }) => {
    const response = await apiRequest("POST", API.GENERATE_VIDEO, data);
    return response.json();
  },

  /**
   * Create a new video
   */
  createVideo: async (video: InsertVideo) => {
    const response = await apiRequest("POST", API.VIDEOS, video);
    return response.json();
  },

  /**
   * Update video status
   */
  updateVideoStatus: async (id: number, status: string) => {
    const response = await apiRequest("PATCH", API.VIDEO_STATUS(id), { status });
    return response.json();
  }
};

/**
 * Template related API functions
 */
export const templatesApi = {
  /**
   * Get all templates
   */
  getTemplates: async () => {
    const response = await apiRequest("GET", API.TEMPLATES);
    return response.json();
  }
};

/**
 * Stats related API functions
 */
export const statsApi = {
  /**
   * Get overall stats
   */
  getStats: async () => {
    const response = await apiRequest("GET", API.STATS);
    return response.json();
  }
};

/**
 * User related API functions
 */
export const userApi = {
  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await apiRequest("GET", API.USER);
    return response.json();
  }
};
