import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, Calculator, BookOpen, Zap } from "lucide-react";
import { BridgeAcademyNav } from "@/components/BridgeAcademyNav";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: "guide" | "practice" | "formula" | "reference";
  difficulty: "easy" | "medium" | "hard";
  fileSize: string;
  downloadUrl: string;
}

const studyMaterials: Record<string, StudyMaterial[]> = {
  math: [
    {
      id: "math-1",
      title: "Algebra Fundamentals Study Guide",
      description: "Complete guide to algebraic expressions, equations, and functions",
      type: "guide",
      difficulty: "easy",
      fileSize: "2.4 MB",
      downloadUrl: "#",
    },
    {
      id: "math-2",
      title: "Geometry Essentials",
      description: "Shapes, angles, area, volume, and coordinate geometry",
      type: "guide",
      difficulty: "medium",
      fileSize: "3.1 MB",
      downloadUrl: "#",
    },
    {
      id: "math-3",
      title: "Data Analysis & Statistics Practice",
      description: "50 practice problems on mean, median, mode, probability, and graphs",
      type: "practice",
      difficulty: "medium",
      fileSize: "1.8 MB",
      downloadUrl: "#",
    },
    {
      id: "math-4",
      title: "GED Math Formula Sheet",
      description: "All formulas and reference information provided on the GED exam",
      type: "formula",
      difficulty: "easy",
      fileSize: "0.5 MB",
      downloadUrl: "#",
    },
    {
      id: "math-5",
      title: "Advanced Functions & Quadratics",
      description: "In-depth study of quadratic equations, polynomials, and functions",
      type: "guide",
      difficulty: "hard",
      fileSize: "2.8 MB",
      downloadUrl: "#",
    },
  ],
  rla: [
    {
      id: "rla-1",
      title: "Reading Comprehension Strategies",
      description: "Techniques for understanding and analyzing written passages",
      type: "guide",
      difficulty: "easy",
      fileSize: "2.2 MB",
      downloadUrl: "#",
    },
    {
      id: "rla-2",
      title: "Grammar & Punctuation Rules",
      description: "Complete reference for grammar, punctuation, and sentence structure",
      type: "reference",
      difficulty: "medium",
      fileSize: "2.6 MB",
      downloadUrl: "#",
    },
    {
      id: "rla-3",
      title: "Writing Practice Prompts",
      description: "30 extended response writing prompts with sample answers",
      type: "practice",
      difficulty: "medium",
      fileSize: "1.9 MB",
      downloadUrl: "#",
    },
    {
      id: "rla-4",
      title: "Vocabulary Builder",
      description: "500 essential vocabulary words with definitions and usage examples",
      type: "guide",
      difficulty: "easy",
      fileSize: "1.5 MB",
      downloadUrl: "#",
    },
    {
      id: "rla-5",
      title: "Literary Analysis Guide",
      description: "How to analyze themes, characters, and literary devices",
      type: "guide",
      difficulty: "hard",
      fileSize: "2.3 MB",
      downloadUrl: "#",
    },
  ],
  science: [
    {
      id: "sci-1",
      title: "Life Science Fundamentals",
      description: "Biology, human body systems, genetics, and evolution",
      type: "guide",
      difficulty: "easy",
      fileSize: "3.2 MB",
      downloadUrl: "#",
    },
    {
      id: "sci-2",
      title: "Physical Science Essentials",
      description: "Physics, chemistry, energy, waves, and motion",
      type: "guide",
      difficulty: "medium",
      fileSize: "2.9 MB",
      downloadUrl: "#",
    },
    {
      id: "sci-3",
      title: "Earth & Space Science",
      description: "Geology, weather, atmosphere, planets, and space exploration",
      type: "guide",
      difficulty: "medium",
      fileSize: "2.7 MB",
      downloadUrl: "#",
    },
    {
      id: "sci-4",
      title: "Science Practice Problems",
      description: "60 practice questions covering all science topics",
      type: "practice",
      difficulty: "medium",
      fileSize: "2.1 MB",
      downloadUrl: "#",
    },
    {
      id: "sci-5",
      title: "Scientific Method & Experiments",
      description: "Understanding experimental design and data interpretation",
      type: "guide",
      difficulty: "hard",
      fileSize: "2.4 MB",
      downloadUrl: "#",
    },
  ],
  social: [
    {
      id: "ss-1",
      title: "U.S. History Overview",
      description: "From colonial times through modern era with key events and figures",
      type: "guide",
      difficulty: "easy",
      fileSize: "3.4 MB",
      downloadUrl: "#",
    },
    {
      id: "ss-2",
      title: "Government & Civics",
      description: "Constitution, branches of government, rights, and responsibilities",
      type: "guide",
      difficulty: "medium",
      fileSize: "2.8 MB",
      downloadUrl: "#",
    },
    {
      id: "ss-3",
      title: "Economics & Geography",
      description: "Supply and demand, world geography, and economic systems",
      type: "guide",
      difficulty: "medium",
      fileSize: "2.6 MB",
      downloadUrl: "#",
    },
    {
      id: "ss-4",
      title: "World History Summary",
      description: "Major civilizations, events, and cultural developments worldwide",
      type: "guide",
      difficulty: "medium",
      fileSize: "3.1 MB",
      downloadUrl: "#",
    },
    {
      id: "ss-5",
      title: "Social Studies Practice Test",
      description: "50 practice questions covering all social studies topics",
      type: "practice",
      difficulty: "medium",
      fileSize: "2.2 MB",
      downloadUrl: "#",
    },
  ],
};

const typeIcons: Record<string, React.ReactNode> = {
  guide: <BookOpen className="w-4 h-4" />,
  practice: <Zap className="w-4 h-4" />,
  formula: <Calculator className="w-4 h-4" />,
  reference: <FileText className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  guide: "Study Guide",
  practice: "Practice Problems",
  formula: "Formula Sheet",
  reference: "Reference",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
};

export default function BridgeAcademyStudyMaterials() {
  const [selectedSubject, setSelectedSubject] = useState<string>("math");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const materials = studyMaterials[selectedSubject] || [];
  const filteredMaterials =
    selectedDifficulty === "all"
      ? materials
      : materials.filter((m) => m.difficulty === selectedDifficulty);

  return (
    <div className="min-h-screen bg-background">
      <BridgeAcademyNav currentPage="materials" />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">GED Study Materials</h1>
          <p className="text-xl text-blue-100">
            Download comprehensive study guides, practice tests, and reference materials
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Subject Selection */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select a Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "math", label: "Mathematical Reasoning", icon: "📐" },
              { id: "rla", label: "Language Arts", icon: "📝" },
              { id: "science", label: "Science", icon: "🔬" },
              { id: "social", label: "Social Studies", icon: "🌍" },
            ].map((subject) => (
              <Button
                key={subject.id}
                onClick={() => {
                  setSelectedSubject(subject.id);
                  setSelectedDifficulty("all");
                }}
                variant={selectedSubject === subject.id ? "default" : "outline"}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{subject.icon}</span>
                <span className="text-sm">{subject.label}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Difficulty Filter */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Filter by Difficulty</h2>
          <div className="flex gap-2 flex-wrap">
            {["all", "easy", "medium", "hard"].map((level) => (
              <Button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                variant={selectedDifficulty === level ? "default" : "outline"}
                size="sm"
              >
                {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </section>

        {/* Materials Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Available Materials ({filteredMaterials.length})
          </h2>

          {filteredMaterials.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 text-lg">
                No materials found for the selected filters.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {typeIcons[material.type]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{material.title}</h3>
                        <p className="text-xs text-gray-500">
                          {typeLabels[material.type]}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        difficultyColors[material.difficulty]
                      }`}
                    >
                      {material.difficulty.charAt(0).toUpperCase() +
                        material.difficulty.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{material.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-gray-500">{material.fileSize}</span>
                    <Button
                      onClick={() => {
                        // In production, this would trigger actual download
                        alert(
                          `Download feature coming soon for: ${material.title}`
                        );
                      }}
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Download Tips */}
        <section className="mb-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Download Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Start with Easy Materials
              </h3>
              <p className="text-sm text-gray-700">
                Begin with easy-level materials to build foundational knowledge before
                tackling harder problems.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Use Study Guides First
              </h3>
              <p className="text-sm text-gray-700">
                Read the study guides to learn concepts, then practice with the practice
                problems.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Print for Offline Study
              </h3>
              <p className="text-sm text-gray-700">
                Download and print materials to study offline or take notes directly on
                the documents.
              </p>
            </div>
          </div>
        </section>

        {/* All Materials Summary */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Complete Study Package</h2>
          <p className="text-blue-100 mb-6">
            Access all 25+ study materials across all four GED subjects
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-3xl font-bold">25+</div>
              <p className="text-sm text-blue-100">Study Materials</p>
            </div>
            <div>
              <div className="text-3xl font-bold">180+</div>
              <p className="text-sm text-blue-100">Practice Questions</p>
            </div>
            <div>
              <div className="text-3xl font-bold">32</div>
              <p className="text-sm text-blue-100">Video Lessons</p>
            </div>
            <div>
              <div className="text-3xl font-bold">∞</div>
              <p className="text-sm text-blue-100">Practice Tests</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm">
            All materials included with your Bridge Academy subscription
          </p>
        </section>
      </div>
    </div>
  );
}
