import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";

export default function Accreditation() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav currentPage="about" />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-foreground">Accreditation</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Learn about Cross Life School of Divinity's accreditation and recognition.
          </p>
          <p className="text-muted-foreground">
            This page is coming soon. Please check back later for more information about our accreditation status and credentials.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
