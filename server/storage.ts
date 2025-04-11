import { 
  users, type User, type InsertUser,
  topics, type Topic, type InsertTopic,
  videos, type Video, type InsertVideo,
  templates, type Template, type InsertTemplate,
  VideoStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Topic operations
  getTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  getTopicByName(name: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopicTrendScore(id: number, score: number, direction: string): Promise<Topic | undefined>;
  getTrendingTopics(limit?: number): Promise<Topic[]>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getUserVideos(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStatus(id: number, status: string): Promise<Video | undefined>;
  updateVideoStats(id: number, stats: Partial<VideoStats>): Promise<Video | undefined>;
  
  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private videos: Map<number, Video>;
  private templates: Map<number, Template>;
  private userIdCounter: number;
  private topicIdCounter: number;
  private videoIdCounter: number;
  private templateIdCounter: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.videos = new Map();
    this.templates = new Map();
    this.userIdCounter = 1;
    this.topicIdCounter = 1;
    this.videoIdCounter = 1;
    this.templateIdCounter = 1;
    
    // Initialize with sample topics
    this.initializeTopics();
    // Initialize with sample templates
    this.initializeTemplates();
    // Initialize with demo user
    this.initializeDemoUser();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Topic operations
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopicByName(name: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(
      (topic) => topic.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.topicIdCounter++;
    const now = new Date();
    const topic: Topic = { ...insertTopic, id, createdAt: now };
    this.topics.set(id, topic);
    return topic;
  }

  async updateTopicTrendScore(id: number, score: number, direction: string): Promise<Topic | undefined> {
    const topic = this.topics.get(id);
    if (!topic) return undefined;
    
    const updatedTopic = { 
      ...topic, 
      trendScore: score, 
      trendDirection: direction 
    };
    
    this.topics.set(id, updatedTopic);
    return updatedTopic;
  }

  async getTrendingTopics(limit = 5): Promise<Topic[]> {
    return Array.from(this.topics.values())
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getUserVideos(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId
    );
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.videoIdCounter++;
    const now = new Date();
    const video: Video = { 
      ...insertVideo, 
      id, 
      createdAt: now,
      stats: { views: 0, likes: 0, comments: 0, shares: 0 }
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideoStatus(id: number, status: string): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, status };
    if (status === 'published') {
      updatedVideo.publishedAt = new Date();
    }
    
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async updateVideoStats(id: number, stats: Partial<VideoStats>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { 
      ...video, 
      stats: { ...video.stats, ...stats }
    };
    
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateIdCounter++;
    const now = new Date();
    const template: Template = { ...insertTemplate, id, createdAt: now };
    this.templates.set(id, template);
    return template;
  }

  // Initialize with sample data
  private initializeTopics() {
    const sampleTopics: InsertTopic[] = [
      {
        name: "Morning Routines",
        description: "Quick, energizing morning routines for productivity.",
        trendScore: 85,
        trendDirection: "up",
        tags: ["Health", "Productivity"]
      },
      {
        name: "Budget Cooking",
        description: "Affordable recipes that are quick and easy to make.",
        trendScore: 92,
        trendDirection: "up",
        tags: ["Cooking", "Budget"]
      },
      {
        name: "AI Tools",
        description: "Free AI tools that can boost productivity and creativity.",
        trendScore: 95,
        trendDirection: "up",
        tags: ["Technology", "Productivity"]
      },
      {
        name: "Fashion Hacks",
        description: "Simple fashion tips to elevate everyday outfits.",
        trendScore: 72,
        trendDirection: "down",
        tags: ["Fashion", "Style"]
      },
      {
        name: "Apartment Decor",
        description: "Budget-friendly ways to transform small living spaces.",
        trendScore: 81,
        trendDirection: "up",
        tags: ["Home", "Interior Design"]
      }
    ];

    sampleTopics.forEach(topic => {
      this.createTopic(topic);
    });
  }

  private initializeTemplates() {
    const sampleTemplates: InsertTemplate[] = [
      {
        name: "Minimal",
        description: "Clean, simple design with focus on content",
        settings: {
          font: "Roboto",
          colors: ["#ffffff", "#000000", "#f5f5f5"],
          transitions: ["fade", "slide"],
          effects: ["none"],
          audio: "ambient"
        }
      },
      {
        name: "Vibrant",
        description: "Colorful and energetic style",
        settings: {
          font: "Montserrat",
          colors: ["#FF5722", "#FFC107", "#2196F3"],
          transitions: ["zoom", "bounce"],
          effects: ["pulse", "glow"],
          audio: "upbeat"
        }
      },
      {
        name: "Professional",
        description: "Corporate and sleek presentation",
        settings: {
          font: "Open Sans",
          colors: ["#263238", "#455A64", "#607D8B"],
          transitions: ["slide", "fade"],
          effects: ["shadow", "blur"],
          audio: "corporate"
        }
      }
    ];

    sampleTemplates.forEach(template => {
      this.createTemplate(template);
    });
  }

  private initializeDemoUser() {
    const demoUser: InsertUser = {
      username: "demo_user",
      password: "password123",
      email: "demo@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      planType: "free"
    };

    this.createUser(demoUser).then(user => {
      // Add some videos for the user
      const sampleVideos: InsertVideo[] = [
        {
          userId: user.id,
          title: "5 Quick Productivity Hacks for Busy People",
          description: "Learn these 5 simple productivity hacks that you can implement right away.",
          thumbnailUrl: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
          videoUrl: "",
          topicId: 1,
          duration: 56,
          status: "published",
          stats: { views: 4200, likes: 126, comments: 18, shares: 42 }
        },
        {
          userId: user.id,
          title: "Top 3 Tech Gadgets of 2023 You Need to See",
          description: "These innovative gadgets will transform your daily life and productivity.",
          thumbnailUrl: "https://images.unsplash.com/photo-1603366445787-09714680cbf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
          videoUrl: "",
          topicId: 3,
          duration: 82,
          status: "published",
          stats: { views: 10800, likes: 342, comments: 56, shares: 105 }
        },
        {
          userId: user.id,
          title: "Easy 3-Minute Morning Routine for Energy",
          description: "Start your day with this simple yet effective routine for all-day energy.",
          thumbnailUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
          videoUrl: "",
          topicId: 1,
          duration: 48,
          status: "published",
          stats: { views: 7500, likes: 254, comments: 32, shares: 87 }
        }
      ];

      sampleVideos.forEach(video => {
        this.createVideo({
          ...video,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      });
    });
  }
}

export const storage = new MemStorage();
