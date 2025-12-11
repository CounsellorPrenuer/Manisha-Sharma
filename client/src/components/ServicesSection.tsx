import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  GraduationCap,
  Brain,
  RefreshCw,
  Mic,
  FileText,
  School,
  ArrowRight,
} from "lucide-react";

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  slug: string;
  color: string;
}

const services: Service[] = [
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Career Guidance for Students",
    description: "Navigate academic choices and career paths with expert guidance tailored to your unique strengths.",
    slug: "career-guidance",
    color: "from-teal-600 to-emerald-500",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Success Mindset Coaching",
    description: "Develop the mental frameworks and habits that drive exceptional achievement.",
    slug: "mindset-coaching",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <RefreshCw className="h-8 w-8" />,
    title: "Career Transition Coaching",
    description: "Seamlessly navigate career changes with confidence and strategic planning.",
    slug: "career-transition",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: <Mic className="h-8 w-8" />,
    title: "Interview Preparation",
    description: "Master the art of interviewing with proven techniques and personalized practice.",
    slug: "interview-preparation",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Resume Building",
    description: "Craft compelling resumes that stand out and tell your unique story.",
    slug: "resume-building",
    color: "from-orange-500 to-pink-500",
  },
  {
    icon: <School className="h-8 w-8" />,
    title: "College Selection Guidance",
    description: "Find the perfect educational institution to match your goals and aspirations.",
    slug: "college-selection",
    color: "from-pink-500 to-purple-500",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-20 bg-muted/30" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Services Offered
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coaching solutions designed to accelerate your professional growth
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="group relative p-6 h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                data-testid={`card-service-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg" />
                
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} text-white mb-4 shadow-lg`}
                >
                  {service.icon}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>

                <Link href={`/services/${service.slug}`}>
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto text-purple-500 hover:text-purple-600 hover:bg-transparent"
                    data-testid={`button-service-learn-more-${index}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
