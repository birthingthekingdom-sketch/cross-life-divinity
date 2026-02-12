import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";

interface PathwayPhase {
  id: number;
  title: string;
  duration: string;
  description: string;
  clinicalHours: number;
  activities: string[];
  outcomes: string[];
  icon: React.ReactNode;
}

interface ClinicalHoursBreakdown {
  category: string;
  hours: number;
  percentage: number;
  description: string;
}

const PATHWAY_PHASES: PathwayPhase[] = [
  {
    id: 1,
    title: "Application & Orientation",
    duration: "2-4 weeks",
    description: "Begin your CPE journey with comprehensive orientation to the program, institution, and chaplaincy team.",
    clinicalHours: 0,
    activities: [
      "Complete application and prerequisites",
      "Orientation to institution and policies",
      "Meet with CPE supervisor",
      "Establish learning goals",
      "Begin spiritual autobiography",
      "Orientation to chaplaincy team",
    ],
    outcomes: [
      "Understand CPE program structure and expectations",
      "Establish professional relationships with team",
      "Clarify personal learning goals",
      "Begin self-awareness journey",
    ],
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Early Clinical Practice",
    duration: "Weeks 1-4",
    description: "Begin direct patient/client care with close supervision and frequent feedback.",
    clinicalHours: 40,
    activities: [
      "Conduct initial patient visits",
      "Participate in rounds and team meetings",
      "Attend daily supervision",
      "Begin case documentation",
      "Participate in peer group sessions",
      "Observe experienced chaplains",
    ],
    outcomes: [
      "Develop basic pastoral presence skills",
      "Learn institutional context and patient populations",
      "Build confidence in clinical encounters",
      "Establish supervision relationship",
    ],
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Skill Development",
    duration: "Weeks 5-8",
    description: "Deepen clinical skills with increasing independence and more complex cases.",
    clinicalHours: 80,
    activities: [
      "Increase patient visit frequency",
      "Handle crisis interventions",
      "Facilitate spiritual rituals",
      "Conduct family meetings",
      "Develop case studies",
      "Participate in clinical seminars",
    ],
    outcomes: [
      "Demonstrate active listening and empathy",
      "Handle crisis situations effectively",
      "Integrate theology with practice",
      "Develop professional boundaries",
    ],
    icon: <Clock className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Advanced Practice",
    duration: "Weeks 9-12",
    description: "Provide independent chaplaincy care with consultation as needed.",
    clinicalHours: 120,
    activities: [
      "Lead patient care independently",
      "Manage complex cases",
      "Provide peer support and mentoring",
      "Conduct advanced rituals",
      "Participate in ethics consultations",
      "Develop specialized competencies",
    ],
    outcomes: [
      "Demonstrate clinical competency",
      "Handle complex spiritual and emotional issues",
      "Provide culturally sensitive care",
      "Model professional chaplaincy practice",
    ],
    icon: <Award className="h-6 w-6" />,
  },
  {
    id: 5,
    title: "Integration & Reflection",
    duration: "Final 2 weeks",
    description: "Consolidate learning and prepare for transition to professional practice.",
    clinicalHours: 60,
    activities: [
      "Complete final case studies",
      "Conduct exit interviews",
      "Participate in final peer group",
      "Complete evaluations",
      "Develop continuing education plan",
      "Celebrate completion",
    ],
    outcomes: [
      "Integrate learning into coherent practice",
      "Articulate professional identity",
      "Plan ongoing professional development",
      "Transition to independent practice",
    ],
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
];

const CLINICAL_HOURS_BREAKDOWN: ClinicalHoursBreakdown[] = [
  {
    category: "Direct Patient Care",
    hours: 250,
    percentage: 50,
    description: "Face-to-face spiritual care with patients and families",
  },
  {
    category: "Clinical Supervision",
    hours: 100,
    percentage: 20,
    description: "Individual and group supervision sessions",
  },
  {
    category: "Case Documentation & Reflection",
    hours: 75,
    percentage: 15,
    description: "Writing case studies and theological reflection",
  },
  {
    category: "Institutional Participation",
    hours: 50,
    percentage: 10,
    description: "Team meetings, rounds, and professional development",
  },
  {
    category: "Continuing Education",
    hours: 25,
    percentage: 5,
    description: "Seminars, workshops, and learning activities",
  },
];

export default function CPEPathwayMap() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const currentPhase = PATHWAY_PHASES.find((p) => p.id === selectedPhase);
  const totalHours = PATHWAY_PHASES.reduce((sum, p) => sum + p.clinicalHours, 0);
  const completedHours = PATHWAY_PHASES.filter((p) => p.id < selectedPhase).reduce(
    (sum, p) => sum + p.clinicalHours,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav />
      <div className="container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CPE Pathway Map</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey through Clinical Pastoral Education: From orientation to certification
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 border-2 border-primary">
          <CardHeader>
            <CardTitle>Program Progress</CardTitle>
            <CardDescription>Total Clinical Hours Required: {totalHours} hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estimated Progress</span>
                <span className="font-semibold">
                  {completedHours} / {totalHours} hours
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedHours / totalHours) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pathway Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Program Timeline</h2>
          <div className="space-y-3">
            {PATHWAY_PHASES.map((phase, index) => (
              <div key={phase.id}>
                <button
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  className="w-full"
                >
                  <Card
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedPhase === phase.id ? "border-primary border-2" : ""
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                          {phase.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                Phase {phase.id}: {phase.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {phase.description}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <Badge variant="outline" className="mb-2">
                                {phase.duration}
                              </Badge>
                              <div className="text-sm font-semibold">
                                {phase.clinicalHours} hours
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>

                {/* Arrow between phases */}
                {index < PATHWAY_PHASES.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Phase Information */}
        {currentPhase && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Phase Details: {currentPhase.title}</h2>

            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Activities Tab */}
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Activities</CardTitle>
                    <CardDescription>
                      What you'll be doing during this phase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentPhase.activities.map((activity, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Outcomes Tab */}
              <TabsContent value="outcomes">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Outcomes</CardTitle>
                    <CardDescription>
                      What you'll achieve by the end of this phase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentPhase.outcomes.map((outcome, index) => (
                        <li key={index} className="flex gap-3">
                          <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Phase Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="text-muted-foreground">{currentPhase.duration}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Clinical Hours</h4>
                      <p className="text-muted-foreground">
                        {currentPhase.clinicalHours} hours of direct and supervised practice
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Focus</h4>
                      <p className="text-muted-foreground">
                        {currentPhase.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Clinical Hours Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Clinical Hours Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Hours Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CLINICAL_HOURS_BREAKDOWN.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">{item.category}</span>
                        <span className="text-muted-foreground">
                          {item.hours}h ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>What Each Category Includes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CLINICAL_HOURS_BREAKDOWN.map((item) => (
                  <div key={item.category}>
                    <h4 className="font-semibold text-sm mb-1">{item.category}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certification Requirements */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              CPE Certification Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Minimum Requirements</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>400+ clinical hours completed</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Regular clinical supervision</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Case studies and documentation</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Theological reflection</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Competency Areas</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Pastoral presence and listening</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Spiritual care provision</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Professional boundaries</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Cultural and interfaith competency</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
