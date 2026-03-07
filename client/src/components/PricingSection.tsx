import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PurchaseModal } from "./PurchaseModal";
import { API_BASE_URL } from "@/lib/api";

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

interface CustomPackage {
  planId: string;
  title: string;
  price: number;
  description: string;
  image?: any;
}

const fetchPricingData = async (): Promise<{ categories: Category[], customPackages: CustomPackage[] }> => {
  const [categories, customPackages] = await Promise.all([
    sanityClient.fetch(`*[_type == "pricingCategory"] | order(order asc) {
      id,
      label,
      packages[] {
        planName,
        price,
        paymentButtonId,
        isPremium,
        features[] {
          text,
          included
        }
      }
    }`),
    sanityClient.fetch(`*[_type == "customPackage"] | order(order asc) {
      planId,
      title,
      price,
      description,
      image
    }`)
  ]);

  return { categories, customPackages };
};

export function PricingSection() {
  const [activeCategory, setActiveCategory] = useState("8-9");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; buttonId: string } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data, isLoading } = useQuery({
    queryKey: ["pricingData"],
    queryFn: fetchPricingData,
  });

  const categories = data?.categories || [];
  const customPackages = data?.customPackages || [];

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];

  const handleBuyNow = (planName: string, price: number, paymentButtonId: string) => {
    setSelectedPlan({ name: planName, price, buttonId: paymentButtonId });
    setModalOpen(true);
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
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Invest In Your Future
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the perfect career coaching package tailored to your needs
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <>
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

                    <Button
                      onClick={() => handleBuyNow(pkg.planName, pkg.price, pkg.paymentButtonId)}
                      className={`w-full ${pkg.isPremium
                        ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white border-0 hover:opacity-90"
                        : "bg-gradient-to-r from-teal-600/80 to-emerald-500/80 text-white border-0 hover:opacity-90"
                        }`}
                      data-testid={`button-buy-${pkg.planName.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      Buy Now
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Custom Packages Section */}
        {!isLoading && customPackages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-32 border-t border-border/50 pt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Want To Customise Your Mentorship Plan?
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If you want to subscribe to specific services from Mentoria that resolve your career challenges, you can choose one or more of the following:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {customPackages.map((pkg) => (
                <Card
                  key={pkg.planId}
                  className="p-6 h-full flex flex-col justify-between border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 group"
                  data-testid={`card-custom-pricing-${pkg.planId}`}
                >
                  <div>
                    {pkg.image && (
                      <div className="mb-4 rounded-lg overflow-hidden aspect-video relative">
                        <img
                          src={urlFor(pkg.image).width(400).url()}
                          alt={pkg.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-purple-500 transition-colors">{pkg.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{pkg.description}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-600 hover:bg-purple-500/10"
                      onClick={() => handleBuyNow(pkg.title, pkg.price, "")}
                    >
                      Buy Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedPlan && (
        <PurchaseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          paymentButtonId={selectedPlan.buttonId}
        />
      )}
    </section>
  );
}
