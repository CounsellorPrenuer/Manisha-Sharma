import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Users,
  CreditCard,
  Mail,
  MousePointer,
  TrendingUp,
  Eye,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Download,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  MessageSquare,
  Phone,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ContactSubmission, NewsletterSubscription, ButtonClick } from "@shared/schema";

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

interface ButtonInfo {
  id: string;
  name: string;
  section: string;
  action: string;
  clicks: number;
  lastClicked: string | null;
}

const allButtons: ButtonInfo[] = [
  { id: "nav-logo", name: "Logo", section: "Navigation", action: "Scroll to Home", clicks: 0, lastClicked: null },
  { id: "nav-home", name: "Home", section: "Navigation", action: "Scroll to Home", clicks: 0, lastClicked: null },
  { id: "nav-about", name: "About", section: "Navigation", action: "Scroll to About", clicks: 0, lastClicked: null },
  { id: "nav-services", name: "Services", section: "Navigation", action: "Scroll to Services", clicks: 0, lastClicked: null },
  { id: "nav-pricing", name: "Pricing", section: "Navigation", action: "Scroll to Pricing", clicks: 0, lastClicked: null },
  { id: "nav-testimonials", name: "Testimonials", section: "Navigation", action: "Scroll to Testimonials", clicks: 0, lastClicked: null },
  { id: "nav-blog", name: "Blog", section: "Navigation", action: "Scroll to Blog", clicks: 0, lastClicked: null },
  { id: "nav-contact", name: "Contact", section: "Navigation", action: "Scroll to Contact", clicks: 0, lastClicked: null },
  { id: "nav-book-consultation", name: "Book Consultation", section: "Navigation", action: "Scroll to Contact", clicks: 0, lastClicked: null },
  { id: "nav-theme-toggle", name: "Theme Toggle", section: "Navigation", action: "Toggle Dark/Light Mode", clicks: 0, lastClicked: null },
  { id: "nav-mobile-menu", name: "Mobile Menu", section: "Navigation", action: "Open Mobile Menu", clicks: 0, lastClicked: null },
  { id: "hero-book-consultation", name: "Book Consultation", section: "Hero", action: "Scroll to Contact", clicks: 0, lastClicked: null },
  { id: "hero-explore-services", name: "Explore Services", section: "Hero", action: "Scroll to Services", clicks: 0, lastClicked: null },
  { id: "hero-stats-students", name: "Students Coached Stat", section: "Hero", action: "Scroll to About", clicks: 0, lastClicked: null },
  { id: "hero-stats-success", name: "Success Rate Stat", section: "Hero", action: "Scroll to Testimonials", clicks: 0, lastClicked: null },
  { id: "hero-stats-experience", name: "Years Experience Stat", section: "Hero", action: "Scroll to About", clicks: 0, lastClicked: null },
  { id: "about-connect", name: "Let's Connect", section: "About", action: "Scroll to Contact", clicks: 0, lastClicked: null },
  { id: "service-learn-more-0", name: "Career Guidance - Learn More", section: "Services", action: "Navigate to /services/career-guidance", clicks: 0, lastClicked: null },
  { id: "service-learn-more-1", name: "Mindset Coaching - Learn More", section: "Services", action: "Navigate to /services/mindset-coaching", clicks: 0, lastClicked: null },
  { id: "service-learn-more-2", name: "Career Transition - Learn More", section: "Services", action: "Navigate to /services/career-transition", clicks: 0, lastClicked: null },
  { id: "service-learn-more-3", name: "Interview Prep - Learn More", section: "Services", action: "Navigate to /services/interview-preparation", clicks: 0, lastClicked: null },
  { id: "service-learn-more-4", name: "Resume Building - Learn More", section: "Services", action: "Navigate to /services/resume-building", clicks: 0, lastClicked: null },
  { id: "service-learn-more-5", name: "College Selection - Learn More", section: "Services", action: "Navigate to /services/college-selection", clicks: 0, lastClicked: null },
  { id: "pricing-tab-8-9", name: "8-9 Students Tab", section: "Pricing", action: "Show 8-9 Students Packages", clicks: 0, lastClicked: null },
  { id: "pricing-tab-10-12", name: "10-12 Students Tab", section: "Pricing", action: "Show 10-12 Students Packages", clicks: 0, lastClicked: null },
  { id: "pricing-tab-college", name: "College Tab", section: "Pricing", action: "Show College Graduate Packages", clicks: 0, lastClicked: null },
  { id: "pricing-tab-professional", name: "Professional Tab", section: "Pricing", action: "Show Working Professional Packages", clicks: 0, lastClicked: null },
  { id: "pricing-buy-standard", name: "Buy Standard Package", section: "Pricing", action: "Initiate Razorpay Payment", clicks: 0, lastClicked: null },
  { id: "pricing-buy-premium", name: "Buy Premium Package", section: "Pricing", action: "Initiate Razorpay Payment", clicks: 0, lastClicked: null },
  { id: "testimonial-prev", name: "Previous Testimonial", section: "Testimonials", action: "Show Previous Testimonial", clicks: 0, lastClicked: null },
  { id: "testimonial-next", name: "Next Testimonial", section: "Testimonials", action: "Show Next Testimonial", clicks: 0, lastClicked: null },
  { id: "testimonial-dot-0", name: "Testimonial Dot 1", section: "Testimonials", action: "Go to Testimonial 1", clicks: 0, lastClicked: null },
  { id: "testimonial-dot-1", name: "Testimonial Dot 2", section: "Testimonials", action: "Go to Testimonial 2", clicks: 0, lastClicked: null },
  { id: "testimonial-dot-2", name: "Testimonial Dot 3", section: "Testimonials", action: "Go to Testimonial 3", clicks: 0, lastClicked: null },
  { id: "why-choose-get-started", name: "Get Started Today", section: "Why Choose", action: "Scroll to Pricing", clicks: 0, lastClicked: null },
  { id: "blog-category-all", name: "All Category", section: "Blog", action: "Filter: Show All Articles", clicks: 0, lastClicked: null },
  { id: "blog-category-career-tips", name: "Career Tips Category", section: "Blog", action: "Filter: Career Tips", clicks: 0, lastClicked: null },
  { id: "blog-category-mindset", name: "Mindset Category", section: "Blog", action: "Filter: Mindset", clicks: 0, lastClicked: null },
  { id: "blog-category-interview", name: "Interview Category", section: "Blog", action: "Filter: Interview", clicks: 0, lastClicked: null },
  { id: "blog-read-more", name: "Read More", section: "Blog", action: "Open Blog Article Modal", clicks: 0, lastClicked: null },
  { id: "blog-subscribe", name: "Subscribe for Updates", section: "Blog", action: "Scroll to Contact", clicks: 0, lastClicked: null },
  { id: "contact-submit", name: "Send Message", section: "Contact", action: "Submit Contact Form", clicks: 0, lastClicked: null },
  { id: "contact-schedule", name: "Schedule Now", section: "Contact", action: "Open Calendly", clicks: 0, lastClicked: null },
  { id: "platform-book-consultation", name: "Book Consultation", section: "Platform", action: "Scroll to Pricing", clicks: 0, lastClicked: null },
  { id: "footer-newsletter", name: "Newsletter Subscribe", section: "Footer", action: "Subscribe to Newsletter", clicks: 0, lastClicked: null },
  { id: "footer-social-linkedin", name: "LinkedIn", section: "Footer", action: "Open LinkedIn Profile", clicks: 0, lastClicked: null },
  { id: "footer-social-twitter", name: "Twitter", section: "Footer", action: "Open Twitter Profile", clicks: 0, lastClicked: null },
  { id: "footer-social-instagram", name: "Instagram", section: "Footer", action: "Open Instagram Profile", clicks: 0, lastClicked: null },
  { id: "footer-social-facebook", name: "Facebook", section: "Footer", action: "Open Facebook Profile", clicks: 0, lastClicked: null },
];

export default function Admin() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: isAuthenticated,
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery<NewsletterSubscription[]>({
    queryKey: ["/api/admin/subscribers"],
    enabled: isAuthenticated,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<AdminPayment[]>({
    queryKey: ["/api/admin/payments"],
    enabled: isAuthenticated,
  });

  const { data: buttonClicks } = useQuery<ButtonClick[]>({
    queryKey: ["/api/admin/button-clicks"],
    enabled: isAuthenticated,
  });

  const handleLogin = () => {
    if (password === "marichi2024") {
      setIsAuthenticated(true);
      toast({ title: "Welcome!", description: "You've logged in to the admin dashboard." });
    } else {
      toast({ title: "Invalid Password", description: "Please enter the correct password.", variant: "destructive" });
    }
  };

  const handleExport = (type: string) => {
    toast({ title: "Export Started", description: `Exporting ${type} data...` });
  };

  const getButtonsWithClicks = (): ButtonInfo[] => {
    if (!buttonClicks) return allButtons;
    
    return allButtons.map(button => {
      const clickData = buttonClicks.find(c => c.buttonId === button.id);
      return {
        ...button,
        clicks: clickData?.clickCount || 0,
        lastClicked: clickData?.lastClicked || null,
      };
    });
  };

  const filteredButtons = getButtonsWithClicks().filter(
    (button) =>
      button.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      button.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      button.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = Array.from(new Set(allButtons.map((b) => b.section)));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Enter password to access</p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              data-testid="input-admin-password"
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
              onClick={handleLogin}
              data-testid="button-admin-login"
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setLocation("/")}
              data-testid="button-admin-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-admin">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-admin-home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchStats()}
                data-testid="button-admin-refresh"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
                data-testid="button-admin-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="p-4" data-testid="card-stat-visitors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Eye className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalVisitors || 0}</p>
                <p className="text-xs text-muted-foreground">Visitors</p>
              </div>
            </div>
          </Card>

          <Card className="p-4" data-testid="card-stat-clicks">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MousePointer className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalClicks || 0}</p>
                <p className="text-xs text-muted-foreground">Clicks</p>
              </div>
            </div>
          </Card>

          <Card className="p-4" data-testid="card-stat-contacts">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <MessageSquare className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalContacts || 0}</p>
                <p className="text-xs text-muted-foreground">Contacts</p>
              </div>
            </div>
          </Card>

          <Card className="p-4" data-testid="card-stat-subscribers">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Mail className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalSubscribers || 0}</p>
                <p className="text-xs text-muted-foreground">Subscribers</p>
              </div>
            </div>
          </Card>

          <Card className="p-4" data-testid="card-stat-payments">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalPayments || 0}</p>
                <p className="text-xs text-muted-foreground">Payments</p>
              </div>
            </div>
          </Card>

          <Card className="p-4" data-testid="card-stat-revenue">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          </Card>

          <Card className="p-4" data-testid="card-stat-conversion">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <BarChart3 className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="buttons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buttons" data-testid="tab-buttons">
              <MousePointer className="h-4 w-4 mr-2" />
              Buttons
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="subscribers" data-testid="tab-subscribers">
              <Mail className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">All Website Buttons</h2>
                  <Badge variant="secondary">{filteredButtons.length} buttons</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search buttons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                      data-testid="input-search-buttons"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleExport("buttons")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge
                  variant={searchQuery === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSearchQuery("")}
                >
                  All
                </Badge>
                {sections.map((section) => (
                  <Badge
                    key={section}
                    variant={searchQuery === section ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSearchQuery(section)}
                  >
                    {section}
                  </Badge>
                ))}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Button Name</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead>Last Clicked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredButtons.map((button) => (
                      <TableRow key={button.id} data-testid={`row-button-${button.id}`}>
                        <TableCell className="font-medium">{button.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{button.section}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                          {button.action}
                        </TableCell>
                        <TableCell className="text-right font-bold">{button.clicks}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {button.lastClicked ? new Date(button.lastClicked).toLocaleString() : "Never"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">Contact Submissions</h2>
                  <Badge variant="secondary">{contacts?.length || 0} submissions</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("contacts")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {contactsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : contacts?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No contact submissions yet.</div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts?.map((contact) => (
                        <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">{contact.subject}</TableCell>
                          <TableCell>
                            <Badge variant={contact.status === "new" ? "default" : "secondary"}>
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
                  <Badge variant="secondary">{subscribers?.length || 0} subscribers</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("subscribers")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {subscribersLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : subscribers?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No subscribers yet.</div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscribed On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers?.map((subscriber) => (
                        <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>
                            <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                              {subscriber.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">Payment History</h2>
                  <Badge variant="secondary">{payments?.length || 0} transactions</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport("payments")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {paymentsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : payments?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payments yet.</div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments?.map((payment) => (
                        <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                          <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                          <TableCell className="font-medium">{payment.packageName}</TableCell>
                          <TableCell>₹{payment.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={payment.status === "completed" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}
                              className="flex items-center gap-1 w-fit"
                            >
                              {payment.status === "completed" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : payment.status === "pending" ? (
                                <Clock className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.email}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
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
