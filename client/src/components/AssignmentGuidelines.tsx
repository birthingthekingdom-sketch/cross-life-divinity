import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BookOpen, CheckSquare } from "lucide-react";

interface AssignmentGuidelinesProps {
  assignmentPrompt: string;
}

export function AssignmentGuidelines({ assignmentPrompt }: AssignmentGuidelinesProps) {
  const handleDownloadTemplate = () => {
    // Create a Word document template
    const templateContent = `
CROSS LIFE SCHOOL OF DIVINITY
Assignment Template

Student Name: _______________________
Course: _______________________
Lesson: _______________________
Date: _______________________

ASSIGNMENT PROMPT:
${assignmentPrompt}

---

INSTRUCTIONS:
- Minimum 500 words
- Double-spaced, 12pt Times New Roman or Arial font
- Include proper citations (APA, MLA, or Chicago style)
- Reference at least 2 scholarly sources
- Demonstrate theological depth and biblical understanding

---

YOUR RESPONSE:

[Begin your assignment here...]

---

REFERENCES:

[List your sources here in proper citation format]
`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignment-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRubric = () => {
    const rubricContent = `
CROSS LIFE SCHOOL OF DIVINITY
Assignment Grading Rubric

Total Points: 100

---

1. THEOLOGICAL DEPTH & ACCURACY (40 points)

Excellent (36-40):
- Demonstrates exceptional understanding of theological concepts
- Accurately interprets biblical texts in context
- Shows sophisticated theological reasoning
- Engages with complex doctrinal issues thoughtfully

Good (32-35):
- Shows solid grasp of theological concepts
- Interprets biblical texts appropriately
- Demonstrates clear theological reasoning
- Addresses doctrinal issues adequately

Satisfactory (28-31):
- Shows basic understanding of theological concepts
- Interprets biblical texts with minor errors
- Demonstrates adequate theological reasoning
- Addresses basic doctrinal issues

Needs Improvement (0-27):
- Limited understanding of theological concepts
- Misinterprets biblical texts
- Weak theological reasoning
- Fails to address doctrinal issues adequately

---

2. CONTENT & ARGUMENTATION (40 points)

Excellent (36-40):
- Presents clear, well-developed thesis
- Provides compelling evidence and examples
- Demonstrates critical thinking and analysis
- Addresses counterarguments effectively
- Shows original insight

Good (32-35):
- Presents clear thesis
- Provides adequate evidence and examples
- Demonstrates good critical thinking
- Addresses some counterarguments
- Shows some original thinking

Satisfactory (28-31):
- Presents basic thesis
- Provides some evidence and examples
- Demonstrates basic critical thinking
- Limited engagement with counterarguments
- Mostly summarizes existing ideas

Needs Improvement (0-27):
- Unclear or missing thesis
- Insufficient evidence
- Limited critical thinking
- No engagement with counterarguments
- Lacks depth and insight

---

3. WRITING QUALITY & FORMATTING (20 points)

Excellent (18-20):
- Exceptional clarity and organization
- Flawless grammar, spelling, and punctuation
- Proper citations and references
- Meets all formatting requirements
- Professional presentation

Good (16-17):
- Clear organization
- Minor grammar/spelling errors
- Proper citations with minor issues
- Meets most formatting requirements
- Good presentation

Satisfactory (14-15):
- Adequate organization
- Some grammar/spelling errors
- Citations present but inconsistent
- Meets basic formatting requirements
- Acceptable presentation

Needs Improvement (0-13):
- Poor organization
- Frequent grammar/spelling errors
- Missing or improper citations
- Does not meet formatting requirements
- Unprofessional presentation

---

ADDITIONAL NOTES:
- Late submissions may incur point deductions
- Plagiarism will result in a failing grade
- Consult your instructor if you need clarification
`;

    const blob = new Blob([rubricContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grading-rubric.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Assignment Guidelines & Resources
        </CardTitle>
        <CardDescription>
          Review the guidelines and download helpful resources before starting your assignment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guidelines" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
            <TabsTrigger value="tips">Writing Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="guidelines" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Assignment Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Length:</strong> Minimum 500 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Format:</strong> Double-spaced, 12pt Times New Roman or Arial</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Citations:</strong> Use APA, MLA, or Chicago style consistently</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Sources:</strong> Reference at least 2 scholarly sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>File Type:</strong> Submit as PDF, DOC, or DOCX (max 10MB)</span>
                </li>
              </ul>

              <div className="pt-4">
                <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Assignment Template
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rubric" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Grading Rubric (100 Points)</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Theological Depth & Accuracy (40 points)</h4>
                  <p className="text-sm text-purple-800">
                    Demonstrates understanding of theological concepts, accurate biblical interpretation, 
                    and sophisticated theological reasoning.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Content & Argumentation (40 points)</h4>
                  <p className="text-sm text-blue-800">
                    Presents clear thesis with compelling evidence, demonstrates critical thinking, 
                    and shows original insight.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Writing Quality & Formatting (20 points)</h4>
                  <p className="text-sm text-green-800">
                    Exceptional clarity and organization, proper grammar and citations, 
                    meets all formatting requirements.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleDownloadRubric} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Detailed Rubric
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Theological Writing Tips</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">1. Start with Scripture</h4>
                  <p className="text-muted-foreground">
                    Ground your arguments in biblical texts. Always provide context and avoid proof-texting.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">2. Engage with Tradition</h4>
                  <p className="text-muted-foreground">
                    Reference church fathers, historical theologians, and contemporary scholars to show depth.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">3. Think Critically</h4>
                  <p className="text-muted-foreground">
                    Don't just summarize—analyze, evaluate, and synthesize different perspectives.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">4. Write Clearly</h4>
                  <p className="text-muted-foreground">
                    Avoid unnecessary jargon. Explain complex concepts in accessible language.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">5. Cite Properly</h4>
                  <p className="text-muted-foreground">
                    Give credit to all sources. Plagiarism is a serious academic offense.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">6. Proofread Carefully</h4>
                  <p className="text-muted-foreground">
                    Read your work aloud, check for errors, and ensure your argument flows logically.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mt-4">
                <p className="text-sm text-amber-900">
                  <strong>Pro Tip:</strong> Start early and allow time for revision. Great theological writing 
                  requires careful thought and multiple drafts.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
