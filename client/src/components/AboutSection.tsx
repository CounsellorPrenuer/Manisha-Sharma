import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, TrendingUp, Clock, GraduationCap, Briefcase, Target } from "lucide-react";
import manishaImage from "@assets/generated_images/manisha_sharma_professional_portrait.png";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

function AnimatedCounter({ end, suffix = "", label, icon }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [end, isInView]);

  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-3">
        {icon}
      </div>
      <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {count}{suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

const timeline = [
  { year: "2010", title: "Started Career Counseling", icon: GraduationCap },
  { year: "2015", title: "Founded Marichi World", icon: Briefcase },
  { year: "2018", title: "Certified Global Coach", icon: Award },
  { year: "2023", title: "500+ Success Stories", icon: Target },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 relative overflow-hidden" data-testid="section-about">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empowering individuals to discover their true potential and achieve career excellence
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30" />
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-purple-500/30">
                <img
                  src={manishaImage}
                  alt="Manisha Sharma"
                  className="w-full h-full object-cover"
                  data-testid="img-about-profile"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">Hi, I'm Manisha Sharma</h3>
            <p className="text-muted-foreground leading-relaxed">
              With over a decade of experience in career coaching, I've dedicated my life to 
              helping individuals navigate their professional journeys with confidence and clarity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              As the founder of Marichi World, I specialize in career guidance for students, 
              success mindset coaching, and professional development. My approach combines 
              psychological insights with practical strategies to help you achieve extraordinary results.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Career Guidance", "Mindset Coaching", "Interview Prep", "Resume Building"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <AnimatedCounter
            end={10}
            suffix="+"
            label="Years Experience"
            icon={<Clock className="h-6 w-6 text-purple-500" />}
          />
          <AnimatedCounter
            end={500}
            suffix="+"
            label="Students Coached"
            icon={<Users className="h-6 w-6 text-blue-500" />}
          />
          <AnimatedCounter
            end={95}
            suffix="%"
            label="Success Rate"
            icon={<TrendingUp className="h-6 w-6 text-pink-500" />}
          />
          <AnimatedCounter
            end={15}
            suffix="+"
            label="Awards Won"
            icon={<Award className="h-6 w-6 text-cyan-500" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-center mb-8">My Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500 hidden md:block" />
            
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-4 gap-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-3 mx-auto relative z-10">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-foreground">{item.year}</p>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
