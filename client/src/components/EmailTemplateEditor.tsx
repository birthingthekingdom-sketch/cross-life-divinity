import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  templateType: "welcome" | "reminder" | "certificate" | "custom";
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AVAILABLE_VARIABLES = [
  "{{studentName}}",
  "{{studentEmail}}",
  "{{courseName}}",
  "{{courseCode}}",
  "{{completionDate}}",
  "{{certificateNumber}}",
  "{{cpdHours}}",
  "{{instructorName}}",
  "{{schoolName}}",
];

export function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    subject: string;
    body: string;
    templateType: "welcome" | "reminder" | "certificate" | "custom";
    variables: string[];
  }>({
    name: "",
    subject: "",
    body: "",
    templateType: "custom",
    variables: [],
  });

  const getTemplates = trpc.advancedAnalytics.getEmailTemplates.useQuery({});
  const createMutation = trpc.advancedAnalytics.createEmailTemplate.useMutation();
  const updateMutation = trpc.advancedAnalytics.updateEmailTemplate.useMutation();

  useEffect(() => {
    if (getTemplates.data) {
      setTemplates(getTemplates.data as EmailTemplate[]);
    }
  }, [getTemplates.data]);

  const handleAddVariable = (variable: string) => {
    if (!formData.body.includes(variable)) {
      setFormData((prev) => ({
        ...prev,
        body: prev.body + " " + variable,
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          subject: formData.subject,
          body: formData.body,
          variables: formData.variables,
        });
        toast.success("Template updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          subject: formData.subject,
          body: formData.body,
          templateType: formData.templateType,
          variables: formData.variables,
        });
        toast.success("Template created successfully");
      }

      // Refresh templates
      await getTemplates.refetch();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save template");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      body: "",
      templateType: "custom",
      variables: [],
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (template: EmailTemplate) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      templateType: template.templateType,
      variables: template.variables,
    });
    setEditingId(template.id);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Template Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template List */}
          {!isCreating && editingId === null && (
            <>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>

              {templates.length > 0 ? (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">
                          {template.subject}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {template.templateType}
                          </span>
                          {template.isActive && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No templates created yet
                </div>
              )}
            </>
          )}

          {/* Template Editor */}
          {(isCreating || editingId !== null) && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold">
                {editingId ? "Edit Template" : "Create New Template"}
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Template Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Welcome Email, Course Reminder"
                  disabled={editingId !== null}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Template Type
                </label>
                <Select
                  value={formData.templateType}
                  onValueChange={(value: "welcome" | "reminder" | "certificate" | "custom") =>
                    setFormData((prev) => ({
                      ...prev,
                      templateType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Subject
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="e.g., Welcome to {{schoolName}}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Body
                </label>
                <Textarea
                  value={formData.body}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, body: e.target.value }))
                  }
                  placeholder="Enter email content here..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Variables
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_VARIABLES.map((variable) => (
                    <Button
                      key={variable}
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddVariable(variable)}
                      className="text-xs"
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Click a variable to insert it into the email body
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Update Template" : "Create Template"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
