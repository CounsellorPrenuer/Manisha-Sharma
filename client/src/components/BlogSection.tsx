import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  color: string;
}

// todo: remove mock functionality - replace with real blog posts from API
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Key Skills Every Graduate Needs in 2024",
    excerpt: "Discover the essential skills that employers are looking for in fresh graduates entering the job market.",
    content: "In today's competitive job market, technical skills alone are not enough. Employers are seeking graduates who possess a combination of hard and soft skills that enable them to adapt and thrive in dynamic work environments. The five key skills include: 1) Digital literacy and data analysis, 2) Communication and collaboration, 3) Critical thinking and problem-solving, 4) Emotional intelligence, and 5) Adaptability and continuous learning. Let's explore each of these in detail...",
    category: "Career Tips",
    date: "Dec 5, 2024",
    readTime: "5 min read",
    color: "bg-purple-500",
  },
  {
    id: 2,
    title: "Building a Growth Mindset for Career Success",
    excerpt: "Learn how shifting your mindset can unlock unlimited potential in your professional journey.",
    content: "A growth mindset is the belief that your abilities can be developed through dedication and hard work. This view creates a love of learning and resilience essential for great accomplishment. Unlike a fixed mindset, which assumes our intelligence and talents are static, a growth mindset embraces challenges, persists through obstacles, learns from criticism, and finds inspiration in others' success. Here's how you can cultivate this powerful mindset...",
    category: "Mindset",
    date: "Dec 1, 2024",
    readTime: "7 min read",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "The Art of Acing Virtual Interviews",
    excerpt: "Master the nuances of video interviews with these proven strategies and tips.",
    content: "Virtual interviews have become the norm in today's hiring landscape. While they offer convenience, they also present unique challenges. To ace your virtual interview, you need to: 1) Create a professional environment with good lighting and neutral background, 2) Test your technology beforehand, 3) Maintain eye contact by looking at the camera, 4) Dress professionally from head to toe, and 5) Prepare for common technical issues. Here are detailed strategies...",
    category: "Interview",
    date: "Nov 28, 2024",
    readTime: "6 min read",
    color: "bg-pink-500",
  },
  {
    id: 4,
    title: "How to Choose the Right Career Path",
    excerpt: "A comprehensive guide to making informed decisions about your professional future.",
    content: "Choosing the right career path is one of the most important decisions you'll make in life. It affects not just your professional life but also your personal happiness and fulfillment. This guide covers: 1) Self-assessment techniques to understand your interests and values, 2) Researching career options that align with your profile, 3) Seeking mentorship and guidance, 4) Creating a long-term career plan, and 5) Being open to pivot when necessary...",
    category: "Career Guidance",
    date: "Nov 20, 2024",
    readTime: "8 min read",
    color: "bg-teal-500",
  },
  {
    id: 5,
    title: "Networking Tips for Introverts",
    excerpt: "Build meaningful professional connections without stepping out of your comfort zone.",
    content: "Networking doesn't have to be overwhelming for introverts. In fact, introverts often excel at building deeper, more meaningful connections. The key is to leverage your strengths: 1) Focus on quality over quantity in relationships, 2) Prepare conversation topics in advance, 3) Use written communication like LinkedIn messages, 4) Attend smaller, focused events, and 5) Follow up thoughtfully after initial meetings...",
    category: "Networking",
    date: "Nov 15, 2024",
    readTime: "5 min read",
    color: "bg-orange-500",
  },
  {
    id: 6,
    title: "Creating a Resume That Stands Out",
    excerpt: "Transform your resume from ordinary to extraordinary with these expert tips.",
    content: "Your resume is often the first impression you make on potential employers. To stand out in a sea of applicants, you need to: 1) Start with a compelling professional summary, 2) Quantify your achievements with specific metrics, 3) Use action verbs to describe your experience, 4) Tailor your resume for each application, and 5) Keep it clean, readable, and ATS-friendly. Here's a detailed breakdown of each element...",
    category: "Resume",
    date: "Nov 10, 2024",
    readTime: "6 min read",
    color: "bg-cyan-500",
  },
];

const categories = ["All", "Career Tips", "Mindset", "Interview", "Career Guidance", "Networking", "Resume"];

export function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-20" data-testid="section-blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Latest Articles
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and strategies to accelerate your career growth
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-blog-search"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0" : ""}
                data-testid={`button-blog-category-${category.toLowerCase().replace(" ", "-")}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card
                className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
                data-testid={`card-blog-${post.id}`}
              >
                <div className={`h-2 ${post.color}`} />
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto text-purple-500 hover:text-purple-600 hover:bg-transparent"
                    onClick={() => setSelectedPost(post)}
                    data-testid={`button-blog-read-more-${post.id}`}
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-teal-600/50 text-purple-600 dark:text-purple-400"
            onClick={() => {
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-blog-subscribe"
          >
            Subscribe for Updates
          </Button>
        </motion.div>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-blog-post">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedPost.category}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedPost.date}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedPost.title}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-4 whitespace-pre-wrap">
                  {selectedPost.content}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
