import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Papa from "papaparse";
import { ArrowLeft, Upload, Download, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminBulkImport() {
  const [, navigate] = useLocation();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const { data: courses } = trpc.courses.listAll.useQuery();
  const bulkImportMutation = trpc.admin.bulkImportLessons.useMutation();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCourseId) {
      toast.error("Please select a course first");
      return;
    }

    setImporting(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const lessons = results.data
            .filter((row: any) => row.title && row.content)
            .map((row: any, index: number) => ({
              title: row.title,
              content: row.content,
              order: row.order ? parseInt(row.order) : index + 1
            }));

          if (lessons.length === 0) {
            toast.error("No valid lessons found in CSV");
            setImporting(false);
            return;
          }

          const response = await bulkImportMutation.mutateAsync({
            courseId: parseInt(selectedCourseId),
            lessons
          });

          setResult({
            imported: response.imported,
            errors: response.errors
          });

          if (response.success) {
            toast.success(`Successfully imported ${response.imported} lessons!`);
          } else {
            toast.warning(`Imported ${response.imported} lessons with ${response.errors.length} errors`);
          }
        } catch (error) {
          toast.error("Failed to import lessons");
          console.error(error);
        } finally {
          setImporting(false);
        }
      },
      error: (error) => {
        toast.error(`CSV parsing error: ${error.message}`);
        setImporting(false);
      }
    });
  };

  const downloadTemplate = () => {
    const csvContent = `title,content,order
"Introduction to the Topic","# Introduction\\n\\nThis is the lesson content in Markdown format.\\n\\n## Key Points\\n\\n- Point 1\\n- Point 2",1
"Advanced Concepts","# Advanced Concepts\\n\\nMore detailed content here.",2`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lesson-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Bulk Import Lessons</CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple lessons at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Course</label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Download */}
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Download the CSV template to see the required format</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTemplate}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload CSV File</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={!selectedCourseId || importing}
                  className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                />
                {importing && (
                  <span className="text-sm text-muted-foreground">Importing...</span>
                )}
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <Alert className={result.errors.length === 0 ? "border-green-500" : "border-yellow-500"}>
                  {result.errors.length === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <AlertDescription>
                    <div className="font-semibold mb-2">
                      Import Complete: {result.imported} lessons imported
                    </div>
                    {result.errors.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Errors:</div>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {result.errors.map((error, idx) => (
                            <li key={idx} className="text-red-600 dark:text-red-400">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm">CSV Format Instructions:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li><strong>title</strong>: Lesson title (required)</li>
                <li><strong>content</strong>: Lesson content in Markdown format (required)</li>
                <li><strong>order</strong>: Lesson order number (optional, auto-numbered if not provided)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
