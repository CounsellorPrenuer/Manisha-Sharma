import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Lightbulb,
  Target,
  Heart,
  Zap,
  Shield,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Personalized Approach",
    description: "Every coaching session is tailored to your unique goals, strengths, and circumstances.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Target,
    title: "Result-Oriented",
    description: "95% success rate with measurable outcomes and clear milestones for your growth.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Heart,
    title: "Holistic Development",
    description: "Focus on both professional skills and personal growth for lasting transformation.",
    color: "from-pink-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Actionable Strategies",
    description: "Practical, implementable advice that you can apply immediately in your career.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Confidential & Supportive",
    description: "A safe space to explore your aspirations with complete privacy and understanding.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Award,
    title: "Proven Expertise",
    description: "Over a decade of experience and internationally recognized coaching certifications.",
    color: "from-orange-500 to-pink-500",
  },
];

export function WhyChooseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-choose" className="py-20 bg-muted/30" data-testid="section-why-choose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              Why Choose Me
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What sets my coaching apart and drives exceptional results for my clients
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="p-6 h-full border-border/50 bg-card/50 backdrop-blur-sm group hover:shadow-lg transition-all duration-300"
                data-testid={`card-feature-${index}`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
