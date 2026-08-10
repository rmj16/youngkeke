"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wifi, Utensils, Shield, Star, Headphones, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const services = [
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: "Premium Service",
      description: "Experience world-class hospitality with our award-winning cabin crew and premium amenities.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Wifi className="h-8 w-8 text-green-600" />,
      title: "In-Flight WiFi",
      description: "Stay connected with complimentary high-speed internet access throughout your journey.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      title: "Gourmet Dining",
      description: "Savor authentic Indonesian cuisine and international dishes prepared by renowned chefs.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Safety First",
      description: "Your safety is our priority with stringent health protocols and modern aircraft fleet.",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: <Headphones className="h-8 w-8 text-pink-600" />,
      title: "Entertainment",
      description: "Enjoy hundreds of movies, TV shows, music, and games on our state-of-the-art IFE system.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Gift className="h-8 w-8 text-indigo-600" />,
      title: "GarudaMiles",
      description: "Earn and redeem miles with our comprehensive loyalty program for exclusive benefits.",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
            Why Choose Garuda Indonesia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the exceptional services that make us Indonesia's flagship carrier 
            and one of the world's leading airlines.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                {/* Animated background gradient */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: hoveredIndex === index ? 0.1 : 0,
                    scale: hoveredIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-lg`}
                />
                
                <CardHeader className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg">
                      {service.icon}
                    </div>
                  </motion.div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>

                {/* Floating particles effect */}
                {hoveredIndex === index && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          y: [-20, -60],
                          x: [0, Math.random() * 40 - 20]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                        className="absolute top-4 left-1/2 w-2 h-2 bg-blue-400 rounded-full pointer-events-none"
                      />
                    ))}
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}