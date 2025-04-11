import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useVideoCreation } from "@/hooks/useVideoCreation";
import { Topic } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicsData?: Topic[];
  initialTopic?: Topic | null;
}

export default function CreateVideoModal({ 
  isOpen, 
  onClose, 
  topicsData = [],
  initialTopic = null
}: CreateVideoModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [topicAnalysis, setTopicAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { createVideo, isCreating } = useVideoCreation();
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    topicId: initialTopic?.id?.toString() || "",
    description: "",
    style: "1", // Template ID
    voiceType: "female1",
    addWatermark: true
  });

  // Reset form when modal closes
  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      title: "",
      topicId: initialTopic?.id?.toString() || "",
      description: "",
      style: "1",
      voiceType: "female1",
      addWatermark: true
    });
    setTopicAnalysis(null);
    onClose();
  };

  const handleTopicChange = async (topicId: string) => {
    setFormData({ ...formData, topicId });
    
    // If a topic is selected, analyze it
    if (topicId) {
      try {
        setIsAnalyzing(true);
        const response = await apiRequest("GET", `/api/topics/${topicId}/analyze`);
        const analysis = await response.json();
        setTopicAnalysis(analysis);
      } catch (error) {
        console.error("Error analyzing topic:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the selected topic.",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.topicId) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await createVideo({
        title: formData.title,
        topicId: parseInt(formData.topicId),
        description: formData.description,
        templateId: parseInt(formData.style),
        userId: 1, // Demo user ID
      });

      toast({
        title: "Video Created Successfully",
        description: "Your video is now being processed.",
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Error Creating Video",
        description: "There was a problem creating your video.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Selected topic
  const selectedTopic = topicsData.find(topic => topic.id.toString() === formData.topicId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900">Create New Video</DialogTitle>
        </DialogHeader>

        <div className="p-2">
          {/* Step Indicator */}
          <div className="mb-8">
            <ol className="flex items-center w-full">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className={`flex items-center ${currentStep >= step ? 'text-secondary font-medium' : 'text-neutral-400'}`}>
                  <span 
                    className={`flex items-center justify-center w-8 h-8 border-2 rounded-full ${
                      currentStep >= step 
                        ? 'border-secondary bg-secondary text-white' 
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {step}
                  </span>
                  <span className="ml-2 text-sm">{
                    step === 1 ? "Topic" : 
                    step === 2 ? "Content" : 
                    step === 3 ? "Style" : "Review"
                  }</span>
                  {step < 4 && <div className={`w-full h-1 ${currentStep >= step ? 'bg-secondary' : 'bg-neutral-300'} mx-2`}></div>}
                </li>
              ))}
            </ol>
          </div>

          {/* Step 1: Topic Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="videoTitle" className="mb-1">Video Title</Label>
                <Input 
                  id="videoTitle" 
                  name="title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2" 
                  placeholder="Enter a catchy title for your video"
                />
              </div>

              <div>
                <Label htmlFor="videoTopic" className="mb-1">Video Topic</Label>
                <Select 
                  value={formData.topicId} 
                  onValueChange={(value) => handleTopicChange(value)}
                >
                  <SelectTrigger id="videoTopic" className="w-full">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topicsData.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id.toString()}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <span className="block text-sm font-medium text-neutral-700 mb-2">Trending Topics (Recommended)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {topicsData
                    .filter(topic => topic.trendScore > 80)
                    .sort((a, b) => b.trendScore - a.trendScore)
                    .slice(0, 4)
                    .map((topic) => (
                      <div 
                        key={topic.id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          formData.topicId === topic.id.toString() 
                            ? 'border-secondary bg-blue-50' 
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                        onClick={() => handleTopicChange(topic.id.toString())}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className={`font-medium ${formData.topicId === topic.id.toString() ? 'text-secondary' : 'text-neutral-900'}`}>
                            {topic.name}
                          </h4>
                          <Badge 
                            className={topic.trendDirection === 'up' ? 'bg-success text-white' : 'bg-error text-white'}
                          >
                            {topic.trendDirection === 'up' ? '+' : '-'}{topic.trendScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{topic.description}</p>
                      </div>
                    ))}
                </div>
              </div>

              {selectedTopic && topicAnalysis && (
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <h3 className="font-medium text-neutral-900 mb-2">Trend Analysis</h3>
                  <p className="text-sm text-neutral-700 mb-3">Based on your selected topic, here are the trending angles:</p>
                  <ul className="space-y-2 text-sm">
                    {topicAnalysis.recommendedAngles?.map((angle: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <svg className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        </svg>
                        <span>{angle}</span>
                      </li>
                    ))}
                    {topicAnalysis.avoidedAngles?.map((angle: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <svg className="h-5 w-5 text-error mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                        <span>{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="videoDescription" className="mb-1">Video Description</Label>
                <Textarea 
                  id="videoDescription" 
                  name="description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full" 
                  placeholder="Describe what your video will be about"
                  rows={4}
                />
              </div>

              {topicAnalysis && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Recommended Title Ideas</h3>
                    <div className="space-y-2">
                      {topicAnalysis.sampleTitles?.map((title: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="p-2 border border-neutral-300 rounded-md cursor-pointer hover:bg-blue-50 hover:border-secondary"
                          onClick={() => setFormData({ ...formData, title: title })}
                        >
                          {title}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Content Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {topicAnalysis.recommendedAngles?.map((angle: string, idx: number) => (
                        <li key={idx} className="text-sm">{angle}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Content Generation Tips
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Keep videos short (30-60 seconds) for maximum engagement</li>
                  <li>• Start with a hook in the first 3 seconds</li>
                  <li>• Use simple language and short sentences</li>
                  <li>• End with a call to action</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="videoStyle" className="mb-1">Video Template</Label>
                <Select 
                  value={formData.style} 
                  onValueChange={(value) => handleSelectChange('style', value)}
                >
                  <SelectTrigger id="videoStyle" className="w-full">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Minimal</SelectItem>
                    <SelectItem value="2">Vibrant</SelectItem>
                    <SelectItem value="3">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="voiceType" className="mb-1">Voice Type</Label>
                <Select 
                  value={formData.voiceType} 
                  onValueChange={(value) => handleSelectChange('voiceType', value)}
                >
                  <SelectTrigger id="voiceType" className="w-full">
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female1">Female Voice 1</SelectItem>
                    <SelectItem value="female2">Female Voice 2</SelectItem>
                    <SelectItem value="male1">Male Voice 1</SelectItem>
                    <SelectItem value="male2">Male Voice 2</SelectItem>
                    <SelectItem value="robotic">Robotic Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                <div className={`border rounded-lg p-4 cursor-pointer ${formData.style === "1" ? 'border-secondary bg-blue-50' : 'border-neutral-300'}`} onClick={() => handleSelectChange('style', "1")}>
                  <div className="w-full h-32 bg-neutral-200 rounded-md mb-3 flex items-center justify-center">
                    <span className="text-neutral-500">Minimal Preview</span>
                  </div>
                  <h3 className="font-medium">Minimal</h3>
                  <p className="text-sm text-neutral-600">Clean, simple design with focus on content</p>
                </div>
                
                <div className={`border rounded-lg p-4 cursor-pointer ${formData.style === "2" ? 'border-secondary bg-blue-50' : 'border-neutral-300'}`} onClick={() => handleSelectChange('style', "2")}>
                  <div className="w-full h-32 bg-neutral-200 rounded-md mb-3 flex items-center justify-center">
                    <span className="text-neutral-500">Vibrant Preview</span>
                  </div>
                  <h3 className="font-medium">Vibrant</h3>
                  <p className="text-sm text-neutral-600">Colorful and energetic style</p>
                </div>
                
                <div className={`border rounded-lg p-4 cursor-pointer ${formData.style === "3" ? 'border-secondary bg-blue-50' : 'border-neutral-300'}`} onClick={() => handleSelectChange('style', "3")}>
                  <div className="w-full h-32 bg-neutral-200 rounded-md mb-3 flex items-center justify-center">
                    <span className="text-neutral-500">Professional Preview</span>
                  </div>
                  <h3 className="font-medium">Professional</h3>
                  <p className="text-sm text-neutral-600">Corporate and sleek presentation</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Review Your Video</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-600">Title</h4>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-600">Topic</h4>
                    <p className="font-medium">{selectedTopic?.name}</p>
                  </div>
                  
                  {formData.description && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-600">Description</h4>
                      <p>{formData.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-600">Style</h4>
                    <p className="font-medium">
                      {formData.style === "1" ? "Minimal" : 
                       formData.style === "2" ? "Vibrant" : 
                       "Professional"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-600">Voice Type</h4>
                    <p className="font-medium">
                      {formData.voiceType === "female1" ? "Female Voice 1" :
                       formData.voiceType === "female2" ? "Female Voice 2" :
                       formData.voiceType === "male1" ? "Male Voice 1" :
                       formData.voiceType === "male2" ? "Male Voice 2" :
                       "Robotic Voice"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Important Information
                </h3>
                <p className="text-sm text-yellow-700">
                  By clicking "Create Video" you agree to our terms of service. The video will be processed in the background and will be available in your videos section when complete.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-5 border-t border-neutral-200 flex justify-between">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
              </Button>
            )}
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="ml-auto">
                Continue
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isCreating} className="ml-auto">
                {isCreating ? "Creating..." : "Create Video"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
