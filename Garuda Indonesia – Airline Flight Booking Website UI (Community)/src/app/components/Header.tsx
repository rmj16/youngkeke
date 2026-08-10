"use client";

import { Button } from "./ui/button";
import { Menu, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goHome = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    // 섹션은 홈에만 존재하므로, 다른 페이지라면 홈으로 이동 후 스크롤
    if (location.pathname !== "/") {
      navigate("/");
      // 라우팅 후 DOM이 준비되면 스크롤
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-lg bg-white/80 shadow-lg border-b border-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={goHome}
            >
              <div className="flex-shrink-0">
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-blue-600" : "text-white"
                }`}>
                  Garuda Indonesia
                </h1>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { name: "항공권 예약", id: "book" },
                  { name: "예약 조회", path: "/inquiry" },
                  { name: "취항지", id: "destinations" },
                  { name: "회사소개", id: "about" },
                  { name: "마이페이지", path: "/mypage" }
                ].map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (item.path ? goTo(item.path) : scrollToSection(item.id!))}
                    className={`px-3 py-2 transition-colors duration-300 relative group ${
                      isScrolled
                        ? "text-gray-900 hover:text-blue-600"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goTo("/login")}
                  className={`transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-900 hover:text-blue-600 hover:bg-blue-50"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  로그인
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={() => goTo("/signup")}
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                >
                  회원가입
                </Button>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-900 hover:text-blue-600"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="backdrop-blur-lg bg-white/95 shadow-xl border-b border-white/20 px-4 py-6">
              <div className="space-y-4">
                {[
                  { name: "항공권 예약", id: "book" },
                  { name: "예약 조회", path: "/inquiry" },
                  { name: "취항지", id: "destinations" },
                  { name: "회사소개", id: "about" },
                  { name: "마이페이지", path: "/mypage" }
                ].map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ x: 10 }}
                    onClick={() => (item.path ? goTo(item.path) : scrollToSection(item.id!))}
                    className="block w-full text-left px-3 py-2 text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <div className="border-t pt-4 mt-4 space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => goTo("/login")}>
                    로그인
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => goTo("/signup")}>
                    회원가입
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}