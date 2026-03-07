import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import maleStudentAvatar from "@assets/generated_images/male_student_testimonial_avatar.png";
import femaleStudentAvatar from "@assets/generated_images/female_student_testimonial_avatar.png";
import professionalMaleAvatar from "@assets/generated_images/professional_male_testimonial_avatar.png";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

// todo: remove mock functionality - replace with real testimonials from API
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rahul Mehta",
    role: "Engineering Student",
    image: maleStudentAvatar,
    content: "Manisha's guidance completely transformed my career perspective. Her insights helped me land my dream internship at a top tech company. The interview preparation sessions were invaluable!",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Marketing Professional",
    image: femaleStudentAvatar,
    content: "After feeling stuck in my career for years, Manisha helped me identify my true passions and make a successful transition to a new industry. Her mindset coaching gave me the confidence I needed.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Business Analyst",
    image: professionalMaleAvatar,
    content: "The resume building and interview prep services were game-changers. Manisha's attention to detail and understanding of what employers look for helped me secure multiple job offers.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length);
  const goToNext = () => goToSlide((currentIndex + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden" data-testid="section-testimonials">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 via-transparent to-amber-500/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              What My Clients Say
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from individuals who transformed their careers with my guidance
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <Quote className="absolute -top-8 -left-4 h-16 w-16 text-purple-500/20" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="p-8 md:p-12 border-2 border-transparent bg-gradient-to-r from-teal-600/10 via-emerald-500/10 to-amber-500/10 backdrop-blur-sm relative overflow-hidden"
                data-testid={`card-testimonial-${currentIndex}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 opacity-10" />
                <div className="absolute inset-[2px] bg-card rounded-lg" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/30">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                        data-testid={`img-testimonial-${currentIndex}`}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              size="icon"
              variant="outline"
              onClick={goToPrevious}
              className="rounded-full"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gradient-to-r from-teal-600 to-emerald-500 w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                  data-hoverable
                />
              ))}
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={goToNext}
              className="rounded-full"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
