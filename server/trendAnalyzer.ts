import { Topic } from "@shared/schema";

interface TrendAnalysis {
  topic: string;
  score: number;
  direction: string;
  recommendedAngles: string[];
  avoidedAngles: string[];
  relatedTags: string[];
  sampleTitles: string[];
}

/**
 * Analyzes trends for a given topic
 * In a real implementation, this would use external APIs and data sources
 */
export async function analyzeTopicTrends(topic: Topic): Promise<TrendAnalysis> {
  // Simulate analysis time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create topic-specific trend analysis
  const analysis = getTrendAnalysisForTopic(topic);
  
  return analysis;
}

/**
 * Returns pre-defined trend analysis for known topics
 * In a real implementation, this would come from APIs and real-time data
 */
function getTrendAnalysisForTopic(topic: Topic): TrendAnalysis {
  // Default analysis structure
  const defaultAnalysis: TrendAnalysis = {
    topic: topic.name,
    score: topic.trendScore || 0,
    direction: topic.trendDirection || 'stable',
    recommendedAngles: [],
    avoidedAngles: [],
    relatedTags: [],
    sampleTitles: []
  };
  
  // Topic-specific analyses
  const topicAnalyses: Record<string, Partial<TrendAnalysis>> = {
    "Morning Routines": {
      recommendedAngles: [
        "Quick 5-minute routines that don't require any equipment",
        "Science-backed techniques for boosting energy",
        "Celebrity morning routines that are actually practical"
      ],
      avoidedAngles: [
        "Long, complex morning routines",
        "Routines requiring expensive equipment",
        "Overly restrictive diet-focused routines"
      ],
      relatedTags: ["Productivity", "Health", "Wellness", "Self-improvement"],
      sampleTitles: [
        "5-Minute Morning Routine That Changed My Life",
        "3 Science-Backed Morning Habits for Instant Energy",
        "The Only Morning Stretch You Need for All-Day Energy"
      ]
    },
    "Budget Cooking": {
      recommendedAngles: [
        "One-pot meals under $5",
        "Meal prep hacks that save time and money",
        "Pantry staples transformed into gourmet dishes"
      ],
      avoidedAngles: [
        "Recipes with exotic or expensive ingredients",
        "Complex techniques requiring special equipment",
        "Time-consuming preparations"
      ],
      relatedTags: ["Recipes", "Food", "Budget", "Meal Prep"],
      sampleTitles: [
        "3-Ingredient Dinner That Tastes Expensive",
        "How I Cook for the Week with Just $20",
        "Turn This $1 Ingredient Into 3 Amazing Meals"
      ]
    },
    "AI Tools": {
      recommendedAngles: [
        "Free AI tools anyone can use",
        "Simple AI hacks to automate daily tasks",
        "How to use AI for creative work without coding"
      ],
      avoidedAngles: [
        "Technical deep-dives into AI architecture",
        "Tools requiring programming knowledge",
        "Expensive enterprise AI solutions"
      ],
      relatedTags: ["Technology", "Productivity", "Digital Tools", "Automation"],
      sampleTitles: [
        "This Free AI Tool Will Write Your Emails For You",
        "3 AI Apps That Save Me 2 Hours Every Day",
        "How to Generate Perfect Images in 10 Seconds with AI"
      ]
    },
    "Fashion Hacks": {
      recommendedAngles: [
        "Transform basic pieces into trending outfits",
        "Quick styling tricks using items you already own",
        "Budget-friendly ways to update your wardrobe"
      ],
      avoidedAngles: [
        "Expensive designer pieces",
        "Complicated DIY projects",
        "Season-specific trends"
      ],
      relatedTags: ["Style", "Fashion", "Clothing", "Budget Fashion"],
      sampleTitles: [
        "1 Basic T-shirt, 5 Amazing Outfits",
        "The 10-Second Trick to Make Any Outfit Look Expensive",
        "3 Ways to Style That Shirt Everyone Has"
      ]
    },
    "Apartment Decor": {
      recommendedAngles: [
        "No-drill rental-friendly decoration ideas",
        "Transform your space under $50",
        "Small space solutions that maximize functionality"
      ],
      avoidedAngles: [
        "Major renovation projects",
        "Expensive designer furniture",
        "Permanent modifications"
      ],
      relatedTags: ["Home", "Interior Design", "DIY", "Small Spaces"],
      sampleTitles: [
        "Tiny Apartment Hack That Doubles Your Space",
        "3 No-Drill Ways to Upgrade Your Rental",
        "Make a $10 IKEA Item Look Like Designer Furniture"
      ]
    }
  };
  
  // Merge default with topic-specific analysis
  return { 
    ...defaultAnalysis,
    ...(topicAnalyses[topic.name] || {})
  };
}
