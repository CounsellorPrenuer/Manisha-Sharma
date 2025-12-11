import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import manishaImage from "@assets/generated_images/manisha_sharma_professional_portrait.png";

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-pink-500/20 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-pink-900/30" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-4000" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Global Career Coach
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                Transform Your Career
              </span>
              <br />
              <span className="text-foreground">With Expert Guidance</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Unlock your true potential with personalized career coaching from Manisha Sharma. 
              Empowering students, professionals, and organizations to achieve extraordinary success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25"
                onClick={() => scrollToSection("#contact")}
                data-testid="button-hero-consultation"
              >
                Book Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-sm"
                onClick={() => scrollToSection("#services")}
                data-testid="button-hero-services"
              >
                Explore Services
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-pulse-glow" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white/20 dark:border-white/10 shadow-2xl animate-float">
                <img
                  src={manishaImage}
                  alt="Manisha Sharma - Career Coach"
                  className="w-full h-full object-cover"
                  data-testid="img-hero-profile"
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -left-4 top-1/4 bg-white dark:bg-card rounded-lg px-4 py-2 shadow-lg border border-border/50"
              >
                <p className="text-sm font-semibold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Students Coached</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -right-4 bottom-1/4 bg-white dark:bg-card rounded-lg px-4 py-2 shadow-lg border border-border/50"
              >
                <p className="text-sm font-semibold text-foreground">95%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollToSection("#about")}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-scroll-down"
          data-hoverable
        >
          <span className="text-sm">Scroll Down</span>
          <ChevronDown className="h-5 w-5 animate-scroll-indicator" />
        </button>
      </motion.div>
    </section>
  );
}
