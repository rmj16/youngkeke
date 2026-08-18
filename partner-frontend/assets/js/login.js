(function () {
  "use strict";

  const config = window.PARTNER_PORTAL_CONFIG || {};
  const form = document.getElementById("partnerLoginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberId = document.getElementById("rememberId");
  const message = document.getElementById("loginMessage");
  const button = document.getElementById("loginButton");

  // 임시 발표 모드에서만 사용합니다. 비밀번호는 프론트엔드에 저장하지 않습니다.
  const prototypeAccounts = {
    catering_demo: "catering",
    clean_demo: "clean",
    tech_demo: "tech"
  };

  const rememberedUsername = localStorage.getItem("partnerRememberedUsername");
  if (rememberedUsername) {
    usernameInput.value = rememberedUsername;
    rememberId.checked = true;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessage();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showMessage("아이디와 비밀번호를 모두 입력해 주세요.", "error");
      return;
    }

    saveRememberedUsername(username);
    setLoading(true);

    try {
      if (config.AUTH_MODE === "api") {
        await loginWithApi(username, password);
      } else {
        loginForPrototype(username);
      }
    } catch (error) {
      showMessage(error.message || "로그인 처리 중 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  });

  function loginForPrototype(username) {
    const partnerCode = prototypeAccounts[username];
    if (!partnerCode) {
      throw new Error("등록되지 않은 발표용 아이디입니다.");
    }

    showMessage("로그인되었습니다. 협력사 화면으로 이동합니다.", "success");
    moveToPortal(partnerCode);
  }

  async function loginWithApi(username, password) {
    const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    let body = {};
    try {
      body = await response.json();
    } catch (_) {
      // 본문이 없는 오류 응답도 상태 코드로 처리합니다.
    }

    if (response.status === 401) {
      throw new Error(body.message || "아이디 또는 비밀번호가 올바르지 않습니다.");
    }
    if (response.status === 403) {
      throw new Error(body.message || "포털 접근 권한이 없는 계정입니다.");
    }
    if (!response.ok) {
      throw new Error(body.message || "로그인 서버에 연결할 수 없습니다.");
    }
    if (!body.partnerCode) {
      throw new Error("서버 응답에 협력사 정보가 없습니다.");
    }

    showMessage("로그인되었습니다. 협력사 화면으로 이동합니다.", "success");
    moveToPortal(body.partnerCode);
  }

  function moveToPortal(partnerCode) {
    const safeCode = encodeURIComponent(partnerCode);
    window.setTimeout(function () {
      window.location.href = `portal.html?partner=${safeCode}&auth=1`;
    }, 350);
  }

  function saveRememberedUsername(username) {
    if (rememberId.checked) {
      localStorage.setItem("partnerRememberedUsername", username);
    } else {
      localStorage.removeItem("partnerRememberedUsername");
    }
  }

  function setLoading(loading) {
    button.disabled = loading;
    button.textContent = loading ? "확인 중..." : "로그인";
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
  }

  function clearMessage() {
    message.textContent = "";
    message.className = "message";
  }
})();
