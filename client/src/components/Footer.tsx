import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook, ArrowRight, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/IMG_2510_-_Manisha_Sharma_1765429548944.png";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const services = [
  "Career Guidance",
  "Mindset Coaching",
  "Career Transition",
  "Interview Prep",
  "Resume Building",
  "College Selection",
];

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast({
        title: "Subscribed!",
        description: "You've been added to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative" data-testid="footer">
      <div className="h-1 bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500" />
      
      <div className="bg-card border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#home");
                }}
                className="flex items-center gap-3"
                data-testid="link-footer-logo"
              >
                <img src={logoImage} alt="Marichi World" className="h-14 w-14 object-contain" />
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
                  Marichi World
                </span>
              </a>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Empowering individuals to discover their true potential and achieve career excellence through personalized coaching and guidance.
              </p>
              
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300"
                    data-testid={`link-footer-social-${social.label.toLowerCase()}`}
                    data-hoverable
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                      data-testid={`link-footer-${link.label.toLowerCase()}`}
                      data-hoverable
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <a
                      href="#pricing"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("#pricing");
                      }}
                      className="text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                      data-hoverable
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get weekly career tips and insights delivered to your inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-newsletter-email"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"
                  data-testid="button-newsletter-subscribe"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 space-y-2">
                <a
                  href="mailto:manisha@globalcoachforyou.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                  data-hoverable
                >
                  <Mail className="h-4 w-4" />
                  manisha@globalcoachforyou.com
                </a>
                <a
                  href="tel:+919833657889"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                  data-hoverable
                >
                  <Phone className="h-4 w-4" />
                  +91 98336 57889
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Mumbai, India
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Marichi World. All rights reserved.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  In partnership with Mentoria for enhanced career guidance services.
                </p>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground underline mt-1 inline-block" data-testid="link-privacy-policy">
                  Privacy Policy
                </a>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-amber-500 fill-amber-500" /> by Manisha Sharma
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
