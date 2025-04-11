import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { API, ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";
import type { CreateVideoParams } from "@/types";

export function useVideoCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  /**
   * Create a new video using the API
   */
  const createVideo = async (params: CreateVideoParams) => {
    if (!params.title || !params.topicId || !params.templateId || !params.userId) {
      throw new Error("Missing required fields");
    }

    setIsCreating(true);
    
    try {
      const response = await apiRequest("POST", API.GENERATE_VIDEO, {
        topicId: params.topicId,
        templateId: params.templateId,
        title: params.title,
        description: params.description || "",
        userId: params.userId
      });

      // Handle API errors
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || ERROR_MESSAGES.CREATE_VIDEO);
      }

      const result = await response.json();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [API.VIDEOS] });
      
      // Return the created video
      return result;
    } catch (error) {
      toast({
        title: "Error creating video",
        description: error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_VIDEO,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createVideo,
    isCreating
  };
}
