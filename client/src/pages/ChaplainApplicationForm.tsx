import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { Link } from "wouter";

export default function ChaplainApplicationForm() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    currentMinistryRole: "",
    yearsInMinistry: "",
    ordainedStatus: "",
    denominationAffiliation: "",
    ministryExperienceDescription: "",
    chaplaincy_interest: "",
    chaplaincy_interest_other: "",
    motivationStatement: "",
    reference1Name: "",
    reference1Email: "",
    reference1Phone: "",
    reference1Relationship: "",
    reference2Name: "",
    reference2Email: "",
    reference2Phone: "",
    reference2Relationship: "",
    backgroundCheckConsent: false,
  });

  const submitApplication = trpc.chaplaincy.submitApplication.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully! We'll review it within 3-5 business days.");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.backgroundCheckConsent) {
      toast.error("You must consent to a background check to apply");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitApplication.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      currentMinistryRole: formData.currentMinistryRole || undefined,
      yearsInMinistry: parseInt(formData.yearsInMinistry) || 0,
      ordainedStatus: formData.ordainedStatus as "ordained" | "licensed" | "not_ordained",
      denominationAffiliation: formData.denominationAffiliation || undefined,
      ministryExperienceDescription: formData.ministryExperienceDescription,
      chaplaincy_interest: formData.chaplaincy_interest as "healthcare" | "military" | "correctional" | "corporate" | "educational" | "other",
      chaplaincy_interest_other: formData.chaplaincy_interest_other || undefined,
      motivationStatement: formData.motivationStatement,
      reference1Name: formData.reference1Name,
      reference1Email: formData.reference1Email,
      reference1Phone: formData.reference1Phone,
      reference1Relationship: formData.reference1Relationship,
      reference2Name: formData.reference2Name,
      reference2Email: formData.reference2Email,
      reference2Phone: formData.reference2Phone,
      reference2Relationship: formData.reference2Relationship,
      backgroundCheckConsent: formData.backgroundCheckConsent,
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container max-w-4xl">
        <Link href="/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <CardTitle className="text-3xl">Chaplain's Training Application</CardTitle>
                <CardDescription className="text-white/90 text-lg mt-2">
                  Complete this application to enroll in the Chaplain's Training program
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Mailing Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Ministry Experience */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Ministry Experience</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentMinistryRole">Current Ministry Role</Label>
                    <Input
                      id="currentMinistryRole"
                      value={formData.currentMinistryRole}
                      onChange={(e) => updateField("currentMinistryRole", e.target.value)}
                      placeholder="e.g., Pastor, Youth Leader, Missionary"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="yearsInMinistry">Years in Ministry *</Label>
                    <Input
                      id="yearsInMinistry"
                      type="number"
                      min="0"
                      value={formData.yearsInMinistry}
                      onChange={(e) => updateField("yearsInMinistry", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ordainedStatus">Ordination Status *</Label>
                    <Select value={formData.ordainedStatus} onValueChange={(value) => updateField("ordainedStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ordained">Ordained</SelectItem>
                        <SelectItem value="licensed">Licensed</SelectItem>
                        <SelectItem value="not_ordained">Not Ordained</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="denominationAffiliation">Denomination/Affiliation</Label>
                    <Input
                      id="denominationAffiliation"
                      value={formData.denominationAffiliation}
                      onChange={(e) => updateField("denominationAffiliation", e.target.value)}
                      placeholder="e.g., Baptist, Methodist, Non-denominational"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ministryExperienceDescription">Ministry Experience Description *</Label>
                  <Textarea
                    id="ministryExperienceDescription"
                    value={formData.ministryExperienceDescription}
                    onChange={(e) => updateField("ministryExperienceDescription", e.target.value)}
                    rows={4}
                    placeholder="Describe your ministry experience, roles, and responsibilities..."
                    required
                  />
                </div>
              </div>

              {/* Chaplaincy Interest */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Chaplaincy Interest</h3>
                
                <div>
                  <Label htmlFor="chaplaincy_interest">Primary Chaplaincy Interest *</Label>
                  <Select value={formData.chaplaincy_interest} onValueChange={(value) => updateField("chaplaincy_interest", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area of interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare Chaplaincy</SelectItem>
                      <SelectItem value="military">Military Chaplaincy</SelectItem>
                      <SelectItem value="correctional">Correctional/Prison Chaplaincy</SelectItem>
                      <SelectItem value="corporate">Corporate/Workplace Chaplaincy</SelectItem>
                      <SelectItem value="educational">Educational Chaplaincy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.chaplaincy_interest === "other" && (
                  <div>
                    <Label htmlFor="chaplaincy_interest_other">Please Specify</Label>
                    <Input
                      id="chaplaincy_interest_other"
                      value={formData.chaplaincy_interest_other}
                      onChange={(e) => updateField("chaplaincy_interest_other", e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="motivationStatement">Motivation Statement *</Label>
                  <Textarea
                    id="motivationStatement"
                    value={formData.motivationStatement}
                    onChange={(e) => updateField("motivationStatement", e.target.value)}
                    rows={5}
                    placeholder="Why do you want to become a chaplain? What do you hope to accomplish through chaplaincy ministry?"
                    required
                  />
                </div>
              </div>

              {/* References */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Professional References (2 Required)</h3>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium">Reference 1</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reference1Name">Full Name *</Label>
                      <Input
                        id="reference1Name"
                        value={formData.reference1Name}
                        onChange={(e) => updateField("reference1Name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference1Email">Email *</Label>
                      <Input
                        id="reference1Email"
                        type="email"
                        value={formData.reference1Email}
                        onChange={(e) => updateField("reference1Email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference1Phone">Phone *</Label>
                      <Input
                        id="reference1Phone"
                        type="tel"
                        value={formData.reference1Phone}
                        onChange={(e) => updateField("reference1Phone", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference1Relationship">Relationship *</Label>
                      <Input
                        id="reference1Relationship"
                        value={formData.reference1Relationship}
                        onChange={(e) => updateField("reference1Relationship", e.target.value)}
                        placeholder="e.g., Senior Pastor, Supervisor"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium">Reference 2</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reference2Name">Full Name *</Label>
                      <Input
                        id="reference2Name"
                        value={formData.reference2Name}
                        onChange={(e) => updateField("reference2Name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference2Email">Email *</Label>
                      <Input
                        id="reference2Email"
                        type="email"
                        value={formData.reference2Email}
                        onChange={(e) => updateField("reference2Email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference2Phone">Phone *</Label>
                      <Input
                        id="reference2Phone"
                        type="tel"
                        value={formData.reference2Phone}
                        onChange={(e) => updateField("reference2Phone", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference2Relationship">Relationship *</Label>
                      <Input
                        id="reference2Relationship"
                        value={formData.reference2Relationship}
                        onChange={(e) => updateField("reference2Relationship", e.target.value)}
                        placeholder="e.g., Ministry Colleague, Mentor"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Check Consent */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Background Check</h3>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg space-y-4">
                  <p className="text-sm">
                    The Chaplain's Training program requires a comprehensive background check ($50 fee) as part of the application process. This is standard practice for chaplaincy certification and ensures the safety and integrity of the program.
                  </p>
                  
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="backgroundCheckConsent"
                      checked={formData.backgroundCheckConsent}
                      onCheckedChange={(checked) => updateField("backgroundCheckConsent", checked)}
                      required
                    />
                    <Label htmlFor="backgroundCheckConsent" className="cursor-pointer leading-relaxed">
                      I consent to a background check and understand that a $50 fee will be charged in addition to the $350 course fee. I authorize Cross Life School of Divinity to conduct a comprehensive background check for chaplaincy certification purposes.
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Link href="/courses">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={submitApplication.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {submitApplication.isPending ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
