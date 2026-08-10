"use client";

import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      title: "Services",
      links: [
        "Flight Booking",
        "Check-in Online", 
        "Manage Booking",
        "Flight Status",
        "GarudaMiles"
      ]
    },
    {
      title: "Support", 
      links: [
        "Help Center",
        "Contact Us",
        "Baggage Info", 
        "Travel Guidelines",
        "Special Assistance"
      ]
    }
  ];

  const socialIcons = [
    { icon: <Facebook className="h-5 w-5" />, color: "hover:text-blue-500" },
    { icon: <Twitter className="h-5 w-5" />, color: "hover:text-blue-400" },
    { icon: <Instagram className="h-5 w-5" />, color: "hover:text-pink-500" },
    { icon: <Youtube className="h-5 w-5" />, color: "hover:text-red-500" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-blue-400 mb-4 cursor-pointer"
            >
              Garuda Indonesia
            </motion.h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Indonesia's national airline connecting you to the world with 
              excellence and Indonesian hospitality.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full bg-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services & Support */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: "#60A5FA" }}
                      className="text-gray-300 hover:text-blue-400 transition-all duration-300 block"
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+62 21 2351 9999</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@garuda-indonesia.com</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <div className="p-2 bg-blue-600/20 rounded-lg mr-3 mt-1">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Jl. Medan Merdeka Selatan No.13<br />Jakarta 10110, Indonesia</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-700/50 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 Garuda Indonesia. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ color: "#60A5FA", y: -1 }}
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={scrollToTop}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 shadow-2xl backdrop-blur-sm rounded-full w-12 h-12"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </footer>
  );
}