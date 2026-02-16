import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

interface LessonGeneratorProps {
  onSuccess?: (lessonId: number) => void;
  onClose?: () => void;
}

export default function LessonGenerator({ onSuccess, onClose }: LessonGeneratorProps) {
  const [step, setStep] = useState<"form" | "generating" | "preview">("form");
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    ageGroup: "",
    tone: "",
    description: "",
  });
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    pedagogicalBases: string[];
    mediaLinks: string[];
  } | null>(null);

  const createLessonMutation = trpc.lesson.create.useMutation({
    onSuccess: (data) => {
      toast.success("Lesson created successfully!");
      setStep("preview");
      if (onSuccess) {
        onSuccess(data.id);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create lesson");
      setStep("form");
    },
  });

  const generateLessonMutation = trpc.ai.generateLesson.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data);
      setStep("preview");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate lesson");
      setStep("form");
    },
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateLesson = async () => {
    // Validate form
    if (!formData.title || !formData.subject || !formData.ageGroup || !formData.tone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setStep("generating");
    await generateLessonMutation.mutateAsync({
      title: formData.title,
      subject: formData.subject,
      ageGroup: formData.ageGroup,
      tone: formData.tone,
      description: formData.description,
    });
  };

  const handlePublishLesson = async () => {
    if (!generatedContent) return;

    await createLessonMutation.mutateAsync({
      title: generatedContent.title || formData.title,
      subject: formData.subject,
      ageGroup: formData.ageGroup,
      tone: formData.tone,
      description: formData.description,
      content: generatedContent.content,
      pedagogicalBases: generatedContent.pedagogicalBases,
      mediaLinks: generatedContent.mediaLinks,
    });
  };

  const handleReset = () => {
    setStep("form");
    setFormData({
      title: "",
      subject: "",
      ageGroup: "",
      tone: "",
      description: "",
    });
    setGeneratedContent(null);
  };

  // Form Step
  if (step === "form") {
    return (
      <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">✨</span> Lesson Generator
          </CardTitle>
          <CardDescription>
            Create AI-powered lessons tailored to your students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Lesson Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Introduction to Photosynthesis"
              value={formData.title}
              onChange={handleFormChange}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">
              Subject *
            </Label>
            <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Geography">Geography</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Physical Education">Physical Education</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Group */}
          <div className="space-y-2">
            <Label htmlFor="ageGroup" className="text-white">
              Age Group *
            </Label>
            <Select value={formData.ageGroup} onValueChange={(value) => handleSelectChange("ageGroup", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="5-7">5-7 years</SelectItem>
                <SelectItem value="8-10">8-10 years</SelectItem>
                <SelectItem value="11-13">11-13 years</SelectItem>
                <SelectItem value="14-16">14-16 years</SelectItem>
                <SelectItem value="17-19">17-19 years</SelectItem>
                <SelectItem value="Adult">Adult</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label htmlFor="tone" className="text-white">
              Teaching Tone *
            </Label>
            <Select value={formData.tone} onValueChange={(value) => handleSelectChange("tone", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="formal">Formal & Academic</SelectItem>
                <SelectItem value="friendly">Friendly & Engaging</SelectItem>
                <SelectItem value="humorous">Humorous & Fun</SelectItem>
                <SelectItem value="storytelling">Storytelling & Narrative</SelectItem>
                <SelectItem value="interactive">Interactive & Hands-on</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Additional Context (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add any specific learning objectives, topics to cover, or special requirements..."
              value={formData.description}
              onChange={handleFormChange}
              rows={4}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleGenerateLesson}
              disabled={generateLessonMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
            >
              {generateLessonMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Lesson"
              )}
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generating Step
  if (step === "generating") {
    return (
      <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-cyan-500 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Generating Your Lesson</h3>
          <p className="text-gray-400 text-center">
            Our AI is creating a personalized lesson for {formData.title}...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Preview Step
  if (step === "preview" && generatedContent) {
    return (
      <Card className="bg-gray-900 border-gray-800 w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Lesson Preview
              </CardTitle>
              <CardDescription>Review and publish your AI-generated lesson</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lesson Details */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Title</p>
              <p className="font-semibold text-white">{generatedContent.title || formData.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Subject</p>
              <p className="font-semibold text-white">{formData.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Age Group</p>
              <p className="font-semibold text-white">{formData.ageGroup}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Tone</p>
              <p className="font-semibold text-white capitalize">{formData.tone}</p>
            </div>
          </div>

          {/* Generated Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Lesson Content</h3>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
              <Streamdown>{generatedContent.content}</Streamdown>
            </div>
          </div>

          {/* Pedagogical Bases */}
          {generatedContent.pedagogicalBases && generatedContent.pedagogicalBases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Pedagogical Approaches</h3>
              <div className="flex flex-wrap gap-2">
                {generatedContent.pedagogicalBases.map((base, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-900/50 border border-purple-700 rounded-full text-sm text-purple-200"
                  >
                    {base}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Links */}
          {generatedContent.mediaLinks && generatedContent.mediaLinks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Recommended Resources</h3>
              <div className="space-y-2">
                {generatedContent.mediaLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors text-cyan-400 text-sm truncate"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={handlePublishLesson}
              disabled={createLessonMutation.isPending}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
            >
              {createLessonMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Lesson"
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Create Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
