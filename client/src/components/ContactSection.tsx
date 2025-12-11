import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Linkedin, Send, Loader2, CheckCircle } from "lucide-react";

const services = [
  "Career Guidance for Students",
  "Success Mindset Coaching",
  "Career Transition Coaching",
  "Interview Preparation",
  "Resume Building",
  "College Selection Guidance",
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const { toast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.service || "General Inquiry",
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-muted/30" data-testid="section-contact">
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
              Get in Touch
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your career? Let's start a conversation about your goals
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98336 57889"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      data-testid="input-contact-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interested In</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => handleChange("service", value)}
                    >
                      <SelectTrigger data-testid="select-contact-service">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your career goals and how we can help..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"
                  disabled={isSubmitting || isSubmitted}
                  data-testid="button-contact-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <a
                  href="mailto:manisha@globalcoachforyou.com"
                  className="flex items-center gap-4 group"
                  data-testid="link-contact-email"
                  data-hoverable
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground group-hover:text-purple-500 transition-colors">
                      manisha@globalcoachforyou.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+919833657889"
                  className="flex items-center gap-4 group"
                  data-testid="link-contact-phone"
                  data-hoverable
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground group-hover:text-purple-500 transition-colors">
                      +91 98336 57889
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">Mumbai, India</p>
                  </div>
                </div>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-testid="link-contact-linkedin"
                  data-hoverable
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <p className="font-medium text-foreground group-hover:text-purple-500 transition-colors">
                      Connect with me
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <Card className="p-6 border-purple-500/30 bg-gradient-to-br from-teal-600/10 to-amber-500/10">
              <h4 className="font-bold text-foreground mb-2">Book a Free Consultation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Not sure where to start? Book a complimentary 30-minute consultation to discuss your career goals.
              </p>
              <Button
                variant="outline"
                className="border-teal-600/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                data-testid="button-contact-free-consultation"
                onClick={() => {
                  window.open("https://calendly.com", "_blank");
                }}
              >
                Schedule Now
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
