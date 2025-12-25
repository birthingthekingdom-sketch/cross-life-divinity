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
import { BookOpen, Edit, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

function AdminBundlesContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "BookOpen",
    colorTheme: "blue",
    displayOrder: 0,
    courseIds: [] as number[],
  });

  const utils = trpc.useUtils();
  const { data: bundles, isLoading } = trpc.bundles.getAllBundles.useQuery();
  const { data: allCourses } = trpc.courses.list.useQuery();

  const createMutation = trpc.bundles.createBundle.useMutation({
    onSuccess: () => {
      toast.success("Bundle created successfully");
      utils.bundles.getAllBundles.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create bundle: ${error.message}`);
    },
  });

  const updateMutation = trpc.bundles.updateBundle.useMutation({
    onSuccess: () => {
      toast.success("Bundle updated successfully");
      utils.bundles.getAllBundles.invalidate();
      setEditingBundle(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update bundle: ${error.message}`);
    },
  });

  const deleteMutation = trpc.bundles.deleteBundle.useMutation({
    onSuccess: () => {
      toast.success("Bundle deleted successfully");
      utils.bundles.getAllBundles.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete bundle: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "BookOpen",
      colorTheme: "blue",
      displayOrder: 0,
      courseIds: [],
    });
  };

  const handleEdit = (bundle: any) => {
    setEditingBundle(bundle);
    setFormData({
      name: bundle.name,
      description: bundle.description || "",
      icon: bundle.icon || "BookOpen",
      colorTheme: bundle.colorTheme || "blue",
      displayOrder: bundle.displayOrder || 0,
      courseIds: bundle.courses.map((c: any) => c.id),
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Bundle name is required");
      return;
    }

    if (editingBundle) {
      updateMutation.mutate({
        id: editingBundle.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      deleteMutation.mutate({ id });
    }
  };

  const toggleCourse = (courseId: number) => {
    setFormData(prev => ({
      ...prev,
      courseIds: prev.courseIds.includes(courseId)
        ? prev.courseIds.filter(id => id !== courseId)
        : [...prev.courseIds, courseId],
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
            <h1 className="text-3xl font-bold text-foreground">Course Bundles</h1>
            <p className="text-muted-foreground mt-2">Manage thematic course groupings</p>
          </div>
          <Dialog open={isCreateOpen || !!editingBundle} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingBundle(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBundle ? "Edit Bundle" : "Create New Bundle"}</DialogTitle>
                <DialogDescription>
                  {editingBundle ? "Update bundle details and courses" : "Create a thematic grouping of related courses"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Bundle Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Ministry Leadership Track"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this bundle covers"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="colorTheme">Color Theme</Label>
                    <Select
                      value={formData.colorTheme}
                      onValueChange={(value) => setFormData({ ...formData, colorTheme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Label>Select Courses</Label>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {allCourses?.map((course) => (
                      <div key={course.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={formData.courseIds.includes(course.id)}
                          onCheckedChange={() => toggleCourse(course.id)}
                        />
                        <label
                          htmlFor={`course-${course.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {course.code} - {course.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.courseIds.length} course(s) selected
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingBundle(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingBundle ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {bundles?.map((bundle) => (
            <Card key={bundle.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{bundle.name}</CardTitle>
                      <CardDescription>{bundle.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(bundle)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(bundle.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <strong>Color:</strong> {bundle.colorTheme} • <strong>Order:</strong> {bundle.displayOrder} • <strong>Status:</strong> {bundle.isActive ? "Active" : "Inactive"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Courses ({bundle.courses.length}):</div>
                    <div className="space-y-1">
                      {bundle.courses.map((course: any) => (
                        <div key={course.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          <GripVertical className="h-3 w-3" />
                          {course.code} - {course.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {bundles?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bundles Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course bundle to get started</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bundle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminBundles() {
  return (
    <AdminRoute>
      <AdminBundlesContent />
    </AdminRoute>
  );
}
