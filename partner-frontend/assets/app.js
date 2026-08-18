document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById("content");
    const API_BASE = window.PARTNER_PORTAL_CONFIG
        ? window.PARTNER_PORTAL_CONFIG.API_BASE_URL
        : "/api";

    // 일단 로그인 화면은 건너뛰고 바로 포털만 보이게
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("portal").classList.remove("hidden");

    content.innerHTML = "<p>불러오는 중...</p>";

    fetch(`${API_BASE}/partner/requests`)
        .then(res => res.json())
        .then(data => {
            let html = "<h2>협력사 작업지시 목록</h2><ul>";
            data.forEach(item => {
                html += `<li>${item.title} - <b>${item.status}</b></li>`;
            });
            html += "</ul>";
            content.innerHTML = html;
        })
        .catch(err => {
            content.innerHTML = "<p style='color:red'>목록을 불러오지 못했습니다: " + err.message + "</p>";
        });
});