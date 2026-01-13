import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Calendar, Clock, Edit, Trash2, ExternalLink, Video } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminWebinars() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    meetingUrl: '',
    scheduledAt: '',
    scheduledTime: '',
    duration: '60',
    recordingUrl: ''
  });

  const utils = trpc.useUtils();
  const { data: webinars, isLoading } = trpc.admin.getAllWebinars.useQuery();
  const { data: courses } = trpc.courses.list.useQuery();
  
  const createWebinarMutation = trpc.admin.createWebinar.useMutation({
    onSuccess: () => {
      toast.success("Webinar created successfully");
      utils.admin.getAllWebinars.invalidate();
      utils.webinars.getUpcoming.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create webinar: ${error.message}`);
    }
  });

  const updateWebinarMutation = trpc.admin.updateWebinar.useMutation({
    onSuccess: () => {
      toast.success("Webinar updated successfully");
      utils.admin.getAllWebinars.invalidate();
      utils.webinars.getUpcoming.invalidate();
      setEditingWebinar(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update webinar: ${error.message}`);
    }
  });

  const deleteWebinarMutation = trpc.admin.deleteWebinar.useMutation({
    onSuccess: () => {
      toast.success("Webinar deleted");
      utils.admin.getAllWebinars.invalidate();
      utils.webinars.getUpcoming.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete webinar: ${error.message}`);
    }
  });

  if (user?.role !== 'admin') {
    setLocation('/dashboard');
    return null;
  }

  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      meetingUrl: '',
      scheduledAt: '',
      scheduledTime: '',
      duration: '60',
      recordingUrl: ''
    });
  };

  const handleCreateWebinar = () => {
    if (!formData.title || !formData.meetingUrl || !formData.scheduledAt || !formData.scheduledTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const scheduledDateTime = `${formData.scheduledAt}T${formData.scheduledTime}:00`;

    createWebinarMutation.mutate({
      courseId: formData.courseId ? parseInt(formData.courseId) : undefined,
      title: formData.title,
      description: formData.description || undefined,
      meetingUrl: formData.meetingUrl,
      scheduledAt: scheduledDateTime,
      duration: parseInt(formData.duration)
    });
  };

  const handleUpdateWebinar = () => {
    if (!editingWebinar) return;

    const scheduledDateTime = formData.scheduledAt && formData.scheduledTime
      ? `${formData.scheduledAt}T${formData.scheduledTime}:00`
      : undefined;

    updateWebinarMutation.mutate({
      id: editingWebinar.id,
      title: formData.title || undefined,
      description: formData.description || undefined,
      meetingUrl: formData.meetingUrl || undefined,
      scheduledAt: scheduledDateTime,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      recordingUrl: formData.recordingUrl || undefined
    });
  };

  const openEditDialog = (webinar: any) => {
    setEditingWebinar(webinar);
    const scheduledDate = new Date(webinar.scheduledAt);
    setFormData({
      courseId: webinar.courseId?.toString() || '',
      title: webinar.title,
      description: webinar.description || '',
      meetingUrl: webinar.meetingUrl,
      scheduledAt: scheduledDate.toISOString().split('T')[0],
      scheduledTime: scheduledDate.toTimeString().slice(0, 5),
      duration: webinar.duration.toString(),
      recordingUrl: webinar.recordingUrl || ''
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isUpcoming = (date: Date, duration: number) => {
    const scheduledDate = new Date(date);
    const endTime = new Date(scheduledDate.getTime() + (duration * 60000));
    return endTime > new Date();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Webinar Management</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage live online sessions</p>
          </div>
          
          <Dialog open={isCreateDialogOpen || !!editingWebinar} onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingWebinar(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Webinar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingWebinar ? 'Edit Webinar' : 'Schedule New Webinar'}</DialogTitle>
                <DialogDescription>
                  {editingWebinar ? 'Update webinar details' : 'Create a new live online session'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to Prayer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what will be covered in this session..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Related Course (Optional)</Label>
                  <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingUrl">Meeting URL * (Zoom, Google Meet, etc.)</Label>
                  <Input
                    id="meetingUrl"
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="scheduledAt">Date *</Label>
                    <Input
                      id="scheduledAt"
                      type="date"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="15"
                    step="15"
                  />
                </div>

                {editingWebinar && (
                  <div className="space-y-2">
                    <Label htmlFor="recordingUrl">Recording URL (after session)</Label>
                    <Input
                      id="recordingUrl"
                      type="url"
                      value={formData.recordingUrl}
                      onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingWebinar(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingWebinar ? handleUpdateWebinar : handleCreateWebinar}
                  disabled={createWebinarMutation.isPending || updateWebinarMutation.isPending}
                >
                  {(createWebinarMutation.isPending || updateWebinarMutation.isPending) 
                    ? "Saving..." 
                    : editingWebinar ? "Update Webinar" : "Create Webinar"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Webinars List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading webinars...</p>
          </div>
        ) : webinars && webinars.length > 0 ? (
          <div className="grid gap-4">
            {webinars.map((webinar) => (
              <Card key={webinar.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{webinar.title}</CardTitle>
                        {isUpcoming(webinar.scheduledAt, webinar.duration) ? (
                          <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                            <Video className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Past
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(webinar.scheduledAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {webinar.duration} min
                        </span>
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={webinar.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(webinar)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this webinar?')) {
                            deleteWebinarMutation.mutate({ id: webinar.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {webinar.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{webinar.description}</p>
                    {webinar.recordingUrl && (
                      <div className="mt-3">
                        <a 
                          href={webinar.recordingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Watch Recording <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Webinars Scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Create your first webinar to start hosting live online sessions
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Webinar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
