"use client";

import { Outlet } from "react-router";
import { Footer } from "./Footer";

// 마케팅/공개 페이지 공통 레이아웃 — 본문(Outlet) 아래에 공통 Footer를 렌더링.
export function MarketingLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
