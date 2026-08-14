"use client";

import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { Header } from "@components/layout/Header";
import { MarketingLayout } from "@components/layout/MarketingLayout";
import { HomePage } from "@pages/home/HomePage";
import { LoginPage } from "@pages/login/LoginPage";
import { SignupPage } from "@pages/signup/SignupPage";
import { InquiryPage } from "@pages/inquiry/InquiryPage";
import { AdminPage } from "@pages/admin/AdminPage";
import { MyPage } from "@pages/mypage/MyPage";
import { BookingPage } from "@pages/booking/BookingPage";

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
        {/* 메인/로그인/회원가입 — 마케팅 레이아웃 (Outlet + Footer) */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* 고객 문의 */}
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/inquires" element={<InquiryPage />} />
        <Route path="/inquiries" element={<InquiryPage />} />

        {/* 관리자 */}
        <Route path="/admin" element={<AdminPage view="dashboard" />} />
        <Route path="/admin/inquiries" element={<AdminPage view="admin-inquiries" />} />

        {/* 항공권 예약 플로우 */}
        <Route path="/booking" element={<BookingPage />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  );
}
