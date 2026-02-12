import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Calendar, User, Menu, X, Tag } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

export default function Blog() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const { data: posts, isLoading: postsLoading } = trpc.blog.getPublishedPosts.useQuery({
    categoryId: selectedCategory,
  });

  const { data: categories } = trpc.blog.getCategories.useQuery();

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Ministry Blog & News</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Insights, updates, and resources for ministry leaders and theological students
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <section className="bg-white border-b border-border py-6">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                onClick={() => setSelectedCategory(undefined)}
                size="sm"
              >
                All Posts
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          {postsLoading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading posts...</div>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">No blog posts available yet.</div>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                    {post.featuredImage && (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {!post.featuredImage && (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <Award className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
                        </div>
                        {post.authorName && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.authorName}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                      )}
                      {post.categoryName && (
                        <div className="mt-auto">
                          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                            {post.categoryName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
