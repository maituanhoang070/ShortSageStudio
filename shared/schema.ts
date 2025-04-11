import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  planType: text("plan_type").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Topic categories for videos
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  trendScore: integer("trend_score").default(0),
  trendDirection: text("trend_direction"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Video details
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  topicId: integer("topic_id").notNull(),
  duration: integer("duration"),
  status: text("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  stats: json("stats").$type<VideoStats>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Templates for video creation
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  settings: json("settings").$type<TemplateSettings>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types for JSON columns
export type VideoStats = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

export type TemplateSettings = {
  font: string;
  colors: string[];
  transitions: string[];
  effects: string[];
  audio: string;
};

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

// Create select types
export type User = typeof users.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Template = typeof templates.$inferSelect;

// Create insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
