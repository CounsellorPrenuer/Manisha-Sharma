import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Brain,
  RefreshCw,
  Mic,
  FileText,
  School,
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

interface ServiceData {
  slug: string;
  icon: React.ElementType;
  title: string;
  description: string;
  details: string;
  color: string;
  benefits: string[];
  duration: string;
  sessions: string;
  rating: string;
}

const servicesData: ServiceData[] = [
  {
    slug: "career-guidance",
    icon: GraduationCap,
    title: "Career Guidance for Students",
    description: "Navigate academic choices and career paths with expert guidance tailored to your unique strengths.",
    details: "Our comprehensive career guidance program helps students discover their passions, understand their aptitudes, and make informed decisions about their academic and professional futures. We provide personalized assessments, one-on-one counseling, and actionable roadmaps to help you achieve your goals.",
    color: "from-purple-500 to-blue-500",
    benefits: [
      "Personalized aptitude and interest assessments",
      "One-on-one counseling sessions",
      "Career path mapping and goal setting",
      "Industry insights and market trends",
      "Actionable step-by-step roadmap",
      "Follow-up support and guidance",
    ],
    duration: "4-6 weeks",
    sessions: "6 sessions",
    rating: "4.9/5",
  },
  {
    slug: "mindset-coaching",
    icon: Brain,
    title: "Success Mindset Coaching",
    description: "Develop the mental frameworks and habits that drive exceptional achievement.",
    details: "Transform your thinking patterns to unlock your full potential. Our mindset coaching program covers goal setting, overcoming limiting beliefs, building resilience, and developing the psychological tools needed for sustained success in any field. Learn to think like the top performers in your industry.",
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Identify and overcome limiting beliefs",
      "Develop a growth-oriented mindset",
      "Build mental resilience and grit",
      "Create powerful daily habits",
      "Master emotional intelligence",
      "Achieve sustainable motivation",
    ],
    duration: "8 weeks",
    sessions: "8 sessions",
    rating: "4.8/5",
  },
  {
    slug: "career-transition",
    icon: RefreshCw,
    title: "Career Transition Coaching",
    description: "Seamlessly navigate career changes with confidence and strategic planning.",
    details: "Whether you're switching industries, returning to work, or seeking advancement, our transition coaching provides the strategic framework you need. We help you identify transferable skills, build new competencies, and create a compelling narrative for your next chapter.",
    color: "from-cyan-500 to-teal-500",
    benefits: [
      "Transferable skills assessment",
      "Industry research and analysis",
      "Personal branding strategy",
      "Networking roadmap",
      "Interview preparation for new field",
      "90-day transition action plan",
    ],
    duration: "6-8 weeks",
    sessions: "8 sessions",
    rating: "4.9/5",
  },
  {
    slug: "interview-preparation",
    icon: Mic,
    title: "Interview Preparation",
    description: "Master the art of interviewing with proven techniques and personalized practice.",
    details: "Our intensive interview preparation includes mock interviews, body language training, answer frameworks for common questions, and strategies for handling stress. We prepare you for both technical and behavioral interviews across industries, ensuring you make a lasting impression.",
    color: "from-teal-500 to-green-500",
    benefits: [
      "Mock interview sessions with feedback",
      "Body language and presentation coaching",
      "Answer frameworks for tough questions",
      "Stress management techniques",
      "Salary negotiation strategies",
      "Post-interview follow-up guidance",
    ],
    duration: "2-3 weeks",
    sessions: "4 sessions",
    rating: "5.0/5",
  },
  {
    slug: "resume-building",
    icon: FileText,
    title: "Resume Building",
    description: "Craft compelling resumes that stand out and tell your unique story.",
    details: "Your resume is your first impression. We help you create ATS-friendly, visually appealing resumes that highlight your achievements and potential. Our service includes LinkedIn optimization, cover letter writing, and personal branding to ensure you stand out in a competitive job market.",
    color: "from-orange-500 to-pink-500",
    benefits: [
      "ATS-optimized resume creation",
      "Achievement-focused content writing",
      "Professional formatting and design",
      "LinkedIn profile optimization",
      "Cover letter templates",
      "Personal branding strategy",
    ],
    duration: "1-2 weeks",
    sessions: "3 sessions",
    rating: "4.9/5",
  },
  {
    slug: "college-selection",
    icon: School,
    title: "College Selection Guidance",
    description: "Find the perfect educational institution to match your goals and aspirations.",
    details: "Making the right college choice is crucial for your career success. We provide comprehensive guidance on course selection, university research, application strategies, and scholarship opportunities both in India and abroad. Get expert advice to make this life-changing decision.",
    color: "from-pink-500 to-purple-500",
    benefits: [
      "Personalized college shortlisting",
      "Course and specialization guidance",
      "Application strategy planning",
      "Scholarship research and application",
      "Study abroad counseling",
      "Admission essay review",
    ],
    duration: "4-8 weeks",
    sessions: "6 sessions",
    rating: "4.8/5",
  },
];

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => setLocation("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-background" data-testid={`page-service-${slug}`}>
      <CustomCursor />
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              className="mb-8"
              onClick={() => setLocation("/")}
              data-testid="button-back-home"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} text-white shadow-lg`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                      {service.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">{service.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    <Users className="h-3 w-3" />
                    {service.sessions}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {service.rating}
                  </Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <h2 className="text-xl font-bold mb-4">About This Service</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.details}</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <h2 className="text-xl font-bold mb-6">What You'll Get</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="sticky top-24"
              >
                <Card className="p-6 border-border/50 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-6">
                    Take the first step towards your career goals. Book a consultation today and let's discuss how we can help you succeed.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                      onClick={() => setLocation("/#pricing")}
                      data-testid="button-service-book-now"
                    >
                      View Pricing
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500/50 text-purple-600 dark:text-purple-400"
                      onClick={() => setLocation("/#contact")}
                      data-testid="button-service-contact"
                    >
                      Contact Me
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground text-center">
                      Have questions? Call us at{" "}
                      <a href="tel:+919833657889" className="text-purple-500 hover:underline">
                        +91 98336 57889
                      </a>
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
