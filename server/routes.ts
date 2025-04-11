import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTopicSchema, insertVideoSchema } from "@shared/schema";
import { z } from "zod";
import { analyzeTopicTrends } from "./trendAnalyzer";
import { generateVideo } from "./videoGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";

  // Get trending topics
  app.get(`${apiPrefix}/topics/trending`, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const trendingTopics = await storage.getTrendingTopics(limit);
      res.json(trendingTopics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending topics" });
    }
  });

  // Get all topics
  app.get(`${apiPrefix}/topics`, async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  // Get topic by ID
  app.get(`${apiPrefix}/topics/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getTopic(id);
      
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  });

  // Create new topic
  app.post(`${apiPrefix}/topics`, async (req, res) => {
    try {
      const topicData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(topicData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create topic" });
    }
  });

  // Analyze topic for trends
  app.get(`${apiPrefix}/topics/:id/analyze`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const topic = await storage.getTopic(id);
      
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      
      const analysis = await analyzeTopicTrends(topic);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze topic trends" });
    }
  });

  // Get all videos
  app.get(`${apiPrefix}/videos`, async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get videos for a user
  app.get(`${apiPrefix}/videos/user/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const videos = await storage.getUserVideos(userId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user videos" });
    }
  });

  // Get video by ID
  app.get(`${apiPrefix}/videos/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Create new video
  app.post(`${apiPrefix}/videos`, async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      
      // Check if topic exists
      const topic = await storage.getTopic(videoData.topicId);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(videoData.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create video" });
    }
  });

  // Update video status
  app.patch(`${apiPrefix}/videos/:id/status`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['draft', 'processing', 'published', 'failed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const updatedVideo = await storage.updateVideoStatus(id, status);
      
      if (!updatedVideo) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update video status" });
    }
  });

  // Generate video content based on topic and template
  app.post(`${apiPrefix}/videos/generate`, async (req, res) => {
    try {
      const { topicId, templateId, title, description, userId } = req.body;
      
      if (!topicId || !templateId || !title || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Check if topic exists
      const topic = await storage.getTopic(parseInt(topicId));
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      
      // Check if template exists
      const template = await storage.getTemplate(parseInt(templateId));
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Create a new video in draft status
      const newVideo = await storage.createVideo({
        userId: parseInt(userId),
        topicId: parseInt(topicId),
        title,
        description: description || "",
        status: "processing",
        duration: 0,
        thumbnailUrl: "",
        videoUrl: ""
      });
      
      // Generate the video (this will be simulated in the backend)
      const generatedVideo = await generateVideo(newVideo, topic, template);
      
      // Update the video with generated content
      const updatedVideo = await storage.updateVideoStatus(generatedVideo.id, "published");
      await storage.updateVideoStats(generatedVideo.id, { views: 0, likes: 0, comments: 0, shares: 0 });
      
      res.status(201).json(updatedVideo);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate video" });
    }
  });

  // Get templates
  app.get(`${apiPrefix}/templates`, async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get user info
  app.get(`${apiPrefix}/me`, async (req, res) => {
    try {
      // In a real app, this would come from the session
      // For this demo, we'll return the first user
      const users = Array.from((await storage.getUsers()).values());
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
      
      // Return the first user without the password
      const { password, ...userWithoutPassword } = users[0];
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user information" });
    }
  });

  // Get stats
  app.get(`${apiPrefix}/stats`, async (req, res) => {
    try {
      const videos = await storage.getVideos();
      
      // Calculate stats
      const videosCreated = videos.length;
      const totalViews = videos.reduce((sum, video) => sum + (video.stats?.views || 0), 0);
      
      // Calculate engagement rate (likes + comments + shares / views)
      let totalEngagements = 0;
      let totalVideoViews = 0;
      
      videos.forEach(video => {
        if (video.stats) {
          totalEngagements += (video.stats.likes || 0) + (video.stats.comments || 0) + (video.stats.shares || 0);
          totalVideoViews += video.stats.views || 0;
        }
      });
      
      const engagementRate = totalVideoViews > 0 
        ? ((totalEngagements / totalVideoViews) * 100).toFixed(1) + '%'
        : '0%';
      
      // Calculate total subscribers gained (mock data for this demo)
      const subscribersGained = Math.floor(totalViews * 0.014); // 1.4% conversion rate
      
      res.json({
        videosCreated,
        totalViews: totalViews.toLocaleString(),
        engagementRate,
        subscribersGained: '+' + subscribersGained.toLocaleString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate stats" });
    }
  });

  // Fix TypeScript error for storage.getUsers
  storage.getUsers = async function() {
    return this.users;
  };

  const httpServer = createServer(app);
  return httpServer;
}
