import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown } from "lucide-react";

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  planName: string;
  price: number;
  features: Feature[];
  isPremium?: boolean;
  paymentButtonId: string;
}

interface Category {
  id: string;
  label: string;
  packages: Package[];
}

const categories: Category[] = [
  {
    id: "8-9",
    label: "8-9 Students",
    packages: [
      {
        planName: "Discover",
        price: 5500,
        paymentButtonId: "pl_RwDuOx96VYrsyN",
        features: [
          { text: "Psychometric assessment to measure your interests", included: true },
          { text: "1 career counselling session with expert career coaches", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Invites to live webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV building during internship/graduation", included: false },
        ],
      },
      {
        planName: "Discover Plus+",
        price: 15000,
        isPremium: true,
        paymentButtonId: "pl_RwDq8XpK76OhB3",
        features: [
          { text: "Psychometric assessments to measure your interests, personality and abilities", included: true },
          { text: "8 career counselling sessions (1 every year) until graduation", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Invites to live webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV building during internship/graduation", included: true },
        ],
      },
    ],
  },
  {
    id: "10-12",
    label: "10-12 Students",
    packages: [
      {
        planName: "Achieve Online",
        price: 5999,
        paymentButtonId: "pl_RwDxvLPQP7j4rG",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "1 career counselling session", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Pre-recorded webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV reviews during internship/graduation", included: false },
        ],
      },
      {
        planName: "Achieve Plus+",
        price: 10599,
        isPremium: true,
        paymentButtonId: "pl_RwDzfVkQYEdAIf",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "4 career counselling sessions", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Attend live webinars by industry experts", included: true },
          { text: "Customized reports after each session with education pathways", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV reviews during internship/graduation", included: true },
        ],
      },
    ],
  },
  {
    id: "college",
    label: "College Graduates",
    packages: [
      {
        planName: "Ascend Online",
        price: 6499,
        paymentButtonId: "pl_RwE1evNHrHWJDW",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "1 career counselling session", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Pre-recorded webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV reviews for job application", included: false },
        ],
      },
      {
        planName: "Ascend Plus+",
        price: 10599,
        isPremium: true,
        paymentButtonId: "pl_RwE3WEILWB9WeJ",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "3 career counselling sessions", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Attend live webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV reviews for job application", included: true },
        ],
      },
    ],
  },
  {
    id: "working",
    label: "Working Professionals",
    packages: [
      {
        planName: "Ascend Online",
        price: 6499,
        paymentButtonId: "pl_RwE1evNHrHWJDW",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "1 career counselling session", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Pre-recorded webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: false },
          { text: "Guidance on studying abroad", included: false },
          { text: "CV reviews for job application", included: false },
        ],
      },
      {
        planName: "Ascend Plus+",
        price: 10599,
        isPremium: true,
        paymentButtonId: "pl_RwE3WEILWB9WeJ",
        features: [
          { text: "Psychometric assessment to measure your interests, personality and abilities", included: true },
          { text: "2 career counselling sessions", included: true },
          { text: "Lifetime access to Knowledge Gateway", included: true },
          { text: "Attend live webinars by industry experts", included: true },
          { text: "Customized reports after each session with information on certificate/online courses", included: true },
          { text: "Guidance on studying abroad", included: true },
          { text: "CV reviews for job application", included: true },
        ],
      },
    ],
  },
];

const RazorpayButton = ({ paymentButtonId }: { paymentButtonId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;

    // Clear previous content to prevent duplicates if id changes
    formRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.dataset.payment_button_id = paymentButtonId;
    script.async = true;

    formRef.current.appendChild(script);
  }, [paymentButtonId]);

  return <form ref={formRef} className="flex justify-center" />;
};

export function PricingSection() {
  const [activeCategory, setActiveCategory] = useState("8-9");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <section id="pricing" className="py-20" data-testid="section-pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the perfect career coaching package tailored to your needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0"
                  : ""
              }
              data-testid={`button-pricing-tab-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {currentCategory?.packages.map((pkg, index) => (
            <motion.div
              key={pkg.planName}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`relative p-8 h-full border-2 ${pkg.isPremium
                    ? "border-teal-600/50 bg-gradient-to-br from-teal-600/5 to-amber-500/5"
                    : "border-border/50"
                  }`}
                data-testid={`card-pricing-${pkg.planName.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {pkg.isPremium && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {pkg.isPremium ? "Premium" : "Standard"}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{pkg.planName}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/50"
                          }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <RazorpayButton paymentButtonId={pkg.paymentButtonId} />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
