import { AdminRoute } from "@/components/AdminRoute";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { GraduationCap, Edit, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

function AdminLearningPathsContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    duration: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    icon: "Map",
    colorTheme: "purple",
    displayOrder: 0,
    courses: [] as Array<{ courseId: number; courseOrder: number; isRequired: boolean }>,
  });

  const utils = trpc.useUtils();
  const { data: paths, isLoading } = trpc.bundles.getAllLearningPaths.useQuery();
  const { data: allCourses } = trpc.courses.list.useQuery();

  const createMutation = trpc.bundles.createLearningPath.useMutation({
    onSuccess: () => {
      toast.success("Learning path created successfully");
      utils.bundles.getAllLearningPaths.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create learning path: ${error.message}`);
    },
  });

  const updateMutation = trpc.bundles.updateLearningPath.useMutation({
    onSuccess: () => {
      toast.success("Learning path updated successfully");
      utils.bundles.getAllLearningPaths.invalidate();
      setEditingPath(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update learning path: ${error.message}`);
    },
  });

  const deleteMutation = trpc.bundles.deleteLearningPath.useMutation({
    onSuccess: () => {
      toast.success("Learning path deleted successfully");
      utils.bundles.getAllLearningPaths.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete learning path: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      goal: "",
      duration: "",
      level: "beginner",
      icon: "Map",
      colorTheme: "purple",
      displayOrder: 0,
      courses: [],
    });
  };

  const handleEdit = (path: any) => {
    setEditingPath(path);
    setFormData({
      name: path.name,
      description: path.description || "",
      goal: path.goal || "",
      duration: path.duration || "",
      level: path.level || "beginner",
      icon: path.icon || "Map",
      colorTheme: path.colorTheme || "purple",
      displayOrder: path.displayOrder || 0,
      courses: path.courses.map((c: any, index: number) => ({
        courseId: c.id,
        courseOrder: c.courseOrder || index + 1,
        isRequired: c.isRequired !== undefined ? c.isRequired : true,
      })),
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Learning path name is required");
      return;
    }

    if (editingPath) {
      updateMutation.mutate({
        id: editingPath.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this learning path?")) {
      deleteMutation.mutate({ id });
    }
  };

  const toggleCourse = (courseId: number) => {
    const existingIndex = formData.courses.findIndex(c => c.courseId === courseId);
    if (existingIndex >= 0) {
      setFormData(prev => ({
        ...prev,
        courses: prev.courses.filter(c => c.courseId !== courseId),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, {
          courseId,
          courseOrder: prev.courses.length + 1,
          isRequired: true,
        }],
      }));
    }
  };

  const toggleRequired = (courseId: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map(c =>
        c.courseId === courseId ? { ...c, isRequired: !c.isRequired } : c
      ),
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Learning Paths</h1>
            <p className="text-muted-foreground mt-2">Manage structured course sequences for students</p>
          </div>
          <Dialog open={isCreateOpen || !!editingPath} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingPath(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Learning Path
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPath ? "Edit Learning Path" : "Create New Learning Path"}</DialogTitle>
                <DialogDescription>
                  {editingPath ? "Update learning path details and courses" : "Create a structured sequence of courses"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Path Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., New Believer Foundation"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this learning path"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="goal">Learning Goal</Label>
                  <Textarea
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="What will students achieve by completing this path?"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value: any) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 3 months"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Select Courses (in order)</Label>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {allCourses?.map((course) => {
                      const selectedCourse = formData.courses.find(c => c.courseId === course.id);
                      const isSelected = !!selectedCourse;
                      
                      return (
                        <div key={course.id} className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-accent/50">
                          <div className="flex items-center space-x-2 flex-1">
                            <Checkbox
                              id={`course-${course.id}`}
                              checked={isSelected}
                              onCheckedChange={() => toggleCourse(course.id)}
                            />
                            <label
                              htmlFor={`course-${course.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                              {course.code} - {course.title}
                            </label>
                          </div>
                          {isSelected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRequired(course.id)}
                              className="h-8"
                            >
                              {selectedCourse.isRequired ? (
                                <><CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Required</>
                              ) : (
                                <><Circle className="h-4 w-4 mr-1" /> Optional</>
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.courses.length} course(s) selected ({formData.courses.filter(c => c.isRequired).length} required, {formData.courses.filter(c => !c.isRequired).length} optional)
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingPath(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingPath ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {paths?.map((path) => (
            <Card key={path.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{path.name}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(path)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(path.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <strong>Level:</strong> {path.level} • <strong>Duration:</strong> {path.duration} • <strong>Order:</strong> {path.displayOrder} • <strong>Status:</strong> {path.isActive ? "Active" : "Inactive"}
                  </div>
                  {path.goal && (
                    <div className="text-sm">
                      <strong>Goal:</strong> {path.goal}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold mb-2">Courses ({path.courses.length}):</div>
                    <div className="space-y-1">
                      {path.courses.map((course: any) => (
                        <div key={course.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          {course.isRequired ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <Circle className="h-3 w-3" />
                          )}
                          {course.code} - {course.title} {!course.isRequired && <span className="text-xs">(Optional)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {paths?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Learning Paths Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first learning path to guide students</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Learning Path
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminLearningPaths() {
  return (
    <AdminRoute>
      <AdminLearningPathsContent />
    </AdminRoute>
  );
}
