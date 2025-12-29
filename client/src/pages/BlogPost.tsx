import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { Award, Calendar, User, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: post, isLoading } = trpc.blog.getPostBySlug.useQuery({
    slug: slug || "",
  }, {
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Award className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">Cross Life School of Divinity</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/catalog" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Courses
              </Link>
              <Link href="/learning-paths" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Learning Paths
              </Link>
              <Link href="/pricing" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                Pricing
              </Link>
              <Link href="/blog" className="text-primary font-semibold cursor-pointer">
                Blog
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium">
                About
              </Link>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-white">
              <div className="py-4 space-y-2">
                <Link href="/catalog">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Courses
                  </div>
                </Link>
                <Link href="/learning-paths">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Learning Paths
                  </div>
                </Link>
                <Link href="/pricing">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </div>
                </Link>
                <Link href="/blog">
                  <div className="px-4 py-2 bg-accent/10 text-primary font-semibold cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    Blog
                  </div>
                </Link>
                <Link href="/about">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </div>
                </Link>
                <Link href="/faq">
                  <div className="px-4 py-2 hover:bg-accent/10 transition-colors cursor-pointer font-medium" onClick={() => setMobileMenuOpen(false)}>
                    FAQ
                  </div>
                </Link>
                <div className="px-4 pt-4 pb-2 border-t border-border space-y-2">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-primary hover:bg-primary/90 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Blog Post Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading post...</div>
            </div>
          ) : !post ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">Post not found</div>
            </div>
          ) : (
            <article>
              {post.featuredImage && (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden mb-8">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                  </div>
                )}
                {post.authorName && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>By {post.authorName}</span>
                  </div>
                )}
                {post.categoryName && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                    {post.categoryName}
                  </span>
                )}
              </div>

              <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 italic border-l-4 border-primary pl-4">
                  {post.excerpt}
                </p>
              )}

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          )}
        </div>
      </section>

      {/* Related Posts CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore More Articles</h2>
          <Link href="/blog">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View All Blog Posts
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
