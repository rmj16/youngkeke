"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar,
  MapPin,
  Plane,
  Users,
  ArrowRightLeft,
  Armchair,
  Ticket,
  ClipboardCheck,
  Search,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";

export function HeroSection() {
  const navigate = useNavigate();
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
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-20 w-6 h-6 bg-blue-400/30 rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16">
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
            가루다 인도네시아와 함께하는 세계 최고 수준의 여정.
            지금 항공권을 예약하고 특별한 목적지로 떠나보세요.
          </motion.p>
        </motion.div>

        {/* Booking / Lookup / Check-in Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="backdrop-blur-lg bg-white/95 shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="w-full h-auto grid grid-cols-3 gap-2 bg-gray-100 p-1.5 rounded-2xl mb-8">
                  <TabsTrigger
                    value="search"
                    className="h-11 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600"
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    항공권 예약
                  </TabsTrigger>
                  <TabsTrigger
                    value="lookup"
                    className="h-11 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600"
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    예약 조회
                  </TabsTrigger>
                  <TabsTrigger
                    value="checkin"
                    className="h-11 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600"
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    체크인
                  </TabsTrigger>
                </TabsList>

                {/* ---------- 항공권 예약 (Search) ---------- */}
                <TabsContent value="search" className="mt-0">
                  {/* Trip type toggle */}
                  <div className="flex items-center space-x-3 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRoundTrip(true)}
                      className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
                        isRoundTrip
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      왕복
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRoundTrip(false)}
                      className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
                        !isRoundTrip
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      편도
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* From + swap + To */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:col-span-2">
                      <div className="space-y-2">
                        <Label className="text-gray-700">출발지</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                          <Select value={fromCity} onValueChange={setFromCity}>
                            <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                              <SelectValue placeholder="출발 도시 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jakarta">자카르타 (CGK)</SelectItem>
                              <SelectItem value="bali">발리 (DPS)</SelectItem>
                              <SelectItem value="surabaya">수라바야 (SUB)</SelectItem>
                              <SelectItem value="seoul">서울 (ICN)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={swapCities}
                        className="h-12 w-12 mb-0 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-colors shrink-0"
                        aria-label="출발지와 도착지 교환"
                      >
                        <ArrowRightLeft className="h-5 w-5" />
                      </motion.button>

                      <div className="space-y-2">
                        <Label className="text-gray-700">도착지</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                          <Select value={toCity} onValueChange={setToCity}>
                            <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                              <SelectValue placeholder="도착 도시 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="singapore">싱가포르 (SIN)</SelectItem>
                              <SelectItem value="tokyo">도쿄 (NRT)</SelectItem>
                              <SelectItem value="sydney">시드니 (SYD)</SelectItem>
                              <SelectItem value="london">런던 (LHR)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Departure date */}
                    <div className="space-y-2">
                      <Label htmlFor="departure" className="text-gray-700">가는 날</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Input
                          type="date"
                          id="departure"
                          className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Return date (round-trip only) */}
                    <div className="space-y-2">
                      <Label htmlFor="return" className="text-gray-700">오는 날</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Input
                          type="date"
                          id="return"
                          disabled={!isRoundTrip}
                          className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="space-y-2">
                      <Label className="text-gray-700">인원수</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Select>
                          <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder="성인 1명" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">성인 1명</SelectItem>
                            <SelectItem value="2">성인 2명</SelectItem>
                            <SelectItem value="3">성인 3명</SelectItem>
                            <SelectItem value="4">성인 4명 이상</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Seat class */}
                    <div className="space-y-2">
                      <Label className="text-gray-700">좌석</Label>
                      <div className="relative">
                        <Armchair className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Select>
                          <SelectTrigger className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder="이코노미" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">이코노미</SelectItem>
                            <SelectItem value="premium">프리미엄 이코노미</SelectItem>
                            <SelectItem value="business">비즈니스</SelectItem>
                            <SelectItem value="first">퍼스트</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => navigate("/booking")}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <Plane className="mr-3 h-5 w-5" />
                      항공편 검색
                    </Button>
                  </motion.div>
                </TabsContent>

                {/* ---------- 예약 조회 (Lookup) ---------- */}
                <TabsContent value="lookup" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="lookup-pnr" className="text-gray-700">예약 번호</Label>
                      <div className="relative">
                        <Ticket className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Input
                          id="lookup-pnr"
                          placeholder="예: ABC123"
                          className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lookup-last" className="text-gray-700">탑승객 성</Label>
                      <Input
                        id="lookup-last"
                        placeholder="성 (Last name)"
                        className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lookup-first" className="text-gray-700">탑승객 이름</Label>
                      <Input
                        id="lookup-first"
                        placeholder="이름 (First name)"
                        className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <Search className="mr-3 h-5 w-5" />
                      예약 조회
                    </Button>
                  </motion.div>
                </TabsContent>

                {/* ---------- 체크인 (Check-in) ---------- */}
                <TabsContent value="checkin" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="checkin-pnr" className="text-gray-700">예약 번호</Label>
                      <div className="relative">
                        <Ticket className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Input
                          id="checkin-pnr"
                          placeholder="예: ABC123"
                          className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkin-date" className="text-gray-700">탑승일 선택</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                        <Input
                          type="date"
                          id="checkin-date"
                          className="pl-10 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkin-last" className="text-gray-700">탑승객 성</Label>
                      <Input
                        id="checkin-last"
                        placeholder="성 (Last name)"
                        className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkin-first" className="text-gray-700">탑승객 이름</Label>
                      <Input
                        id="checkin-first"
                        placeholder="이름 (First name)"
                        className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <ClipboardCheck className="mr-3 h-5 w-5" />
                      체크인 하기
                    </Button>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
