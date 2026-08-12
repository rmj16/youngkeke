"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./mypage.scoped.css";

// 마이페이지 (mypage 브랜치 통합) — 바닐라 JS/CSS를 React로 재구성. CSS는 .mypage-root 로 스코프됨.

type TabId = "profile" | "booking" | "mileage" | "quick" | "inquiry" | "withdraw";

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "profile", icon: "👤", label: "회원정보" },
  { id: "booking", icon: "🎫", label: "예약내역" },
  { id: "mileage", icon: "⭐", label: "마일리지" },
  { id: "quick", icon: "⚡", label: "간편예약" },
  { id: "inquiry", icon: "💬", label: "문의내역" },
  { id: "withdraw", icon: "⚠️", label: "회원탈퇴" },
];

export function MyPage() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // 회원정보
  const [editing, setEditing] = useState(false);
  const [headerEmail, setHeaderEmail] = useState("minji.kim@example.com");
  const [profile, setProfile] = useState({
    email: "minji.kim@example.com",
    phone: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
  });
  const [backup, setBackup] = useState(profile);

  // 비밀번호 모달
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  // 간편예약
  const [tripType, setTripType] = useState<"round" | "oneway">("round");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 320);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPwOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const startEdit = () => {
    setBackup(profile);
    setEditing(true);
  };
  const cancelEdit = () => {
    setProfile(backup);
    setEditing(false);
  };
  const saveProfile = () => {
    const { email, phone, address } = profile;
    if (!email.trim() || !phone.trim() || !address.trim()) {
      alert("수정 가능한 항목을 모두 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    setHeaderEmail(email);
    setEditing(false);
    alert("회원정보가 저장되었습니다. (AWS API 연동 예정)");
  };

  const closePwModal = () => {
    setPwOpen(false);
    setPw({ current: "", next: "", confirm: "" });
  };
  const changePassword = () => {
    if (!pw.current || !pw.next || !pw.confirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (pw.next !== pw.confirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (pw.next.length < 8) {
      alert("비밀번호는 8자 이상 입력해주세요.");
      return;
    }
    alert("비밀번호 변경 요청이 완료되었습니다. (Cognito 연동 예정)");
    closePwModal();
  };

  const withdraw = () => {
    if (confirm("정말 회원 탈퇴를 진행하시겠습니까?")) {
      alert("회원 탈퇴 API와 연결할 영역입니다.");
    }
  };

  return (
    <div className="mypage-root">
      {/* Header */}
      <header id="siteHeader" className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <button className="brand" onClick={() => navigate("/")}>Garuda Indonesia</button>
          <nav className="desktop-nav">
            <button onClick={() => navigate("/")}>항공권 예약</button>
            <button onClick={() => navigate("/inquiry")}>예약 조회</button>
            <button onClick={() => setActiveTab("booking")}>마이페이지</button>
          </nav>
          <div className="header-actions">
            <button className="ghost-icon" aria-label="검색">⌕</button>
            <button className="my-btn" onClick={() => navigate("/login")}>로그인</button>
            <button
              className="mobile-toggle"
              id="menuToggle"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        <div id="mobileMenu" className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
          <button onClick={() => { navigate("/"); }}>항공권 예약</button>
          <button onClick={() => { navigate("/inquiry"); }}>예약 조회</button>
          <button onClick={() => { setActiveTab("profile"); setMobileOpen(false); }}>회원정보</button>
          <button className="mobile-primary" onClick={() => navigate("/login")}>로그인</button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <span className="bubble bubble-a" />
        <span className="bubble bubble-b" />
        <div className="hero-copy">
          <p className="overline">MY ACCOUNT</p>
          <h1>마이페이지</h1>
          <p className="hero-description">회원정보와 예약, 마일리지를 한 곳에서 관리하세요.</p>
        </div>
      </section>

      <div className="page-shell">
        {/* Profile overview */}
        <div className="profile-overview frosted-card">
          <div className="user-block">
            <div className="avatar">김</div>
            <div>
              <span>GARUDA MILES · GOLD</span>
              <h2>김민지님</h2>
              <p id="headerEmail">{headerEmail}</p>
            </div>
          </div>
          <div className="overview-metrics">
            <div className="metric">
              <span>보유 마일리지</span>
              <strong>28,400</strong>
            </div>
            <div className="metric">
              <span>예정된 여정</span>
              <strong>2</strong>
            </div>
            <div className="metric membership-metric">
              <span>멤버십 등급</span>
              <strong>GOLD</strong>
            </div>
          </div>
        </div>

        <div className="account-layout">
          {/* Sidebar tabs */}
          <aside className="account-menu frosted-card">
            <span className="menu-label">ACCOUNT</span>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`account-tab ${activeTab === t.id ? "active" : ""}`}
                data-tab={t.id}
                onClick={() => setActiveTab(t.id)}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </aside>

          {/* Panels */}
          <div>
            {/* 회원정보 */}
            {activeTab === "profile" && (
              <div className="tab-panel active">
                <div className="section-heading">
                  <div>
                    <p className="section-label">PROFILE</p>
                    <h2>회원정보</h2>
                    <p>기본 정보를 확인하고 연락처를 최신 상태로 유지하세요.</p>
                  </div>
                  {!editing && (
                    <button className="blue-btn" id="editBtn" onClick={startEdit}>정보 수정</button>
                  )}
                </div>
                <div className="form-card white-card lift-card">
                  <div className="locked-notice">이름과 생년월일은 보안을 위해 변경할 수 없습니다. 변경이 필요하면 고객센터로 문의해주세요.</div>
                  <div className="form-grid">
                    <label>
                      <span>이름 <em>변경 불가</em></span>
                      <input defaultValue="김민지" disabled />
                    </label>
                    <label>
                      <span>생년월일 <em>변경 불가</em></span>
                      <input defaultValue="1998-03-24" disabled />
                    </label>
                    <label>
                      <span>이메일</span>
                      <input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled={!editing}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>휴대폰</span>
                      <input
                        id="phone"
                        value={profile.phone}
                        disabled={!editing}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </label>
                    <label className="full-row">
                      <span>주소</span>
                      <input
                        id="address"
                        value={profile.address}
                        disabled={!editing}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="security-strip">
                    <div className="security-icon">🔒</div>
                    <div>
                      <h3>비밀번호</h3>
                      <p>마지막 변경: 3개월 전 · 주기적으로 변경하는 것을 권장합니다.</p>
                    </div>
                    <button className="outline-blue" onClick={() => setPwOpen(true)}>비밀번호 변경</button>
                  </div>

                  {editing && (
                    <div className="profile-actions" id="profileActions">
                      <button className="soft-btn" onClick={cancelEdit}>취소</button>
                      <button className="blue-btn" onClick={saveProfile}>저장</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 예약내역 */}
            {activeTab === "booking" && (
              <div className="tab-panel active">
                <div className="section-heading">
                  <div>
                    <p className="section-label">BOOKINGS</p>
                    <h2>예약내역</h2>
                    <p>다가오는 여정과 지난 여정을 확인하세요.</p>
                  </div>
                </div>
                <div className="booking-card white-card lift-card">
                  <div className="booking-top">
                    <div>예약번호 <strong>GA-8842</strong></div>
                    <span className="badge blue-badge">발권 완료</span>
                  </div>
                  <div className="air-route">
                    <div>
                      <strong>ICN</strong>
                      <span>서울</span>
                      <small>08:40</small>
                    </div>
                    <div className="route-visual"><i />✈<i /></div>
                    <div>
                      <strong>CGK</strong>
                      <span>자카르타</span>
                      <small>14:05</small>
                    </div>
                  </div>
                  <div className="booking-bottom">
                    <span>2026.09.12 · 성인 1명 · 이코노미</span>
                    <button>상세 보기 →</button>
                  </div>
                </div>
                <div className="booking-card white-card lift-card">
                  <div className="booking-top">
                    <div>예약번호 <strong>GA-8790</strong></div>
                    <span className="badge gray-badge">여행 완료</span>
                  </div>
                  <div className="air-route">
                    <div>
                      <strong>DPS</strong>
                      <span>발리</span>
                      <small>16:20</small>
                    </div>
                    <div className="route-visual"><i />✈<i /></div>
                    <div>
                      <strong>ICN</strong>
                      <span>서울</span>
                      <small>23:55</small>
                    </div>
                  </div>
                  <div className="booking-bottom">
                    <span>2026.05.03 · 성인 2명 · 비즈니스</span>
                    <button>상세 보기 →</button>
                  </div>
                </div>
              </div>
            )}

            {/* 마일리지 */}
            {activeTab === "mileage" && (
              <div className="tab-panel active">
                <div className="section-heading">
                  <div>
                    <p className="section-label">MILEAGE</p>
                    <h2>마일리지</h2>
                    <p>적립/사용 내역과 잔여 마일리지를 확인하세요.</p>
                  </div>
                </div>
                <div className="mileage-hero">
                  <div>
                    <span>보유 마일리지</span>
                    <h3>28,400 <small>miles</small></h3>
                    <p>다음 등급까지 6,600 마일 남았습니다.</p>
                  </div>
                  <div className="big-star">★</div>
                </div>
                <h3 className="sub-title">최근 내역</h3>
                <div className="history-card white-card">
                  <div>
                    <span>탑승 적립 · ICN→CGK<small>2026.05.03</small></span>
                    <b className="plus">+3,200</b>
                  </div>
                  <div>
                    <span>제휴 카드 적립<small>2026.04.21</small></span>
                    <b className="plus">+1,050</b>
                  </div>
                  <div>
                    <span>보너스 항공권 사용<small>2026.03.15</small></span>
                    <b className="minus">-15,000</b>
                  </div>
                </div>
              </div>
            )}

            {/* 간편예약 */}
            {activeTab === "quick" && (
              <div className="tab-panel active">
                <div className="section-heading">
                  <div>
                    <p className="section-label">QUICK BOOKING</p>
                    <h2>간편예약</h2>
                    <p>자주 가는 노선을 저장해 두면 다음 예약이 빨라집니다.</p>
                  </div>
                </div>
                <div className="quick-card white-card lift-card">
                  <div className="pill-toggle">
                    <button
                      className={tripType === "round" ? "active" : ""}
                      onClick={() => setTripType("round")}
                    >
                      왕복
                    </button>
                    <button
                      className={tripType === "oneway" ? "active" : ""}
                      onClick={() => setTripType("oneway")}
                    >
                      편도
                    </button>
                  </div>
                  <div className="form-grid">
                    <label>
                      <span>출발지</span>
                      <input defaultValue="서울 (ICN)" />
                    </label>
                    <label>
                      <span>도착지</span>
                      <input defaultValue="자카르타 (CGK)" />
                    </label>
                    <label>
                      <span>선호 좌석</span>
                      <select defaultValue="economy">
                        <option value="economy">이코노미</option>
                        <option value="business">비즈니스</option>
                        <option value="first">퍼스트</option>
                      </select>
                    </label>
                    <label>
                      <span>인원수</span>
                      <select defaultValue="1">
                        <option value="1">성인 1명</option>
                        <option value="2">성인 2명</option>
                        <option value="3">성인 3명</option>
                      </select>
                    </label>
                  </div>
                  <button
                    className="blue-btn full-button"
                    onClick={() => alert("간편 예약 설정이 저장되었습니다. (AWS API 연동 예정)")}
                  >
                    간편 예약 설정 저장
                  </button>
                </div>
              </div>
            )}

            {/* 문의내역 */}
            {activeTab === "inquiry" && (
              <div className="tab-panel active">
                <div className="section-heading">
                  <div>
                    <p className="section-label">INQUIRIES</p>
                    <h2>문의내역</h2>
                    <p>고객센터에 남긴 문의와 처리 상태를 확인하세요.</p>
                  </div>
                  <button className="outline-blue" onClick={() => navigate("/inquiry")}>새 문의하기</button>
                </div>
                <div className="inquiry-card white-card">
                  <div className="inquiry-head">
                    <span>제목</span>
                    <span>등록일</span>
                    <span>상태</span>
                  </div>
                  <div className="inquiry-row">
                    <span>수하물 규정 문의</span>
                    <span>2026.06.02</span>
                    <span className="done">답변완료</span>
                  </div>
                  <div className="inquiry-row">
                    <span>마일리지 적립 오류</span>
                    <span>2026.05.28</span>
                    <span className="waiting">처리중</span>
                  </div>
                  <div className="inquiry-row">
                    <span>예약 변경 가능 여부</span>
                    <span>2026.05.10</span>
                    <span className="done">답변완료</span>
                  </div>
                </div>
              </div>
            )}

            {/* 회원탈퇴 */}
            {activeTab === "withdraw" && (
              <div className="tab-panel active">
                <div className="withdraw-card white-card">
                  <div className="warning-circle">!</div>
                  <h3>회원 탈퇴</h3>
                  <p>탈퇴 시 아래 정보가 삭제되며 복구할 수 없습니다.</p>
                  <ul>
                    <li>· 보유 마일리지 및 멤버십 등급</li>
                    <li>· 예약 내역 및 간편예약 설정</li>
                    <li>· 문의 내역 및 회원 정보</li>
                  </ul>
                  <button className="danger-btn" onClick={withdraw}>회원 탈퇴 진행</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <span className="glow glow-a" />
        <span className="glow glow-b" />
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <h3>Garuda Indonesia</h3>
              <p>세계로 향하는 특별한 여정, 가루다 인도네시아와 함께하세요.</p>
              <div className="socials">
                <button aria-label="facebook">f</button>
                <button aria-label="instagram">◎</button>
                <button aria-label="twitter">✕</button>
              </div>
            </div>
            <div>
              <h4>서비스</h4>
              <a href="#">항공권 예약</a>
              <a href="#">예약 조회</a>
              <a href="#">체크인</a>
            </div>
            <div>
              <h4>고객지원</h4>
              <a href="#">자주 묻는 질문</a>
              <a href="#">1:1 문의</a>
              <a href="#">고객센터</a>
            </div>
            <div>
              <h4>고객센터</h4>
              <p>1588-0000 (연중무휴 09:00-18:00)</p>
              <p>support@garuda.example</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Garuda Indonesia. All rights reserved.</span>
            <div>
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        id="scrollTop"
        className={`scroll-top ${showTop ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="맨 위로"
      >
        ↑
      </button>

      {/* Password modal */}
      <div
        id="passwordModal"
        className={`modal ${pwOpen ? "show" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closePwModal();
        }}
      >
        <div className="modal-card">
          <button className="modal-x" onClick={closePwModal} aria-label="닫기">×</button>
          <h2>비밀번호 변경</h2>
          <p>안전한 계정 관리를 위해 주기적으로 변경해주세요.</p>
          <label>
            <span>현재 비밀번호</span>
            <input
              id="currentPassword"
              type="password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
            />
          </label>
          <label>
            <span>새 비밀번호</span>
            <input
              id="newPassword"
              type="password"
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
            />
          </label>
          <label>
            <span>새 비밀번호 확인</span>
            <input
              id="confirmPassword"
              type="password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
            />
          </label>
          <button className="blue-btn full-button" onClick={changePassword}>변경하기</button>
        </div>
      </div>
    </div>
  );
}
