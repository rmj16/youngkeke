"use client";

import { Routes, Route, Outlet } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { InquiryPage } from "./pages/InquiryPage";
import { AdminPage } from "./pages/AdminPage";
import { MyPage } from "./pages/MyPage";
import { BookingFlow } from "./pages/BookingFlow";
import { useEffect } from "react";

// 마케팅 페이지 공통 레이아웃 (Header + Footer)
function MarketingLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* 세션 인증 연동 시 null 대신 실제 사용자 객체를 전달합니다. */}
      <Header user={null} />
      <Routes>
        {/* 메인/로그인/회원가입 — Garuda 마케팅 레이아웃 */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* 예약/고객 문의 (inquires 통합) — 자체 레이아웃 */}
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/inquires" element={<InquiryPage />} />
        <Route path="/inquiries" element={<InquiryPage />} />

        {/* 관리자 (inquires 통합) */}
        <Route path="/admin" element={<AdminPage view="dashboard" />} />
        <Route path="/admin/inquiries" element={<AdminPage view="admin-inquiries" />} />

        {/* 항공권 예약(부킹) 플로우 (booking 통합) */}
        <Route path="/booking" element={<BookingFlow />} />

        {/* 마이페이지 (mypage 통합) */}
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  );
}
