import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Function to determine if a color is light or dark
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white text for dark backgrounds, black text for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

interface AssignCoursesDialogProps {
  accessCodeId: number;
  accessCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AssignCoursesDialog({
  accessCodeId,
  accessCode,
  open,
  onOpenChange,
  onSuccess,
}: AssignCoursesDialogProps) {
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const { data: allCourses } = trpc.courses.listAll.useQuery();
  const { data: assignedCourses } = trpc.admin.getAccessCodeCourses.useQuery(
    { accessCodeId },
    { enabled: open }
  );

  const assignMutation = trpc.admin.assignCoursesToAccessCode.useMutation({
    onSuccess: () => {
      toast.success("Courses assigned successfully!");
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign courses");
    },
  });

  useEffect(() => {
    if (assignedCourses) {
      setSelectedCourses(assignedCourses.map((ac) => ac.courseId));
    }
  }, [assignedCourses]);

  const handleToggleCourse = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (allCourses) {
      setSelectedCourses(allCourses.map((c) => c.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedCourses([]);
  };

  const handleSave = () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }
    assignMutation.mutate({
      accessCodeId,
      courseIds: selectedCourses,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Courses to Access Code</DialogTitle>
          <DialogDescription>
            Select which courses can be accessed with code <span className="font-mono font-bold">{accessCode}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All (Full Suite)
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {allCourses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <Checkbox
                  id={`course-${course.id}`}
                  checked={selectedCourses.includes(course.id)}
                  onCheckedChange={() => handleToggleCourse(course.id)}
                />
                <Label
                  htmlFor={`course-${course.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: course.colorTheme,
                        color: getContrastColor(course.colorTheme)
                      }}
                    >
                      {course.code.substring(3)}
                    </div>
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.code} • {course.totalLessons} lessons
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedCourses.length === 0 && "No courses selected"}
            {selectedCourses.length === 1 && "1 course selected"}
            {selectedCourses.length > 1 && `${selectedCourses.length} courses selected`}
            {selectedCourses.length === allCourses?.length && " (Full Suite)"}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={assignMutation.isPending || selectedCourses.length === 0}
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Assignment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
