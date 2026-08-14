"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

export type HeaderUser = { name: string };

const navigation = [
  { label: "항공권 예약", to: "/booking" },
  { label: "예약 조회", to: "/booking" },
  { label: "고객지원", to: "/inquiry" },
  { label: "마이페이지", to: "/mypage" },
];

export function Header({ user = null }: { user?: HeaderUser | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  return (
    <header className={`common-header ${isScrolled ? "common-header--scrolled" : ""}`}>
      <div className="common-header__inner">
        <Link className="common-header__brand" to="/" aria-label="YOUNGKEKE AIR 홈">YOUNGKEKE AIR</Link>
        <nav className="common-header__nav" aria-label="주요 메뉴">
          {navigation.map((item) => <Link key={item.label} to={item.to}>{item.label}</Link>)}
        </nav>
        <div className="common-header__account">
          {user ? (
            <button type="button" className="common-header__user">{user.name} <span aria-hidden="true">▾</span></button>
          ) : (
            <><Link to="/login">로그인</Link><Link className="common-header__signup" to="/signup">회원가입</Link></>
          )}
        </div>
        <button type="button" className="common-header__toggle" aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen((open) => !open)}>
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="common-header__mobile">
          {navigation.map((item) => <Link key={item.label} to={item.to}>{item.label}</Link>)}
          {user ? <button type="button">{user.name} ▾</button> : <div className="common-header__mobile-account"><Link to="/login">로그인</Link><Link to="/signup">회원가입</Link></div>}
        </div>
      )}
    </header>
  );
}
