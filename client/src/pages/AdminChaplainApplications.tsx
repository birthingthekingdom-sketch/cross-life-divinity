import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Eye, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminChaplainApplications() {
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "under_review" | "approved" | "rejected">("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: applications, isLoading, refetch } = trpc.chaplaincy.getAllApplications.useQuery({
    status: selectedStatus,
  });

  const updateStatus = trpc.chaplaincy.updateApplicationStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated");
      setReviewDialogOpen(false);
      setSelectedApplication(null);
      setReviewNotes("");
      setRejectionReason("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update application");
    },
  });

  const handleApprove = () => {
    if (!selectedApplication) return;
    
    updateStatus.mutate({
      id: selectedApplication.id,
      status: "approved",
      reviewNotes,
    });
  };

  const handleReject = () => {
    if (!selectedApplication) return;
    
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    updateStatus.mutate({
      id: selectedApplication.id,
      status: "rejected",
      reviewNotes,
      rejectionReason,
    });
  };

  const handleSetUnderReview = () => {
    if (!selectedApplication) return;
    
    updateStatus.mutate({
      id: selectedApplication.id,
      status: "under_review",
      reviewNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: "secondary", icon: Clock, label: "Pending" },
      under_review: { variant: "default", icon: Eye, label: "Under Review" },
      approved: { variant: "default", icon: CheckCircle2, label: "Approved" },
      rejected: { variant: "destructive", icon: XCircle, label: "Rejected" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Chaplaincy Applications</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage applications for the Chaplain's Training program
          </p>
        </div>

        <Tabs value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">Loading applications...</div>
            ) : !applications || applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((app: any) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{app.fullName}</CardTitle>
                          <CardDescription>
                            {app.email} • {app.phone}
                          </CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Years in Ministry</p>
                          <p className="text-lg font-semibold">{app.yearsInMinistry} years</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Ordination Status</p>
                          <p className="text-lg font-semibold capitalize">{app.ordainedStatus.replace("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Chaplaincy Interest</p>
                          <p className="text-lg font-semibold capitalize">{app.chaplaincy_interest}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                        <Button
                          onClick={() => {
                            setSelectedApplication(app);
                            setReviewDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review Application
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Review: {selectedApplication?.fullName}</DialogTitle>
              <DialogDescription>
                Review the complete application and update its status
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date of Birth</Label>
                      <p className="font-medium">{selectedApplication.dateOfBirth}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{selectedApplication.address}</p>
                  </div>
                </div>

                {/* Ministry Experience */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Ministry Experience</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Current Role</Label>
                      <p className="font-medium">{selectedApplication.currentMinistryRole || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Years in Ministry</Label>
                      <p className="font-medium">{selectedApplication.yearsInMinistry} years</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Ordination Status</Label>
                      <p className="font-medium capitalize">{selectedApplication.ordainedStatus.replace("_", " ")}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Denomination</Label>
                      <p className="font-medium">{selectedApplication.denominationAffiliation || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ministry Experience Description</Label>
                    <p className="font-medium whitespace-pre-wrap">{selectedApplication.ministryExperienceDescription}</p>
                  </div>
                </div>

                {/* Chaplaincy Interest */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Chaplaincy Interest</h3>
                  <div>
                    <Label className="text-muted-foreground">Primary Interest</Label>
                    <p className="font-medium capitalize">{selectedApplication.chaplaincy_interest}</p>
                    {selectedApplication.chaplaincy_interest_other && (
                      <p className="text-sm text-muted-foreground mt-1">({selectedApplication.chaplaincy_interest_other})</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Motivation Statement</Label>
                    <p className="font-medium whitespace-pre-wrap">{selectedApplication.motivationStatement}</p>
                  </div>
                </div>

                {/* References */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">References</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Reference 1</h4>
                      <p className="text-sm"><strong>Name:</strong> {selectedApplication.reference1Name}</p>
                      <p className="text-sm"><strong>Email:</strong> {selectedApplication.reference1Email}</p>
                      <p className="text-sm"><strong>Phone:</strong> {selectedApplication.reference1Phone}</p>
                      <p className="text-sm"><strong>Relationship:</strong> {selectedApplication.reference1Relationship}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Reference 2</h4>
                      <p className="text-sm"><strong>Name:</strong> {selectedApplication.reference2Name}</p>
                      <p className="text-sm"><strong>Email:</strong> {selectedApplication.reference2Email}</p>
                      <p className="text-sm"><strong>Phone:</strong> {selectedApplication.reference2Phone}</p>
                      <p className="text-sm"><strong>Relationship:</strong> {selectedApplication.reference2Relationship}</p>
                    </div>
                  </div>
                </div>

                {/* Background Check */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Background Check</h3>
                  <div>
                    <Label className="text-muted-foreground">Consent Given</Label>
                    <p className="font-medium">{selectedApplication.backgroundCheckConsent ? "Yes" : "No"}</p>
                  </div>
                </div>

                {/* Review Notes */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Review Notes</h3>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add internal notes about this application..."
                    rows={3}
                  />
                </div>

                {/* Rejection Reason (conditional) */}
                {selectedApplication.status === "rejected" || rejectionReason ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg border-b pb-2">Rejection Reason</h3>
                    <Textarea
                      value={rejectionReason || selectedApplication.rejectionReason || ""}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection (will be sent to applicant)..."
                      rows={3}
                    />
                  </div>
                ) : null}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Close
              </Button>
              
              {selectedApplication?.status !== "under_review" && (
                <Button
                  variant="secondary"
                  onClick={handleSetUnderReview}
                  disabled={updateStatus.isPending}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Mark Under Review
                </Button>
              )}

              {selectedApplication?.status !== "rejected" && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!rejectionReason) {
                      setRejectionReason("");
                    }
                    handleReject();
                  }}
                  disabled={updateStatus.isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              )}

              {selectedApplication?.status !== "approved" && (
                <Button
                  onClick={handleApprove}
                  disabled={updateStatus.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
