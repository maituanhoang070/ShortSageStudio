// API endpoints
export const API = {
  TOPICS: '/api/topics',
  TRENDING_TOPICS: '/api/topics/trending',
  TOPIC_ANALYZE: (id: number) => `/api/topics/${id}/analyze`,
  VIDEOS: '/api/videos',
  VIDEO: (id: number) => `/api/videos/${id}`,
  USER_VIDEOS: (userId: number) => `/api/videos/user/${userId}`,
  GENERATE_VIDEO: '/api/videos/generate',
  VIDEO_STATUS: (id: number) => `/api/videos/${id}/status`,
  TEMPLATES: '/api/templates',
  STATS: '/api/stats',
  USER: '/api/me',
};

// Video statuses
export const VIDEO_STATUS = {
  DRAFT: 'draft',
  PROCESSING: 'processing',
  PUBLISHED: 'published',
  FAILED: 'failed',
};

// Template types
export const TEMPLATE_TYPES = {
  MINIMAL: 'minimal',
  VIBRANT: 'vibrant',
  PROFESSIONAL: 'professional',
};

// Voice types
export const VOICE_TYPES = {
  FEMALE_1: 'female1',
  FEMALE_2: 'female2',
  MALE_1: 'male1',
  MALE_2: 'male2',
  ROBOTIC: 'robotic',
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_TOPICS: 'Failed to fetch topics',
  FETCH_VIDEOS: 'Failed to fetch videos',
  CREATE_VIDEO: 'Failed to create video',
  ANALYZE_TOPIC: 'Failed to analyze topic',
  GENERAL: 'Something went wrong',
};

// Success messages
export const SUCCESS_MESSAGES = {
  VIDEO_CREATED: 'Video created successfully',
  VIDEO_UPDATED: 'Video updated successfully',
};

// Demo data
export const DEMO_USER_ID = 1;
