import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Filter } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Active Listening",
    definition: "A communication technique where the listener fully concentrates on understanding the speaker's message, emotions, and underlying concerns without interrupting or formulating responses. In chaplaincy, active listening demonstrates respect, builds trust, and helps clients feel heard and validated.",
    category: "Communication",
    relatedTerms: ["Empathy", "Pastoral Presence"],
  },
  {
    term: "Acute Grief",
    definition: "The intense emotional response immediately following a significant loss. Characterized by shock, denial, anger, and sadness. In chaplaincy settings, acute grief requires immediate pastoral support and crisis intervention skills.",
    category: "Grief & Loss",
    relatedTerms: ["Bereavement", "Grief Counseling"],
  },
  {
    term: "Advocacy",
    definition: "The act of speaking on behalf of patients/clients to ensure their needs are met, their rights are protected, and their voices are heard within institutional systems. Chaplains often advocate for spiritual care, cultural sensitivity, and ethical treatment.",
    category: "Professional Practice",
    relatedTerms: ["Ethics", "Professional Boundaries"],
  },
  {
    term: "Bereavement",
    definition: "The period of mourning following a death. Bereavement support is a core chaplaincy function, including funeral rituals, memorial services, and ongoing grief counseling.",
    category: "Grief & Loss",
    relatedTerms: ["Acute Grief", "Grief Counseling"],
  },
  {
    term: "Boundary Setting",
    definition: "Establishing clear limits on professional relationships to maintain appropriate distance and prevent dual relationships. Essential for ethical chaplaincy practice and preventing burnout.",
    category: "Professional Practice",
    relatedTerms: ["Ethics", "Professional Boundaries"],
  },
  {
    term: "Burnout",
    definition: "Physical, emotional, and mental exhaustion resulting from prolonged stress and emotional demands. Common in chaplaincy due to exposure to suffering and death. Prevention requires intentional self-care practices.",
    category: "Self-Care",
    relatedTerms: ["Compassion Fatigue", "Self-Care"],
  },
  {
    term: "Chaplaincy",
    definition: "Professional spiritual care provided in institutional settings (hospitals, military, prisons, corporations) by trained, credentialed clergy or spiritual care professionals. Chaplains serve patients, clients, staff, and families.",
    category: "Fundamentals",
    relatedTerms: ["Pastoral Care", "Professional Practice"],
  },
  {
    term: "Clinical Hours",
    definition: "Documented time spent providing direct patient/client care, supervision, training, and professional development. CPE programs typically require 400+ clinical hours for certification.",
    category: "Training",
    relatedTerms: ["Clinical Pastoral Education", "Supervision"],
  },
  {
    term: "Clinical Pastoral Education (CPE)",
    definition: "A structured, supervised program combining theological education with clinical practice in institutional settings. CPE develops pastoral care competencies through direct experience and reflection.",
    category: "Training",
    relatedTerms: ["Clinical Hours", "Supervision"],
  },
  {
    term: "Clinical Supervision",
    definition: "Regular meetings between a chaplain and an experienced supervisor to reflect on clinical practice, receive feedback, process emotions, and develop professional skills. Typically weekly during CPE programs.",
    category: "Training",
    relatedTerms: ["Supervision", "Professional Development"],
  },
  {
    term: "Compassion Fatigue",
    definition: "Emotional and physical exhaustion resulting from empathetic engagement with suffering clients. Different from burnout; occurs even in early career stages. Requires active management through self-care.",
    category: "Self-Care",
    relatedTerms: ["Burnout", "Vicarious Trauma"],
  },
  {
    term: "Confidentiality",
    definition: "The ethical obligation to keep patient/client information private and protected. Essential for building trust and maintaining professional integrity. Bound by HIPAA and other legal requirements.",
    category: "Ethics",
    relatedTerms: ["Ethics", "Professional Boundaries"],
  },
  {
    term: "Crisis Intervention",
    definition: "Immediate, short-term support provided during acute crises (suicides, accidents, deaths, trauma). Chaplains provide emotional and spiritual support, assess safety, and connect clients with resources.",
    category: "Clinical Skills",
    relatedTerms: ["Trauma-Informed Care", "Safety Planning"],
  },
  {
    term: "Cultural Competency",
    definition: "The ability to work effectively with people from different cultural, ethnic, and religious backgrounds. Requires self-awareness, knowledge of diverse cultures, and commitment to cultural humility.",
    category: "Diversity",
    relatedTerms: ["Cultural Humility", "Multi-Faith Ministry"],
  },
  {
    term: "Empathy",
    definition: "The ability to understand and share the feelings of another person. Distinguished from sympathy (feeling sorry for someone). Empathy is foundational to effective pastoral care.",
    category: "Communication",
    relatedTerms: ["Active Listening", "Pastoral Presence"],
  },
  {
    term: "End-of-Life Care",
    definition: "Comprehensive care provided to dying patients and their families, including pain management, spiritual support, and preparation for death. Chaplains play a central role in end-of-life care.",
    category: "Clinical Skills",
    relatedTerms: ["Palliative Care", "Grief Support"],
  },
  {
    term: "Ethics",
    definition: "Principles and standards governing right and wrong conduct. Professional ethics guide chaplains in maintaining integrity, protecting clients, and serving the common good.",
    category: "Ethics",
    relatedTerms: ["Professional Boundaries", "Confidentiality"],
  },
  {
    term: "Grief",
    definition: "The emotional response to loss. Grief is normal, healthy, and highly individual. Chaplains provide grief support and help clients navigate the grief process.",
    category: "Grief & Loss",
    relatedTerms: ["Acute Grief", "Bereavement"],
  },
  {
    term: "Implicit Bias",
    definition: "Unconscious attitudes, stereotypes, and prejudices that influence behavior and decision-making. All humans have implicit biases; chaplains work to recognize and address them.",
    category: "Diversity",
    relatedTerms: ["Cultural Competency", "Self-Awareness"],
  },
  {
    term: "Interfaith",
    definition: "Involving or representing multiple faith traditions. Interfaith chaplaincy serves patients and clients from diverse religious backgrounds with respect and cultural sensitivity.",
    category: "Diversity",
    relatedTerms: ["Cultural Competency", "Multi-Faith Ministry"],
  },
  {
    term: "Mandatory Reporting",
    definition: "Legal requirement to report suspected abuse, neglect, or harm to authorities. Chaplains must understand mandatory reporting laws in their jurisdictions.",
    category: "Ethics",
    relatedTerms: ["Ethics", "Confidentiality"],
  },
  {
    term: "Mindfulness",
    definition: "Present-moment awareness without judgment. Chaplains cultivate mindfulness to enhance pastoral presence and help clients reduce anxiety and stress.",
    category: "Self-Care",
    relatedTerms: ["Meditation", "Self-Care"],
  },
  {
    term: "Moral Distress",
    definition: "Emotional and ethical discomfort when unable to act according to moral convictions due to institutional constraints. Chaplains help staff and clients process moral distress.",
    category: "Ethics",
    relatedTerms: ["Ethics", "Professional Practice"],
  },
  {
    term: "Palliative Care",
    definition: "Medical care focused on comfort and quality of life rather than cure, typically for serious or terminal illnesses. Chaplains are essential members of palliative care teams.",
    category: "Clinical Skills",
    relatedTerms: ["End-of-Life Care", "Grief Support"],
  },
  {
    term: "Pastoral Care",
    definition: "Spiritual and emotional support provided by clergy or trained spiritual care professionals. Includes presence, listening, prayer, ritual, and connection to faith resources.",
    category: "Fundamentals",
    relatedTerms: ["Chaplaincy", "Pastoral Presence"],
  },
  {
    term: "Pastoral Presence",
    definition: "The chaplain's authentic, compassionate presence with clients. Presence itself is healing; chaplains don't need to 'fix' problems but rather accompany clients in suffering.",
    category: "Communication",
    relatedTerms: ["Empathy", "Active Listening"],
  },
  {
    term: "Professional Boundaries",
    definition: "Clear limits defining appropriate professional relationships. Include physical, emotional, time, and role boundaries. Essential for ethical practice and preventing harm.",
    category: "Professional Practice",
    relatedTerms: ["Ethics", "Boundary Setting"],
  },
  {
    term: "Reflective Practice",
    definition: "Systematic reflection on clinical experiences to extract learning and improve practice. Core to CPE; involves examining what happened, why, and what was learned.",
    category: "Training",
    relatedTerms: ["Clinical Supervision", "Theological Reflection"],
  },
  {
    term: "Resilience",
    definition: "Ability to recover from adversity and adapt to challenges. Chaplains build resilience in clients and develop personal resilience to sustain long-term ministry.",
    category: "Self-Care",
    relatedTerms: ["Burnout Prevention", "Self-Care"],
  },
  {
    term: "Ritual",
    definition: "Structured, meaningful actions expressing spiritual or cultural significance. Chaplains facilitate rituals (prayer, blessing, memorial services) that provide comfort and meaning.",
    category: "Spiritual Practice",
    relatedTerms: ["Spiritual Care", "Pastoral Care"],
  },
  {
    term: "Safety Planning",
    definition: "Collaborative process developing strategies to keep someone safe from harm (suicide, self-harm, violence). Chaplains participate in safety planning for at-risk clients.",
    category: "Clinical Skills",
    relatedTerms: ["Crisis Intervention", "Trauma-Informed Care"],
  },
  {
    term: "Self-Awareness",
    definition: "Understanding one's own emotions, biases, strengths, and limitations. Essential for chaplains to provide effective care and maintain professional boundaries.",
    category: "Personal Development",
    relatedTerms: ["Implicit Bias", "Professional Boundaries"],
  },
  {
    term: "Self-Care",
    definition: "Intentional practices maintaining physical, emotional, and spiritual health. Essential for preventing burnout and sustaining long-term chaplaincy ministry.",
    category: "Self-Care",
    relatedTerms: ["Burnout Prevention", "Resilience"],
  },
  {
    term: "Spiritual Assessment",
    definition: "Systematic evaluation of a person's spiritual beliefs, practices, resources, and needs. Guides chaplains in providing spiritually appropriate care.",
    category: "Clinical Skills",
    relatedTerms: ["Spiritual Care", "Pastoral Care"],
  },
  {
    term: "Spiritual Distress",
    definition: "Emotional and spiritual suffering when beliefs are challenged, faith is questioned, or meaning is lost. Common in crisis and illness; chaplains address spiritual distress.",
    category: "Spiritual Practice",
    relatedTerms: ["Spiritual Care", "Crisis Intervention"],
  },
  {
    term: "Supervision",
    definition: "Structured relationship between chaplain and experienced supervisor focused on reflection, skill development, professional growth, emotional support, and quality assurance.",
    category: "Training",
    relatedTerms: ["Clinical Supervision", "Professional Development"],
  },
  {
    term: "Theological Reflection",
    definition: "Process of examining clinical experiences through theological and spiritual lenses. Integrates faith and practice; core to CPE learning.",
    category: "Training",
    relatedTerms: ["Reflective Practice", "Clinical Supervision"],
  },
  {
    term: "Therapeutic Presence",
    definition: "Chaplain's authentic, compassionate availability that facilitates healing. Presence itself is therapeutic; chaplains don't need specialized techniques.",
    category: "Communication",
    relatedTerms: ["Pastoral Presence", "Empathy"],
  },
  {
    term: "Trauma",
    definition: "Overwhelming experience causing emotional and psychological injury. Chaplains provide trauma-informed care recognizing trauma's impact on spiritual and emotional wellbeing.",
    category: "Clinical Skills",
    relatedTerms: ["Crisis Intervention", "Trauma-Informed Care"],
  },
  {
    term: "Trauma-Informed Care",
    definition: "Approach recognizing trauma's prevalence and impact, avoiding retraumatization, and building on survivors' strengths. Essential for chaplains working with trauma survivors.",
    category: "Clinical Skills",
    relatedTerms: ["Trauma", "Crisis Intervention"],
  },
  {
    term: "Unconditional Positive Regard",
    definition: "Accepting and valuing clients without judgment or conditions. Carl Rogers' concept foundational to effective pastoral care.",
    category: "Communication",
    relatedTerms: ["Empathy", "Pastoral Presence"],
  },
  {
    term: "Vicarious Trauma",
    definition: "Emotional impact of empathetically engaging with trauma survivors' stories. Similar to compassion fatigue; requires active management.",
    category: "Self-Care",
    relatedTerms: ["Compassion Fatigue", "Burnout"],
  },
];

const CATEGORIES = Array.from(new Set(GLOSSARY_TERMS.map((t) => t.category))).sort();

export default function CPEGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <PublicNav />
      <div className="container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CPE Glossary</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Essential terms and definitions for Clinical Pastoral Education and chaplaincy practice
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              All Categories
            </Button>
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {filteredTerms.length} term{filteredTerms.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => (
              <Card
                key={term.term}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{term.term}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {term.category}
                      </Badge>
                    </div>
                    <div className="text-2xl text-muted-foreground">
                      {expandedTerm === term.term ? "−" : "+"}
                    </div>
                  </div>
                </CardHeader>

                {expandedTerm === term.term && (
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {term.definition}
                    </p>

                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Related Terms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((relatedTerm) => (
                            <Badge
                              key={relatedTerm}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchTerm(relatedTerm);
                              }}
                            >
                              {relatedTerm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No terms found matching your search. Try different keywords or browse all categories.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto mt-12 text-center text-sm text-muted-foreground">
          <p>
            This glossary contains {GLOSSARY_TERMS.length} essential terms for CPE and chaplaincy practice.
            Click on any term to expand and see the full definition and related terms.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
