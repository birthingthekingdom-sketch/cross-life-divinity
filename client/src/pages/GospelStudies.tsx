import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Check, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PublicNav } from "@/components/PublicNav";

export default function GospelStudies() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);

  const gospels = [
    {
      title: "Matthew",
      description: "The Gospel of Matthew emphasizes Jesus as the promised Messiah and King. Written for a Jewish audience, it contains extensive teaching material, including the Sermon on the Mount.",
      themes: ["Messianic fulfillment", "Kingdom of Heaven", "Moral teachings", "Jesus as King"],
      chapters: 28,
    },
    {
      title: "Mark",
      description: "The Gospel of Mark is the shortest and most action-oriented Gospel. It emphasizes Jesus' mighty works and presents him as the powerful Son of God who came to serve.",
      themes: ["Jesus' authority", "Miracles and power", "Discipleship", "Servant leadership"],
      chapters: 16,
    },
    {
      title: "Luke",
      description: "Luke's Gospel emphasizes Jesus' compassion and concern for the marginalized. Written for Gentile readers, it highlights the role of the Holy Spirit and includes unique parables.",
      themes: ["Compassion for the lost", "Holy Spirit's role", "Salvation for all", "Social justice"],
      chapters: 24,
    },
    {
      title: "John",
      description: "John's Gospel is distinctly theological, emphasizing Jesus as the Word (Logos) and Son of God. It contains profound spiritual teachings and the famous 'I am' statements.",
      themes: ["Jesus as God's Son", "Eternal life", "Love and faith", "Spiritual truth"],
      chapters: 21,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <PublicNav currentPage="courses" />

      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500 text-white hover:bg-blue-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Biblical Foundations
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">Gospel Studies</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore the four Gospels—Matthew, Mark, Luke, and John—as part of our comprehensive New Testament Survey course. Understand the unique perspectives, themes, and teachings of each Gospel writer.
          </p>
        </div>

        {/* Gospel Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {gospels.map((gospel) => (
            <Card key={gospel.title} className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  {gospel.title}
                </CardTitle>
                <CardDescription className="text-slate-300 text-base">
                  {gospel.chapters} Chapters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-300 leading-relaxed">{gospel.description}</p>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Key Themes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {gospel.themes.map((theme) => (
                      <Badge key={theme} variant="outline" className="text-blue-300 border-blue-600">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Information */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 border-blue-700 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-white">New Testament Survey Course</CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Gospel Studies are covered in depth in our New Testament Survey course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 leading-relaxed">
                The Gospel Studies content is part of our comprehensive <strong>New Testament Survey</strong> course, which provides an in-depth examination of the New Testament books and their theological significance. This course includes detailed analysis of all four Gospels, their historical context, authorship, and their unique contributions to our understanding of Jesus Christ and early Christian theology.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Comprehensive Gospel Analysis</strong> - Deep dive into each Gospel's unique perspective and theology
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Historical Context</strong> - Understand the cultural and historical background of each Gospel
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Comparative Study</strong> - Explore similarities and differences between the Gospels
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Theological Insights</strong> - Discover the theological themes and messages of each Gospel writer
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">CLAC-Accredited</strong> - Earn recognized certificates upon completion
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-400">
                  <strong className="text-white">Course Code:</strong> BIB201 - New Testament Survey<br />
                  <strong className="text-white">Duration:</strong> 10 lessons<br />
                  <strong className="text-white">Hours:</strong> 40 CPD Hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Study the Gospels?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Enroll in the New Testament Survey course to get comprehensive Gospel Studies along with the rest of the New Testament curriculum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/course/BIB201")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View New Testament Survey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="border-blue-600 text-blue-300 hover:bg-blue-900/20"
              size="lg"
            >
              View Pricing Options
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
