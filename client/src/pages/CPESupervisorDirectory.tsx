import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";
import { Award, Users, BookOpen, Heart, Search } from "lucide-react";
import { useState } from "react";

interface Supervisor {
  id: string;
  name: string;
  credentials: string[];
  specializations: string[];
  yearsExperience: number;
  bio: string;
  certifications: string[];
}

const supervisors: Supervisor[] = [
  {
    id: "1",
    name: "Dr. Margaret Chen",
    credentials: ["D.Min.", "M.Div.", "B.A. in Psychology"],
    specializations: ["Healthcare Chaplaincy", "Trauma & Crisis Intervention", "Interfaith Ministry"],
    yearsExperience: 18,
    bio: "Dr. Chen is an ACPE-certified supervisor with extensive experience in hospital chaplaincy and clinical pastoral education. She specializes in training chaplains for complex healthcare environments.",
    certifications: ["ACPE Supervisor", "Board Certified Chaplain", "Trauma-Informed Care Specialist"]
  },
  {
    id: "2",
    name: "Rev. James Mitchell",
    credentials: ["M.Div.", "Certificate in Pastoral Counseling", "B.A. in Theology"],
    specializations: ["Military Chaplaincy", "Veteran Support", "Spiritual Formation"],
    yearsExperience: 22,
    bio: "Rev. Mitchell brings two decades of military chaplaincy experience, having served in multiple deployments. He is passionate about preparing chaplains to serve military personnel and their families.",
    certifications: ["ACPE Supervisor", "Military Chaplain Endorsement", "Spiritual Direction Certified"]
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    credentials: ["D.Min.", "M.Div.", "M.A. in Counseling"],
    specializations: ["Correctional Chaplaincy", "Restorative Justice", "Addiction Recovery"],
    yearsExperience: 16,
    bio: "Dr. Williams specializes in training chaplains for correctional facilities and has developed innovative programs for restorative justice and rehabilitation.",
    certifications: ["ACPE Supervisor", "Correctional Chaplain Certified", "Addiction Counselor"]
  },
  {
    id: "4",
    name: "Rev. David Okonkwo",
    credentials: ["M.Div.", "B.A. in Intercultural Studies", "Certificate in Chaplaincy"],
    specializations: ["Multicultural Ministry", "Immigration & Refugee Support", "Community Chaplaincy"],
    yearsExperience: 14,
    bio: "Rev. Okonkwo brings a unique perspective from his background in intercultural ministry. He specializes in preparing chaplains to serve diverse communities and immigrant populations.",
    certifications: ["ACPE Supervisor", "Multicultural Competency Specialist", "Community Chaplain"]
  },
  {
    id: "5",
    name: "Dr. Patricia Rodriguez",
    credentials: ["D.Min.", "M.Div.", "M.A. in Bioethics"],
    specializations: ["Hospice & Palliative Care", "End-of-Life Counseling", "Grief Support"],
    yearsExperience: 20,
    bio: "Dr. Rodriguez is an expert in hospice chaplaincy with a special focus on end-of-life care and grief support. She has trained hundreds of chaplains in compassionate end-of-life ministry.",
    certifications: ["ACPE Supervisor", "Hospice & Palliative Care Specialist", "Grief Counselor"]
  },
  {
    id: "6",
    name: "Rev. Michael Thompson",
    credentials: ["M.Div.", "B.A. in Theology", "Certificate in Organizational Leadership"],
    specializations: ["Corporate Chaplaincy", "Workplace Ministry", "Leadership Development"],
    yearsExperience: 12,
    bio: "Rev. Thompson specializes in corporate and workplace chaplaincy, helping organizations develop spiritual care programs for employees.",
    certifications: ["ACPE Supervisor", "Corporate Chaplain", "Organizational Leadership Certified"]
  }
];

export default function CPESupervisorDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const allSpecializations = Array.from(
    new Set(supervisors.flatMap(s => s.specializations))
  ).sort();

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
      supervisor.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicNav currentPage="about" />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">CPE Supervisor Directory</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Meet our team of ACPE-certified supervisors dedicated to providing exceptional clinical pastoral education and mentorship.
          </p>
        </div>
      </section>

      {/* About Supervisors */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">ACPE Certified</h3>
              <p className="text-muted-foreground">
                All our supervisors hold ACPE (Association for Clinical Pastoral Education) certification, ensuring world-class training standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Experienced Mentors</h3>
              <p className="text-muted-foreground">
                Our supervisors average 16+ years of clinical chaplaincy experience across diverse ministry settings.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Specialized Expertise</h3>
              <p className="text-muted-foreground">
                Our supervisors specialize in various chaplaincy contexts, from healthcare to military to correctional settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search supervisors by name or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">Filter by Specialization:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSpecialization(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSpecialization === null
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-foreground hover:bg-gray-200"
                  }`}
                >
                  All Specializations
                </button>
                {allSpecializations.map(spec => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSpecialization === spec
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredSupervisors.length} of {supervisors.length} supervisors
            </div>
          </div>
        </div>
      </section>

      {/* Supervisors Grid */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredSupervisors.map(supervisor => (
              <Card key={supervisor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">{supervisor.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-accent">
                        {supervisor.yearsExperience}+ years experience
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    {supervisor.bio}
                  </p>

                  {/* Credentials */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Credentials:</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervisor.credentials.map((cred, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50">
                          {cred}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Certifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervisor.certifications.map((cert, idx) => (
                        <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervisor.specializations.map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSupervisors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No supervisors found matching your criteria. Please adjust your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Commitment to Excellence</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Rigorous Training Standards</h3>
                <p className="text-foreground/80">
                  All supervisors maintain current ACPE certification and participate in ongoing professional development to stay current with best practices in clinical pastoral education.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Diverse Expertise</h3>
                <p className="text-foreground/80">
                  Our supervisors bring expertise across multiple chaplaincy contexts, allowing us to provide specialized training for your specific ministry calling.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Personalized Mentorship</h3>
                <p className="text-foreground/80">
                  Each supervisor is committed to providing individualized feedback and mentorship to help you develop your unique chaplaincy gifts and calling.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-3">Supportive Community</h3>
                <p className="text-foreground/80">
                  Our supervisors create a supportive learning environment where you can grow, reflect, and develop the spiritual and emotional resilience needed for chaplaincy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your CPE Journey?</h2>
          <p className="text-xl text-white/90 mb-8">
            Our supervisors are ready to guide you through exceptional clinical pastoral education and help you develop the skills needed for meaningful chaplaincy ministry.
          </p>
          <a href="/chaplaincy-training" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
            Explore Chaplaincy Training
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
