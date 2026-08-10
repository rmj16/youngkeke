let profileBackup = {};
const header = document.getElementById("siteHeader");
const topButton = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  topButton.classList.toggle("show", window.scrollY > 320);
});

function scrollToTop(){ window.scrollTo({top:0, behavior:"smooth"}); }

function mainPageNotice(name){
  alert(name + " 메뉴는 메인 페이지와 연결할 예정입니다.");
}

function toggleMobileMenu(force){
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("menuToggle");
  const open = typeof force === "boolean" ? force : !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  btn.textContent = open ? "✕" : "☰";
}

function openTab(id, button){
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById(id);
  if(panel) panel.classList.add("active");

  document.querySelectorAll(".account-tab").forEach(b => b.classList.remove("active"));
  const targetBtn = button || document.querySelector(`.account-tab[data-tab="${id}"]`);
  if(targetBtn) targetBtn.classList.add("active");

  if(window.innerWidth < 960 && panel){
    panel.scrollIntoView({behavior:"smooth", block:"start"});
  }
}

function startProfileEdit(){
  const editable = ["email","phone","address"];
  profileBackup = {};
  editable.forEach(id => {
    const el = document.getElementById(id);
    profileBackup[id] = el.value;
    el.disabled = false;
  });
  document.getElementById("editBtn").classList.add("hidden");
  document.getElementById("profileActions").classList.remove("hidden");
}

function cancelProfileEdit(){
  ["email","phone","address"].forEach(id => {
    const el = document.getElementById(id);
    el.value = profileBackup[id];
    el.disabled = true;
  });
  document.getElementById("editBtn").classList.remove("hidden");
  document.getElementById("profileActions").classList.add("hidden");
}

function saveProfile(){
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if(!email || !phone || !address){
    alert("수정 가능한 항목을 모두 입력해주세요.");
    return;
  }
  if(!email.includes("@")){
    alert("올바른 이메일 형식을 입력해주세요.");
    return;
  }

  document.getElementById("headerEmail").textContent = email;
  ["email","phone","address"].forEach(id => document.getElementById(id).disabled = true);
  document.getElementById("editBtn").classList.remove("hidden");
  document.getElementById("profileActions").classList.add("hidden");
  alert("회원정보가 저장되었습니다. (AWS API 연동 예정)");
}

function openPasswordModal(){ document.getElementById("passwordModal").classList.add("show"); }
function closePasswordModal(){
  document.getElementById("passwordModal").classList.remove("show");
  ["currentPassword","newPassword","confirmPassword"].forEach(id => document.getElementById(id).value = "");
}

function changePassword(){
  const current = document.getElementById("currentPassword").value;
  const next = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  if(!current || !next || !confirm){ alert("모든 항목을 입력해주세요."); return; }
  if(next !== confirm){ alert("새 비밀번호가 일치하지 않습니다."); return; }
  if(next.length < 8){ alert("비밀번호는 8자 이상 입력해주세요."); return; }
  alert("비밀번호 변경 요청이 완료되었습니다. (Cognito 연동 예정)");
  closePasswordModal();
}

function setTripType(type, button){
  document.querySelectorAll(".pill-toggle button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
}

function saveQuickBooking(){
  alert("간편 예약 설정이 저장되었습니다. (AWS API 연동 예정)");
}

function withdrawAccount(){
  if(confirm("정말 회원 탈퇴를 진행하시겠습니까?")){
    alert("회원 탈퇴 API와 연결할 영역입니다.");
  }
}

window.addEventListener("click", e => {
  const modal = document.getElementById("passwordModal");
  if(e.target === modal) closePasswordModal();
});

window.addEventListener("keydown", e => {
  if(e.key === "Escape"){
    closePasswordModal();
    toggleMobileMenu(false);
  }
});
