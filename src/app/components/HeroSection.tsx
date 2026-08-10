"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, Plane, Users, ArrowRightLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";
import { useState } from "react";

export function HeroSection() {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <section id="book" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
          alt="Airplane flying above clouds"
          className="w-full h-full object-cover scale-110"
        />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-black"
        />
        
        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-20 w-6 h-6 bg-blue-400/30 rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
          >
            Fly with Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Experience world-class service and comfort with YOUNKEKE AIR. 
            Your journey to extraordinary destinations begins here.
          </motion.p>
        </motion.div>

        {/* Enhanced Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="backdrop-blur-lg bg-white/95 shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-8">
              {/* Trip Type Toggle */}
              <div className="flex items-center space-x-6 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRoundTrip(true)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    isRoundTrip
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Round Trip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRoundTrip(false)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    !isRoundTrip
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  One Way
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* From */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2 lg:col-span-1"
                >
                  <Label htmlFor="from" className="text-gray-700">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                    <Select value={fromCity} onValueChange={setFromCity}>
                      <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Departure city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jakarta">Jakarta (CGK)</SelectItem>
                        <SelectItem value="bali">Bali (DPS)</SelectItem>
                        <SelectItem value="surabaya">Surabaya (MLG)</SelectItem>
                        <SelectItem value="medan">Medan (KNO)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Swap Button */}
                <div className="flex items-end lg:col-span-1 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapCities}
                    className="h-12 w-12 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-colors"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* To */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2 lg:col-span-1"
                >
                  <Label htmlFor="to" className="text-gray-700">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                    <Select value={toCity} onValueChange={setToCity}>
                      <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Destination city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="singapore">Singapore (SIN)</SelectItem>
                        <SelectItem value="tokyo">Tokyo (NRT)</SelectItem>
                        <SelectItem value="sydney">Sydney (SYD)</SelectItem>
                        <SelectItem value="london">London (LHR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Departure Date */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2 lg:col-span-1"
                >
                  <Label htmlFor="departure" className="text-gray-700">
                    {isRoundTrip ? "Departure" : "Date"}
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                    <Input
                      type="date"
                      id="departure"
                      className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </motion.div>

                {/* Return Date (conditional) */}
                {isRoundTrip && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className="space-y-2 lg:col-span-1"
                  >
                    <Label htmlFor="return" className="text-gray-700">Return</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                      <Input
                        type="date"
                        id="return"
                        className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Passengers */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`space-y-2 ${isRoundTrip ? "lg:col-span-1" : "lg:col-span-1"}`}
                >
                  <Label htmlFor="passengers" className="text-gray-700">Passengers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                    <Select>
                      <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="1 Adult" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4+ Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 shadow-lg hover:shadow-xl transition-all duration-300" 
                  size="lg"
                >
                  <Plane className="mr-3 h-5 w-5" />
                  Search Flights
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
