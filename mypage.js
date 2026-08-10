let originalProfile = {};

const mainHeader = document.getElementById("mainHeader");
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    mainHeader.classList.add("scrolled");
  } else {
    mainHeader.classList.remove("scrolled");
  }

  if (window.scrollY > 320) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu(forceState) {
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("mobileMenuBtn");

  const shouldOpen = typeof forceState === "boolean"
    ? forceState
    : !menu.classList.contains("open");

  menu.classList.toggle("open", shouldOpen);
  btn.textContent = shouldOpen ? "✕" : "☰";
}

function goToMockSection(sectionName) {
  toggleMobileMenu(false);
  alert(sectionName + " 섹션은 메인 페이지에서 연결할 예정입니다.");
}

function showSection(id, button) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
  });

  if (button) button.classList.add("active");
}

function toggleEdit() {
  const editableIds = ["userName", "userEmail", "userPhone", "userAddress"];
  originalProfile = {};

  editableIds.forEach(id => {
    const input = document.getElementById(id);
    originalProfile[id] = input.value;
    input.disabled = false;
  });

  document.getElementById("saveArea").style.display = "flex";
}

function cancelEdit() {
  Object.entries(originalProfile).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input) input.value = value;
  });

  document.querySelectorAll("#profile input").forEach(input => {
    input.disabled = true;
  });

  document.getElementById("saveArea").style.display = "none";
}

function saveProfile() {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const phone = document.getElementById("userPhone").value.trim();

  if (!name || !email || !phone) {
    alert("필수 정보를 모두 입력해주세요.");
    return;
  }

  if (!email.includes("@")) {
    alert("올바른 이메일 형식을 입력해주세요.");
    return;
  }

  document.getElementById("summaryName").textContent = name + "님";
  document.getElementById("summaryEmail").textContent = email;

  document.querySelectorAll("#profile input").forEach(input => {
    input.disabled = true;
  });

  document.getElementById("saveArea").style.display = "none";
  alert("회원정보가 저장되었습니다.");
}

function openPasswordModal() {
  document.getElementById("passwordModal").classList.add("show");
}

function closePasswordModal() {
  document.getElementById("passwordModal").classList.remove("show");

  ["currentPassword", "newPassword", "confirmPassword"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

function changePassword() {
  const current = document.getElementById("currentPassword").value;
  const next = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!current || !next || !confirm) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  if (next !== confirm) {
    alert("새 비밀번호가 일치하지 않습니다.");
    return;
  }

  if (next.length < 8) {
    alert("비밀번호는 8자 이상 입력해주세요.");
    return;
  }

  alert("비밀번호가 변경되었습니다.");
  closePasswordModal();
}

function showReservationDetail() {
  alert("예약 상세 페이지는 추후 API 연동 후 구현할 예정입니다.");
}

function withdrawAccount() {
  if (confirm("정말 회원 탈퇴를 진행하시겠습니까?")) {
    alert("회원 탈퇴 요청이 처리되었습니다.");
  }
}

window.addEventListener("click", event => {
  const modal = document.getElementById("passwordModal");
  if (event.target === modal) closePasswordModal();
});

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePasswordModal();
    toggleMobileMenu(false);
  }
});
