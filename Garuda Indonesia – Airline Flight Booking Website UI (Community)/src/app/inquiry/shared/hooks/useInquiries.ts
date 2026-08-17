"use client";

import { useCallback, useEffect, useState } from "react";
import type { Inquiry } from "@inq/shared/types/inquiry";
import {
  BookingApiError,
  createInquiry,
  deleteInquiry,
  fetchCurrentMember,
  fetchMyInquiries,
  updateInquiry,
  type InquiryInput,
  type Member,
} from "@inq/shared/api/qnaApi";

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthenticated, setUnauthenticated] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextMember, nextInquiries] = await Promise.all([
        fetchCurrentMember(),
        fetchMyInquiries(),
      ]);
      setMember(nextMember);
      setInquiries(nextInquiries);
      setUnauthenticated(false);
    } catch (cause) {
      if (cause instanceof BookingApiError && cause.status === 401) {
        setUnauthenticated(true);
      } else {
        setError(cause instanceof Error ? cause.message : "문의 목록을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async (input: InquiryInput) => {
    await createInquiry(input);
    await load();
  };

  const update = async (id: string, input: InquiryInput) => {
    await updateInquiry(id, input);
    await load();
  };

  const remove = async (id: string) => {
    await deleteInquiry(id);
    await load();
  };

  return {
    inquiries,
    member,
    loading,
    error,
    unauthenticated,
    refresh: load,
    create,
    update,
    remove,
  };
}
