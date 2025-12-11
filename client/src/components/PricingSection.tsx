import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Feature {
  text: string;
  included: boolean;
}

interface Package {
  planName: string;
  price: number;
  features: Feature[];
  isPremium?: boolean;
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PricingSection() {
  const [activeCategory, setActiveCategory] = useState("8-9");
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const { toast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const currentCategory = categories.find((c) => c.id === activeCategory);

  const handleBuyNow = async (pkg: Package) => {
    setLoadingPackage(pkg.planName);

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pkg.price,
          planName: pkg.planName,
          category: currentCategory?.label,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Marichi World",
        description: `${pkg.planName} - ${currentCategory?.label}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              toast({
                title: "Payment Successful!",
                description: `You have successfully purchased ${pkg.planName}. We'll contact you shortly.`,
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast({
              title: "Verification Failed",
              description: "Please contact support with your payment details.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#8B5CF6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPackage(null);
    }
  };

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
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
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
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
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
                className={`relative p-8 h-full border-2 ${
                  pkg.isPremium
                    ? "border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
                    : "border-border/50"
                }`}
                data-testid={`card-pricing-${pkg.planName.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {pkg.isPremium && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
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
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
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
                        className={`text-sm ${
                          feature.included ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    pkg.isPremium
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                      : ""
                  }`}
                  variant={pkg.isPremium ? "default" : "outline"}
                  onClick={() => handleBuyNow(pkg)}
                  disabled={loadingPackage === pkg.planName}
                  data-testid={`button-buy-${pkg.planName.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {loadingPackage === pkg.planName ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
