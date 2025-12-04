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
import { Plus, CheckCircle2, XCircle, Clock, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminFollowUps() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  const utils = trpc.useUtils();
  const { data: allFollowUps, isLoading } = trpc.admin.getAllFollowUps.useQuery();
  const { data: students } = trpc.admin.getAllUsers.useQuery();
  
  const createFollowUpMutation = trpc.admin.createFollowUp.useMutation({
    onSuccess: () => {
      toast.success("Follow-up created successfully");
      utils.admin.getAllFollowUps.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create follow-up: ${error.message}`);
    }
  });

  const updateStatusMutation = trpc.admin.updateFollowUpStatus.useMutation({
    onSuccess: () => {
      toast.success("Follow-up status updated");
      utils.admin.getAllFollowUps.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });

  const deleteFollowUpMutation = trpc.admin.deleteFollowUp.useMutation({
    onSuccess: () => {
      toast.success("Follow-up deleted");
      utils.admin.getAllFollowUps.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete follow-up: ${error.message}`);
    }
  });

  if (user?.role !== 'admin') {
    setLocation('/dashboard');
    return null;
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      title: '',
      notes: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const handleBulkCreate = async () => {
    if (selectedStudents.length === 0 || !formData.title) {
      toast.error("Please select students and enter a title");
      return;
    }

    try {
      for (const studentId of selectedStudents) {
        await createFollowUpMutation.mutateAsync({
          studentId,
          title: formData.title,
          notes: formData.notes || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined
        });
      }
      toast.success(`Created ${selectedStudents.length} follow-ups successfully`);
      setIsBulkCreateDialogOpen(false);
      setSelectedStudents([]);
      resetForm();
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const handleCreateFollowUp = () => {
    if (!formData.studentId || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    createFollowUpMutation.mutate({
      studentId: parseInt(formData.studentId),
      title: formData.title,
      notes: formData.notes || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined
    });
  };

  const filteredFollowUps = selectedStatus === 'all' 
    ? allFollowUps 
    : allFollowUps?.filter(f => f.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'cancelled': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default: return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'low': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default: return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Follow-Ups</h1>
            <p className="text-muted-foreground mt-1">Track and manage student engagement</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isBulkCreateDialogOpen} onOpenChange={setIsBulkCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bulk Create Follow-Ups</DialogTitle>
                  <DialogDescription>
                    Select multiple students and create follow-ups for all of them at once
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Students</Label>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                      {students?.map((student) => (
                        <label key={student.id} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudents([...selectedStudents, student.id]);
                              } else {
                                setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">
                            {student.name || student.email}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-title">Follow-Up Title *</Label>
                    <Input
                      id="bulk-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Check course progress"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-notes">Notes</Label>
                    <Textarea
                      id="bulk-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Add context for this follow-up..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bulk-dueDate">Due Date (Optional)</Label>
                      <Input
                        id="bulk-dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsBulkCreateDialogOpen(false);
                    setSelectedStudents([]);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBulkCreate}
                    disabled={selectedStudents.length === 0 || !formData.title || createFollowUpMutation.isPending}
                  >
                    {createFollowUpMutation.isPending 
                      ? `Creating ${selectedStudents.length} follow-ups...` 
                      : `Create ${selectedStudents.length} Follow-Up${selectedStudents.length !== 1 ? 's' : ''}`
                    }
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Follow-Up
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Follow-Up</DialogTitle>
                <DialogDescription>
                  Create a follow-up task to track student engagement
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Student *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.filter(s => s.role === 'user').map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name || student.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Check on course progress"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes or context..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFollowUp} disabled={createFollowUpMutation.isPending}>
                  {createFollowUpMutation.isPending ? "Creating..." : "Create Follow-Up"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={selectedStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('completed')}
          >
            Completed
          </Button>
          <Button
            variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('cancelled')}
          >
            Cancelled
          </Button>
        </div>

        {/* Follow-Ups List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading follow-ups...</p>
          </div>
        ) : filteredFollowUps && filteredFollowUps.length > 0 ? (
          <div className="grid gap-4">
            {filteredFollowUps.map((followUp) => {
              const isOverdue = followUp.status === 'pending' && followUp.dueDate && new Date(followUp.dueDate) < new Date();
              return (
              <Card 
                key={followUp.id}
                className={isOverdue ? 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/10' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{followUp.title}</CardTitle>
                        <Badge className={getPriorityColor(followUp.priority)}>
                          {followUp.priority}
                        </Badge>
                        <Badge className={getStatusColor(followUp.status)}>
                          {getStatusIcon(followUp.status)}
                          <span className="ml-1">{followUp.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Student: {followUp.studentName || followUp.studentEmail}
                        {followUp.dueDate && (
                          <span className={`ml-4 ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}>
                            {isOverdue && '⚠️ '}
                            Due: {new Date(followUp.dueDate).toLocaleDateString()}
                            {isOverdue && ' (OVERDUE)'}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      {followUp.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ id: followUp.id, status: 'completed' })}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ id: followUp.id, status: 'cancelled' })}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this follow-up?')) {
                            deleteFollowUpMutation.mutate({ id: followUp.id });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {followUp.notes && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{followUp.notes}</p>
                  </CardContent>
                )}
              </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Follow-Ups Found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedStatus === 'all' 
                  ? "Create your first follow-up to start tracking student engagement"
                  : `No ${selectedStatus} follow-ups at this time`
                }
              </p>
              {selectedStatus === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Follow-Up
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
