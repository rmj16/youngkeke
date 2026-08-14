"use client";

import { useEffect, useState } from "react";
import { seedInquiries } from "@features/inquiry/data/inquiries";
import type { Inquiry } from "@features/inquiry/types/inquiry";

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(seedInquiries);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("garuda-inquiries-v2");
      if (stored) queueMicrotask(() => setInquiries(JSON.parse(stored)));
    } catch { /* use seed data */ }
  }, []);
  const save = (next: Inquiry[]) => {
    setInquiries(next);
    localStorage.setItem("garuda-inquiries-v2", JSON.stringify(next));
  };
  return { inquiries, save };
}
