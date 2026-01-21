import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Save, X } from "lucide-react";

interface Question {
  id: number;
  question: string;
  lessonId: number;
  lessonTitle: string;
}

interface PracticeTestBuilderProps {
  courseId: number;
  onSave?: (testConfig: PracticeTestConfig) => void;
}

interface PracticeTestConfig {
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number;
  passingScore: number;
  selectedQuestions: number[];
}

export function PracticeTestBuilder({ courseId, onSave }: PracticeTestBuilderProps) {
  const [testConfig, setTestConfig] = useState<PracticeTestConfig>({
    title: "",
    description: "",
    totalQuestions: 0,
    timeLimit: 60,
    passingScore: 70,
    selectedQuestions: [],
  });

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock available questions - in real app, fetch from API
  const mockQuestions: Question[] = [
    { id: 1, question: "What is the capital of France?", lessonId: 1, lessonTitle: "European Geography" },
    { id: 2, question: "What is 2 + 2?", lessonId: 2, lessonTitle: "Basic Math" },
    { id: 3, question: "Who wrote Romeo and Juliet?", lessonId: 3, lessonTitle: "Literature" },
  ];

  const filteredQuestions = mockQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuestionToggle = (questionId: number) => {
    setTestConfig((prev) => {
      const isSelected = prev.selectedQuestions.includes(questionId);
      return {
        ...prev,
        selectedQuestions: isSelected
          ? prev.selectedQuestions.filter((id) => id !== questionId)
          : [...prev.selectedQuestions, questionId],
        totalQuestions: isSelected
          ? prev.totalQuestions - 1
          : prev.totalQuestions + 1,
      };
    });
  };

  const handleSave = () => {
    if (!testConfig.title || testConfig.selectedQuestions.length === 0) {
      alert("Please enter a title and select at least one question");
      return;
    }

    if (onSave) {
      onSave(testConfig);
    }

    // Reset form
    setTestConfig({
      title: "",
      description: "",
      totalQuestions: 0,
      timeLimit: 60,
      passingScore: 70,
      selectedQuestions: [],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Practice Test</CardTitle>
          <CardDescription>Configure a new practice test for students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Test Title</Label>
              <Input
                id="title"
                placeholder="e.g., GED Math Full Practice Test"
                value={testConfig.title}
                onChange={(e) =>
                  setTestConfig((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this practice test covers"
                value={testConfig.description}
                onChange={(e) =>
                  setTestConfig((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  value={testConfig.timeLimit}
                  onChange={(e) =>
                    setTestConfig((prev) => ({
                      ...prev,
                      timeLimit: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={testConfig.passingScore}
                  onChange={(e) =>
                    setTestConfig((prev) => ({
                      ...prev,
                      passingScore: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Selected Questions Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900">
              {testConfig.totalQuestions} questions selected
            </p>
            <p className="text-sm text-blue-700">
              {testConfig.timeLimit} minutes | {testConfig.passingScore}% passing score
            </p>
          </div>

          {/* Question Selector */}
          <Dialog open={showQuestionSelector} onOpenChange={setShowQuestionSelector}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Select Questions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Select Questions for Practice Test</DialogTitle>
                <DialogDescription>
                  Choose questions from available lessons
                </DialogDescription>
              </DialogHeader>

              <Input
                placeholder="Search questions or lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />

              <div className="space-y-3">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`question-${question.id}`}
                      checked={testConfig.selectedQuestions.includes(question.id)}
                      onCheckedChange={() => handleQuestionToggle(question.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`question-${question.id}`}
                        className="cursor-pointer block"
                      >
                        <p className="font-medium text-sm">{question.question}</p>
                        <p className="text-xs text-gray-500">
                          From: {question.lessonTitle}
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setShowQuestionSelector(false)}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Selected Questions List */}
          {testConfig.selectedQuestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Selected Questions</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mockQuestions
                  .filter((q) => testConfig.selectedQuestions.includes(q.id))
                  .map((question) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{question.question}</p>
                        <p className="text-xs text-gray-500">{question.lessonTitle}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleQuestionToggle(question.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Create Practice Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
