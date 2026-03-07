import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart3,
  CreditCard,
  Mail,
  TrendingUp,
  Eye,
  ArrowLeft,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Star,
  FileText,
  Plus,
  Trash2,
  Edit,
  Upload,
  Image,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ContactSubmission, NewsletterSubscription, Review, BlogPost } from "@shared/schema";

interface AdminPayment {
  id: string;
  orderId: string;
  paymentId: string | null;
  amount: number;
  currency: string;
  planName: string;
  packageName: string;
  category: string;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  email: string;
  customerPhone: string | null;
  createdAt: string;
}

interface AdminStats {
  totalVisitors: number;
  totalClicks: number;
  totalContacts: number;
  totalSubscribers: number;
  totalPayments: number;
  totalRevenue: number;
  conversionRate: number;
  popularButtons: { name: string; clicks: number }[];
}

const blogCategories = ["Career Tips", "Mindset", "Interview", "Resume", "Success Stories"];

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({
    name: "", role: "", company: "", content: "", rating: 5, imageUrl: "", isActive: true,
  });
  
  const [blogForm, setBlogForm] = useState({
    title: "", excerpt: "", content: "", category: "Career Tips", imageUrl: "", author: "Manisha Sharma", readTime: "5 min read", isPublished: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  const { data: stats, refetch: refetchStats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery<NewsletterSubscription[]>({
    queryKey: ["/api/admin/subscribers"],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<AdminPayment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
  });

  const { data: blogs, isLoading: blogsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blogs"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: typeof reviewForm) => {
      return apiRequest("/api/admin/reviews", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setReviewDialogOpen(false);
      resetReviewForm();
      toast({ title: "Review created successfully!" });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Review> }) => {
      return apiRequest(`/api/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setReviewDialogOpen(false);
      setEditingReview(null);
      resetReviewForm();
      toast({ title: "Review updated successfully!" });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/reviews/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review deleted successfully!" });
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: typeof blogForm) => {
      return apiRequest("/api/admin/blogs", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blogs"] });
      setBlogDialogOpen(false);
      resetBlogForm();
      toast({ title: "Blog post created successfully!" });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
      return apiRequest(`/api/admin/blogs/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blogs"] });
      setBlogDialogOpen(false);
      setEditingBlog(null);
      resetBlogForm();
      toast({ title: "Blog post updated successfully!" });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/blogs/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blogs"] });
      toast({ title: "Blog post deleted successfully!" });
    },
  });

  const resetReviewForm = () => {
    setReviewForm({ name: "", role: "", company: "", content: "", rating: 5, imageUrl: "", isActive: true });
  };

  const resetBlogForm = () => {
    setBlogForm({ title: "", excerpt: "", content: "", category: "Career Tips", imageUrl: "", author: "Manisha Sharma", readTime: "5 min read", isPublished: false });
  };

  const handleImageUpload = async (file: File, type: "review" | "blog") => {
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (data.imageUrl) {
        if (type === "review") {
          setReviewForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
        } else {
          setBlogForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
        }
        toast({ title: "Image uploaded successfully!" });
      }
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };

  const generateBlogContent = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const topics = [
      { title: "5 Essential Skills for Career Success in 2024", excerpt: "Discover the key competencies that will set you apart in today's competitive job market.", content: "In today's rapidly evolving job market, staying ahead requires a strategic approach to skill development. Here are five essential skills that will help you thrive...\n\n1. **Adaptability and Resilience**: The ability to pivot and embrace change is more valuable than ever. Companies seek professionals who can navigate uncertainty with grace.\n\n2. **Digital Literacy**: Beyond basic computer skills, understanding data analytics, AI tools, and digital collaboration platforms is crucial.\n\n3. **Emotional Intelligence**: The capacity to understand and manage emotions—both yours and others'—is key to effective leadership and teamwork.\n\n4. **Critical Thinking**: In an age of information overload, the ability to analyze, evaluate, and synthesize information is invaluable.\n\n5. **Continuous Learning Mindset**: The most successful professionals are those who view learning as a lifelong journey rather than a destination." },
      { title: "Mastering the Art of Networking: A Guide for Introverts", excerpt: "Learn how to build meaningful professional connections without stepping outside your comfort zone.", content: "Networking doesn't have to be about working the room at crowded events. For introverts, there are equally effective—and often more authentic—ways to build your professional network...\n\n**Quality Over Quantity**: Focus on building deeper connections with fewer people rather than collecting business cards.\n\n**Leverage Online Platforms**: LinkedIn and professional forums allow you to connect thoughtfully and at your own pace.\n\n**One-on-One Meetings**: Coffee chats are often more productive and less overwhelming than large networking events.\n\n**Listen More**: Introverts' natural tendency to listen is actually a superpower in networking. People remember those who truly heard them." },
      { title: "From Burnout to Breakthrough: Reclaiming Your Career Joy", excerpt: "Practical strategies to overcome workplace exhaustion and rediscover passion in your professional life.", content: "Burnout has become increasingly common in our always-connected world. But it doesn't have to define your career story...\n\n**Recognize the Signs**: Chronic fatigue, cynicism, and reduced productivity are key indicators that you need to make changes.\n\n**Set Boundaries**: Learn to say no to tasks that don't align with your priorities or capacity.\n\n**Reconnect with Your 'Why'**: Remember what initially drew you to your field and find ways to incorporate more of those elements.\n\n**Prioritize Self-Care**: Sleep, exercise, and time with loved ones aren't luxuries—they're necessities for sustainable success.\n\n**Seek Support**: Whether through coaching, therapy, or mentorship, having someone in your corner makes the journey easier." },
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setBlogForm(prev => ({
      ...prev,
      title: randomTopic.title,
      excerpt: randomTopic.excerpt,
      content: randomTopic.content,
    }));
    
    setIsGenerating(false);
    toast({ title: "Blog content generated!" });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-admin">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-admin-home"><ArrowLeft className="h-5 w-5" /></Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">Admin Dashboard</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchStats()} data-testid="button-admin-refresh"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-500/10"><Eye className="h-5 w-5 text-purple-500" /></div><div><p className="text-2xl font-bold">{stats?.totalVisitors || 0}</p><p className="text-xs text-muted-foreground">Visitors</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-pink-500/10"><MessageSquare className="h-5 w-5 text-pink-500" /></div><div><p className="text-2xl font-bold">{stats?.totalContacts || 0}</p><p className="text-xs text-muted-foreground">Contacts</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-cyan-500/10"><Mail className="h-5 w-5 text-cyan-500" /></div><div><p className="text-2xl font-bold">{stats?.totalSubscribers || 0}</p><p className="text-xs text-muted-foreground">Subscribers</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/10"><CreditCard className="h-5 w-5 text-green-500" /></div><div><p className="text-2xl font-bold">{stats?.totalPayments || 0}</p><p className="text-xs text-muted-foreground">Payments</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-yellow-500/10"><TrendingUp className="h-5 w-5 text-yellow-500" /></div><div><p className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</p><p className="text-xs text-muted-foreground">Revenue</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-orange-500/10"><BarChart3 className="h-5 w-5 text-orange-500" /></div><div><p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p><p className="text-xs text-muted-foreground">Conversion</p></div></div></Card>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="reviews"><Star className="h-4 w-4 mr-2" />Reviews</TabsTrigger>
            <TabsTrigger value="blogs"><FileText className="h-4 w-4 mr-2" />Blogs</TabsTrigger>
            <TabsTrigger value="contacts"><MessageSquare className="h-4 w-4 mr-2" />Contacts</TabsTrigger>
            <TabsTrigger value="subscribers"><Mail className="h-4 w-4 mr-2" />Subscribers</TabsTrigger>
            <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-2" />Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4"><h2 className="text-xl font-bold">Manage Reviews</h2><Badge variant="secondary">{reviews?.length || 0} reviews</Badge></div>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                  <DialogTrigger asChild><Button className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"><Plus className="h-4 w-4 mr-2" />Add Review</Button></DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editingReview ? "Edit Review" : "Add New Review"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" /></div>
                        <div className="space-y-2"><Label>Role</Label><Input value={reviewForm.role} onChange={e => setReviewForm(p => ({ ...p, role: e.target.value }))} placeholder="Software Engineer" /></div>
                      </div>
                      <div className="space-y-2"><Label>Company</Label><Input value={reviewForm.company} onChange={e => setReviewForm(p => ({ ...p, company: e.target.value }))} placeholder="Tech Corp" /></div>
                      <div className="space-y-2"><Label>Review Content</Label><Textarea value={reviewForm.content} onChange={e => setReviewForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Write the review..." /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Rating</Label><Select value={String(reviewForm.rating)} onValueChange={v => setReviewForm(p => ({ ...p, rating: Number(v) }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n} Star{n > 1 ? "s" : ""}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Active</Label><div className="flex items-center gap-2 h-9"><Switch checked={reviewForm.isActive} onCheckedChange={v => setReviewForm(p => ({ ...p, isActive: v }))} /><span className="text-sm text-muted-foreground">{reviewForm.isActive ? "Visible" : "Hidden"}</span></div></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Profile Image</Label>
                        <div className="flex items-center gap-2">
                          <Input value={reviewForm.imageUrl} onChange={e => setReviewForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL or upload" />
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], "review")} />
                          <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /></Button>
                        </div>
                        {reviewForm.imageUrl && <img src={reviewForm.imageUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover" />}
                      </div>
                      <Button className="w-full" onClick={() => editingReview ? updateReviewMutation.mutate({ id: editingReview.id, data: reviewForm }) : createReviewMutation.mutate(reviewForm)} disabled={createReviewMutation.isPending || updateReviewMutation.isPending}>{(createReviewMutation.isPending || updateReviewMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingReview ? "Update Review" : "Create Review"}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {reviewsLoading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> : reviews?.length === 0 ? <div className="text-center py-8 text-muted-foreground">No reviews yet. Add your first review!</div> : (
                <div className="grid md:grid-cols-2 gap-4">
                  {reviews?.map(review => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {review.imageUrl ? <img src={review.imageUrl} alt={review.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold">{review.name.charAt(0)}</div>}
                          <div><p className="font-medium">{review.name}</p><p className="text-sm text-muted-foreground">{review.role} at {review.company}</p></div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingReview(review); setReviewForm({ name: review.name, role: review.role, company: review.company, content: review.content, rating: review.rating, imageUrl: review.imageUrl || "", isActive: review.isActive }); setReviewDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteReviewMutation.mutate(review.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                      <p className="text-sm mt-3 text-muted-foreground line-clamp-2">{review.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}</div>
                        <Badge variant={review.isActive ? "default" : "secondary"}>{review.isActive ? "Active" : "Hidden"}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4"><h2 className="text-xl font-bold">Manage Blog Posts</h2><Badge variant="secondary">{blogs?.length || 0} posts</Badge></div>
                <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
                  <DialogTrigger asChild><Button className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"><Plus className="h-4 w-4 mr-2" />Add Blog Post</Button></DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingBlog ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={generateBlogContent} disabled={isGenerating} className="flex-1"><Sparkles className="h-4 w-4 mr-2" />{isGenerating ? "Generating..." : "Generate Blog Content"}</Button>
                      </div>
                      <div className="space-y-2"><Label>Title</Label><Input value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))} placeholder="Blog post title..." /></div>
                      <div className="space-y-2"><Label>Excerpt</Label><Textarea value={blogForm.excerpt} onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))} rows={2} placeholder="Brief summary..." /></div>
                      <div className="space-y-2"><Label>Content</Label><Textarea value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} rows={8} placeholder="Full blog content..." /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Category</Label><Select value={blogForm.category} onValueChange={v => setBlogForm(p => ({ ...p, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{blogCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Read Time</Label><Input value={blogForm.readTime} onChange={e => setBlogForm(p => ({ ...p, readTime: e.target.value }))} placeholder="5 min read" /></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <div className="flex items-center gap-2">
                          <Input value={blogForm.imageUrl} onChange={e => setBlogForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL or upload" />
                          <input type="file" ref={blogFileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], "blog")} />
                          <Button variant="outline" size="icon" onClick={() => blogFileInputRef.current?.click()}><Upload className="h-4 w-4" /></Button>
                        </div>
                        {blogForm.imageUrl && <img src={blogForm.imageUrl} alt="Preview" className="h-32 w-full rounded-lg object-cover" />}
                      </div>
                      <div className="flex items-center gap-2"><Switch checked={blogForm.isPublished} onCheckedChange={v => setBlogForm(p => ({ ...p, isPublished: v }))} /><Label>Publish immediately</Label></div>
                      <Button className="w-full" onClick={() => editingBlog ? updateBlogMutation.mutate({ id: editingBlog.id, data: blogForm }) : createBlogMutation.mutate(blogForm)} disabled={createBlogMutation.isPending || updateBlogMutation.isPending}>{(createBlogMutation.isPending || updateBlogMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingBlog ? "Update Post" : "Create Post"}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {blogsLoading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> : blogs?.length === 0 ? <div className="text-center py-8 text-muted-foreground">No blog posts yet. Create your first post!</div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blogs?.map(post => (
                    <Card key={post.id} className="overflow-hidden">
                      {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="h-32 w-full object-cover" /> : <div className="h-32 w-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center"><Image className="h-8 w-8 text-white/50" /></div>}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2"><Badge variant="secondary">{post.category}</Badge><Badge variant={post.isPublished ? "default" : "outline"}>{post.isPublished ? "Published" : "Draft"}</Badge></div>
                        <h3 className="font-medium line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingBlog(post); setBlogForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, imageUrl: post.imageUrl || "", author: post.author, readTime: post.readTime, isPublished: post.isPublished }); setBlogDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteBlogMutation.mutate(post.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6"><div className="flex items-center gap-4"><h2 className="text-xl font-bold">Contact Submissions</h2><Badge variant="secondary">{contacts?.length || 0} submissions</Badge></div><Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button></div>
              {contactsLoading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> : contacts?.length === 0 ? <div className="text-center py-8 text-muted-foreground">No contact submissions yet.</div> : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>{contacts?.map(contact => (<TableRow key={contact.id}><TableCell className="font-medium">{contact.name}</TableCell><TableCell>{contact.email}</TableCell><TableCell>{contact.phone || "-"}</TableCell><TableCell className="max-w-xs truncate">{contact.subject}</TableCell><TableCell><Badge variant={contact.status === "new" ? "default" : "secondary"}>{contact.status}</Badge></TableCell><TableCell className="text-muted-foreground text-sm">{new Date(contact.createdAt).toLocaleDateString()}</TableCell></TableRow>))}</TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6"><div className="flex items-center gap-4"><h2 className="text-xl font-bold">Newsletter Subscribers</h2><Badge variant="secondary">{subscribers?.length || 0} subscribers</Badge></div><Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button></div>
              {subscribersLoading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> : subscribers?.length === 0 ? <div className="text-center py-8 text-muted-foreground">No subscribers yet.</div> : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Subscribed On</TableHead></TableRow></TableHeader>
                    <TableBody>{subscribers?.map(subscriber => (<TableRow key={subscriber.id}><TableCell className="font-medium">{subscriber.email}</TableCell><TableCell><Badge variant={subscriber.isActive ? "default" : "secondary"}>{subscriber.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell className="text-muted-foreground text-sm">{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell></TableRow>))}</TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6"><div className="flex items-center gap-4"><h2 className="text-xl font-bold">Payment History</h2><Badge variant="secondary">{payments?.length || 0} transactions</Badge></div><Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button></div>
              {paymentsLoading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> : payments?.length === 0 ? <div className="text-center py-8 text-muted-foreground">No payments yet.</div> : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Package</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Email</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>{payments?.map(payment => (<TableRow key={payment.id}><TableCell className="font-mono text-sm">{payment.orderId}</TableCell><TableCell className="font-medium">{payment.packageName}</TableCell><TableCell>₹{payment.amount}</TableCell><TableCell><Badge variant={payment.status === "paid" ? "default" : payment.status === "created" ? "secondary" : "destructive"} className="flex items-center gap-1 w-fit">{payment.status === "paid" ? <CheckCircle className="h-3 w-3" /> : payment.status === "created" ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}{payment.status}</Badge></TableCell><TableCell>{payment.email}</TableCell><TableCell className="text-muted-foreground text-sm">{new Date(payment.createdAt).toLocaleDateString()}</TableCell></TableRow>))}</TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
