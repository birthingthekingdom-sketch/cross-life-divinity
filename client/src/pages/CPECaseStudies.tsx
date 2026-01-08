import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";

interface CaseStudy {
  id: number;
  title: string;
  setting: string;
  description: string;
  scenario: string;
  context: string[];
  discussionQuestions: string[];
  themes: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    title: "End-of-Life Decisions",
    setting: "Healthcare Chaplaincy",
    description: "Navigating family conflict around treatment decisions",
    scenario: `Maria Santos is a 78-year-old woman admitted to the hospital with advanced pancreatic cancer. She has been receiving chemotherapy for six months with minimal improvement. Her oncologist has recommended stopping treatment and transitioning to palliative care. Maria's adult children are divided: her son wants to continue aggressive treatment, while her daughter supports stopping treatment. Maria is in significant pain and appears exhausted.

You are called to visit Maria and her family. Maria's daughter says, "Mom wants to stop fighting, but my brother won't listen. Can you help him understand?" Maria's son says, "I'm not ready to give up. There might be clinical trials." Maria herself says quietly, "I'm so tired. I just want to be comfortable."`,
    context: [
      "Maria is Catholic; her faith is important to her",
      "She has been married for 52 years; her husband is present but quiet",
      "She has three grandchildren she wants to see graduate",
      "The family is experiencing significant conflict",
      "Maria's pain is not well-controlled",
      "The medical team is waiting for family consensus before changing the treatment plan",
    ],
    discussionQuestions: [
      "What spiritual concerns might Maria be experiencing? How would you assess her spiritual needs and resources?",
      "How do you understand the family conflict? What theological or spiritual themes might underlie the disagreement?",
      "What is your role as chaplain in this situation? What are you NOT called to do?",
      "What ethical principles are at play (autonomy, beneficence, justice)? How do they conflict?",
      "How would you respond to each family member? What would you say to Maria? To her son? To her daughter?",
      "What are appropriate boundaries for you as chaplain? Where might you be tempted to overstep?",
      "What personal feelings or experiences might this case trigger for you? How might your own beliefs about death affect your ministry?",
      "How would you communicate with the medical team about the family's needs?",
      "What spiritual or religious rituals might support this family? How could you facilitate them?",
      "How would you continue supporting this family after the treatment decision is made?",
    ],
    themes: ["End-of-Life Care", "Family Dynamics", "Ethical Dilemmas", "Grief Support"],
  },
  {
    id: 2,
    title: "Combat Trauma and Moral Injury",
    setting: "Military Chaplaincy",
    description: "Supporting a soldier struggling with guilt after combat decisions",
    scenario: `Captain James Mitchell is a 32-year-old Army officer who recently returned from a 15-month deployment in a combat zone. He served as a squad leader and made tactical decisions that resulted in civilian casualties. While the incident was investigated and deemed within rules of engagement, James struggles with guilt and questions whether his decisions were morally right.

Since returning home, James has been withdrawn, irritable, and having nightmares. He's drinking heavily and has distanced himself from his wife and two young children. His unit commander referred him to you, the military chaplain, noting that James "needs to get his head straight."

James initially resists meeting with you, saying, "I don't need to talk about it. I just need to move on." When you persist gently, he says, "I followed orders. I did my job. But I can't stop thinking about the families."`,
    context: [
      "James comes from a strong Christian faith background",
      "His wife is concerned about his drinking and emotional distance",
      "His unit is preparing for another deployment in six months",
      "There's pressure from command to get James 'combat-ready'",
      "James feels isolated from peers who don't understand his struggle",
      "He's questioning his faith and God's presence",
    ],
    discussionQuestions: [
      "How do you understand the difference between combat trauma (PTSD) and moral injury? What are the spiritual dimensions?",
      "How might James's faith be affected by his experience? What theological questions might he be wrestling with?",
      "What is your role as military chaplain? How do you balance loyalty to the military with pastoral care for James?",
      "How do you handle the tension between James's wellbeing and military readiness?",
      "How would you respond to James's initial resistance? What would you say?",
      "How might you support James's wife and children? What are their spiritual and emotional needs?",
      "How could you connect James with other veterans who understand moral injury?",
      "When would you refer James to a mental health professional? How would you coordinate care?",
      "What spiritual practices or resources might help James process his experience?",
      "How would you support James if he decides to leave the military? If he stays?",
    ],
    themes: ["Combat Trauma", "Moral Injury", "Faith Crisis", "Military Culture"],
  },
  {
    id: 3,
    title: "Redemption and Justice",
    setting: "Correctional Chaplaincy",
    description: "Supporting rehabilitation while honoring victim's pain",
    scenario: `Marcus Johnson is a 34-year-old man incarcerated for armed robbery. He is serving a 12-year sentence and has completed 8 years. He has been a model prisoner—participating in education programs, working in the prison kitchen, and mentoring younger inmates. He has become a Christian during his incarceration and is deeply involved in the prison chapel.

Marcus approaches you and says, "Chaplain, I've changed. I'm not the same person who committed that crime. I want to make amends to my victim and to society. I'm applying for parole, and I want to know how to live a Christian life when I get out."

However, you learn that Marcus's victim, Mr. Chen, was severely traumatized by the robbery and has requested that Marcus not be paroled. Mr. Chen has written a victim impact statement expressing his ongoing fear and trauma.

Marcus says, "I understand Mr. Chen's pain. I caused it. But I can't change the past. I can only change the future. How do I live out my faith when I get out?"`,
    context: [
      "Marcus has no family support on the outside",
      "He has completed GED, vocational training, and anger management",
      "The prison has limited reentry resources",
      "Mr. Chen is part of a victim advocacy group",
      "Marcus's parole hearing is in three months",
      "He is genuinely seeking spiritual transformation",
    ],
    discussionQuestions: [
      "How do you understand the tension between redemption (Marcus's transformation) and justice (Mr. Chen's harm and ongoing trauma)?",
      "How do you assess whether Marcus's spiritual transformation is genuine? What signs would indicate authentic change vs. manipulation?",
      "How do you honor Mr. Chen's trauma and fear while supporting Marcus's rehabilitation?",
      "What is your role as chaplain? Are you an advocate for Marcus? For the victim? For justice?",
      "What spiritual and practical support could you offer Marcus for reentry?",
      "Is reconciliation between Marcus and Mr. Chen possible or appropriate? What would that look like?",
      "How would you help a church community welcome Marcus after his release?",
      "What are appropriate boundaries with Marcus? How do you maintain professional distance while offering pastoral care?",
      "How does your theology of forgiveness, repentance, and justice inform your response?",
      "How do you address systemic injustices in the criminal justice system while supporting individuals?",
    ],
    themes: ["Redemption", "Justice", "Reconciliation", "Reentry Support"],
  },
  {
    id: 4,
    title: "Workplace Crisis Response",
    setting: "Corporate Chaplaincy",
    description: "Supporting employees after a serious workplace accident",
    scenario: `You are a corporate chaplain for a mid-sized manufacturing company. An employee, David, suffered a serious accident on the factory floor and is in critical condition at the hospital. The accident occurred because safety protocols were not followed, and there's already talk of lawsuits and investigations.

The company's HR director asks you to visit David's family at the hospital and "help them understand the company's position" and "prevent them from talking to lawyers." David's coworkers are traumatized and productivity has dropped. Some employees are angry, feeling the company prioritizes profit over safety.

David's wife, Jennifer, is devastated and angry. She says, "This didn't have to happen. The company knew those machines were dangerous. They cut corners to save money." She's also worried about medical bills and lost income.`,
    context: [
      "David is unconscious and on life support",
      "Jennifer has two young children at home",
      "David's coworkers witnessed the accident",
      "The company is facing potential lawsuits",
      "There's tension between corporate interests and employee wellbeing",
      "You're being asked to serve corporate interests while providing pastoral care",
    ],
    discussionQuestions: [
      "How do you navigate the tension between your employer (the company) and your pastoral care responsibilities?",
      "What are appropriate boundaries in this situation? What should you NOT do?",
      "How would you support Jennifer without serving corporate interests?",
      "How would you support traumatized employees?",
      "How do you address the company's safety failures while maintaining your position?",
      "When is it appropriate to advocate for employees? What are the limits?",
      "What information should remain confidential? What should be shared with the company?",
      "What spiritual support could you offer Jennifer and the family?",
      "When would you refer Jennifer to a lawyer, counselor, or other professional?",
      "How would you support the company and employees in processing this tragedy and preventing future incidents?",
    ],
    themes: ["Conflict of Interest", "Workplace Safety", "Advocacy", "Corporate Ethics"],
  },
  {
    id: 5,
    title: "Religious Conflict in Healthcare",
    setting: "Interfaith Chaplaincy",
    description: "Respecting religious practices while maintaining medical care",
    scenario: `You are a chaplain in a hospital serving a diverse population. You're called to visit Amira, a 45-year-old Muslim woman admitted with complications from diabetes. Her family has requested that she not be visited by male chaplains and that she have prayer space for daily prayers.

However, the hospital's chaplaincy department is understaffed, and there are no female Muslim chaplains available. The hospital administrator suggests that you (a male Christian chaplain) visit anyway, saying "Just be respectful of her beliefs."

Amira's family is concerned about her spiritual care and whether the hospital respects their faith. The medical team is frustrated with what they perceive as "religious demands" interfering with medical care.`,
    context: [
      "Amira speaks English but prefers Arabic for spiritual matters",
      "Her family includes her husband, adult children, and extended family",
      "The hospital has limited resources for interfaith chaplaincy",
      "There's tension between medical protocols and religious practices",
      "Amira is anxious about her health and her family's wellbeing",
      "The hospital has no Muslim chaplain on staff",
    ],
    discussionQuestions: [
      "How do you approach Amira's situation with cultural humility rather than cultural competence?",
      "What are appropriate boundaries for you as a male Christian chaplain visiting a Muslim woman?",
      "How do you honor Amira's religious needs while working within hospital constraints?",
      "How do you work with Amira's family to support her spiritual care?",
      "What systemic changes would improve interfaith chaplaincy in your hospital?",
      "How would you collaborate with community Muslim leaders or chaplains?",
      "How would you help the medical team understand the importance of religious practices?",
      "What are your honest limitations in serving Amira spiritually?",
      "When is it appropriate to advocate for Amira's religious needs? What are the limits?",
      "What would you need to learn to better serve Muslim patients?",
    ],
    themes: ["Interfaith Care", "Cultural Competency", "Religious Accommodation", "Systemic Change"],
  },
];

export default function CPECaseStudies() {
  const [selectedCase, setSelectedCase] = useState<number | null>(CASE_STUDIES[0].id);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const currentCase = CASE_STUDIES.find((c) => c.id === selectedCase);

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav />
      <div className="container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CPE Case Studies</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Realistic scenarios for learning and reflection across diverse chaplaincy settings
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Case Study List */}
          <div className="lg:col-span-1">
            <div className="space-y-2 sticky top-4">
              {CASE_STUDIES.map((caseStudy) => (
                <Button
                  key={caseStudy.id}
                  variant={selectedCase === caseStudy.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => setSelectedCase(caseStudy.id)}
                >
                  <div>
                    <div className="font-semibold text-sm">{caseStudy.title}</div>
                    <div className="text-xs text-muted-foreground">{caseStudy.setting}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Case Study Content */}
          <div className="lg:col-span-3">
            {currentCase && (
              <div className="space-y-6">
                {/* Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-3xl mb-2">{currentCase.title}</CardTitle>
                        <CardDescription className="text-base">{currentCase.description}</CardDescription>
                      </div>
                      <Badge className="whitespace-nowrap">{currentCase.setting}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentCase.themes.map((theme) => (
                        <Badge key={theme} variant="secondary">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="scenario" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="scenario">Scenario</TabsTrigger>
                    <TabsTrigger value="context">Context</TabsTrigger>
                    <TabsTrigger value="questions">Discussion</TabsTrigger>
                  </TabsList>

                  {/* Scenario Tab */}
                  <TabsContent value="scenario">
                    <Card>
                      <CardHeader>
                        <CardTitle>Case Scenario</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                          {currentCase.scenario}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Context Tab */}
                  <TabsContent value="context">
                    <Card>
                      <CardHeader>
                        <CardTitle>Clinical Context</CardTitle>
                        <CardDescription>
                          Important background information for understanding this case
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {currentCase.context.map((item, index) => (
                            <li key={index} className="flex gap-3">
                              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Discussion Questions Tab */}
                  <TabsContent value="questions">
                    <Card>
                      <CardHeader>
                        <CardTitle>Discussion Questions</CardTitle>
                        <CardDescription>
                          Reflection prompts for individual or group learning
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {currentCase.discussionQuestions.map((question, index) => (
                          <div key={index} className="border rounded-lg">
                            <button
                              onClick={() => toggleQuestion(index)}
                              className="w-full p-4 text-left hover:bg-accent/50 transition-colors flex items-start justify-between gap-3"
                            >
                              <span className="font-semibold text-sm flex-1">{question}</span>
                              {expandedQuestions.has(index) ? (
                                <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              )}
                            </button>
                            {expandedQuestions.has(index) && (
                              <div className="px-4 pb-4 text-sm text-muted-foreground border-t">
                                <p>
                                  Take time to reflect on this question. Consider your own experiences, beliefs, and values.
                                  Discuss with a supervisor, peer group, or mentor for deeper learning.
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Learning Tips */}
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      How to Use This Case Study
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      <strong>Individual Reflection:</strong> Read the scenario and spend 20-30 minutes reflecting on the discussion questions. Journal your thoughts, feelings, and questions.
                    </p>
                    <p>
                      <strong>Group Discussion:</strong> Present the scenario to a group of chaplains or students. Discuss different perspectives and approaches. Share experiences from your own practice.
                    </p>
                    <p>
                      <strong>Supervision:</strong> Bring this case to supervision. Discuss how it relates to your clinical practice. Explore your emotional reactions and biases.
                    </p>
                    <p>
                      <strong>Training:</strong> Use case studies to teach chaplaincy competencies. Develop role-plays based on scenarios. Practice difficult conversations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
