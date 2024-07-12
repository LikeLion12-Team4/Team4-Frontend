// const getToken() = window.APP_CONFIG.getToken();

let API_BASE_URL = "http://3.37.18.8:8000";

function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

function getToken() {
  return getCookie("accessToken") || null;
}

function checkAndFetch(url, options) {
  const token = getToken();
  if (!token) {
    window.location.href = "../../html/pages/login.html";
    return Promise.reject("No token found");
  }
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, options);
}

// include.js
window.addEventListener("load", function () {
  var allElements = document.getElementsByTagName("*");
  Array.prototype.forEach.call(allElements, function (el) {
    var includePath = el.dataset.includePath;
    if (includePath) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          el.outerHTML = this.responseText;
        }
      };
      xhttp.open("GET", includePath, true);
      xhttp.send();
    }
  });
});

// 사용자 정보를 가져오는 함수
function fetchUserInfo() {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    redirect: "follow",
  };

  checkAndFetch("http://3.37.18.8:8000/users/user/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // 닉네임 업데이트
      const nicknameElements = document.querySelectorAll(".nickname");
      nicknameElements.forEach((element) => {
        element.textContent = result.username;
      });

      // 아이디 업데이트
      const idElement = document.querySelector(
        ".profileMenu:nth-child(2) .profileMenuValue"
      );
      if (idElement) {
        idElement.textContent = result.username;
      }

      // 이름 업데이트
      const nameElement = document.querySelector(
        ".profileMenu:nth-child(4) .profileMenuValue"
      );
      if (nameElement) {
        nameElement.textContent = result.fullname;
      }

      // 이메일 업데이트
      const emailElement = document.querySelector(
        ".profileMenu:nth-child(5) .profileMenuValue"
      );
      if (emailElement) {
        emailElement.textContent = result.email;
      }
    })
    .catch((error) => console.log("error", error));
}

// 모달 관련 변수
const changeIdModal = document.querySelector(".change-id-modal_container");
const changePwModal = document.querySelector(".change-pw-modal_container");
const changeIdBtn = document.querySelector(
  ".profileMenu:nth-child(2) .profileMenuEditButton"
);
const changePwBtn = document.querySelector(
  ".profileMenu:nth-child(3) .profileMenuEditButton"
);
const closeIdModalBtn = document.querySelector(".change-id-modal_close-btn");
const closePwModalBtn = document.querySelector(".change-pw-modal_close-btn");
const saveIdBtn = document.querySelector(".change-id-modal_next");
const savePwBtn = document.querySelector(".change-pw-modal_next");

// 아이디 변경 모달 열기
changeIdBtn.addEventListener("click", () => {
  changeIdModal.style.display = "flex";
});

// 비밀번호 변경 모달 열기
changePwBtn.addEventListener("click", () => {
  changePwModal.style.display = "flex";
});

// 모달 닫기
closeIdModalBtn.addEventListener("click", () => {
  changeIdModal.style.display = "none";
});

closePwModalBtn.addEventListener("click", () => {
  changePwModal.style.display = "none";
});

// 아이디 변경 저장
saveIdBtn.addEventListener("click", () => {
  const newId = document.getElementById("sign-up_id").value;
  if (validateId(newId)) {
    updateUserId(newId);
  } else {
    alert("올바른 아이디 형식이 아닙니다.");
  }
});

// 아이디 유효성 검사
function validateId(id) {
  const idRegex = /^[a-zA-Z0-9]{4,12}$/;
  return idRegex.test(id);
}

// 아이디 업데이트 API 호출
function updateUserId(newId) {
  var formdata = new FormData();
  formdata.append("username", newId);

  var requestOptions = {
    method: "PUT",
    body: formdata,
    redirect: "follow",
  };

  checkAndFetch(`${API_BASE_URL}/users/reset_id/`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.text();
    })
    .then((result) => {
      console.log("아이디가 성공적으로 변경되었습니다:", result);
      changeIdModal.style.display = "none";
      alert("아이디가 성공적으로 변경되었습니다.");
      fetchUserInfo(); // 사용자 정보 새로고침
    })
    .catch((error) => {
      console.log("error", error);
      alert("아이디 변경에 실패했습니다: " + error.message);
    });
}

// 비밀번호 변경 저장
savePwBtn.addEventListener("click", () => {
  const newPw = document.getElementById("new-pw").value;
  const checkNewPw = document.getElementById("check_new-pw").value;
  if (validatePassword(newPw, checkNewPw)) {
    updateUserPassword(newPw, checkNewPw);
  } else {
    if (newPw !== checkNewPw) {
      alert("비밀번호가 일치하지 않습니다.");
    } else {
      alert(
        "비밀번호는 8자 이상, 15자 이하의 영문, 숫자, 특수문자 중 2가지 이상 조합이어야 합니다."
      );
    }
  }
});

// 비밀번호 유효성 검사
function validatePassword(password, confirmPassword) {
  // 8자 이상, 15자 이하, 영문, 숫자, 특수문자 중 2가지 이상 조합
  const pwRegex = /^(?=.*[A-Za-z])(?=.*[\d@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;
  return pwRegex.test(password) && password === confirmPassword;
}

// 비밀번호 업데이트 API 호출
function updateUserPassword(newPassword, confirmPassword) {
  var formdata = new FormData();
  formdata.append("password", newPassword);
  formdata.append("re_password", confirmPassword);

  var requestOptions = {
    method: "PUT",
    body: formdata,
    redirect: "follow",
  };

  checkAndFetch(`${API_BASE_URL}/users/reset_pwd/`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(JSON.stringify(data));
        });
      }
      return response.json();
    })
    .then((result) => {
      console.log("비밀번호가 성공적으로 변경되었습니다:", result);
      changePwModal.style.display = "none";
      alert("비밀번호가 성공적으로 변경되었습니다.");
      // 비밀번호 입력 필드 초기화
      document.getElementById("new-pw").value = "";
      document.getElementById("check_new-pw").value = "";
    })
    .catch((error) => {
      console.log("error", error);
      alert("비밀번호 변경에 실패했습니다: " + error.message);
    });
}

// 페이지 로드 시 사용자 정보 가져오기
document.addEventListener("DOMContentLoaded", function () {
  fetchUserInfo();
});

// 회원 탈퇴 로직 구현

// 회원 탈퇴 관련 변수
const deleteAccountModal = document.querySelector(
  ".delete-account-modal_container"
);
const deleteAccountBtn = document.getElementById("delete_account");
const closeDeleteAccountModalBtn = document.querySelector(
  ".delete-account-modal_close-btn"
);
const confirmDeleteAccountBtn = document.querySelector(
  ".delete-account-modal_next"
);

// 회원 탈퇴 모달 열기
deleteAccountBtn.addEventListener("click", () => {
  deleteAccountModal.style.display = "flex";
});

// 회원 탈퇴 모달 닫기
closeDeleteAccountModalBtn.addEventListener("click", () => {
  deleteAccountModal.style.display = "none";
});

// 회원 탈퇴 처리
confirmDeleteAccountBtn.addEventListener("click", () => {
  const currentPassword = document.getElementById("my-pw").value;
  if (currentPassword) {
    deleteAccount(currentPassword);
  } else {
    alert("현재 비밀번호를 입력해주세요.");
  }
});

// 회원 탈퇴 API 호출
function deleteAccount(password) {
  var requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password }),
    redirect: "follow",
  };

  checkAndFetch(`${API_BASE_URL}/users/quit/`, requestOptions)
    .then((response) => {
      if (response.status === 204) {
        // 성공적으로 삭제되었지만 내용이 없는 경우
        return { success: true, message: "회원 탈퇴가 완료되었습니다." };
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("회원 탈퇴 결과:", result);
      alert(
        result.message ||
          "회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다."
      );
      // 로그아웃 처리 (쿠키 삭제)
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // 로그인 페이지로 리다이렉트
      window.location.href = "../../html/pages/login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      if (error.name === "SyntaxError") {
        // JSON 파싱 오류가 발생했지만, 실제로는 작업이 성공했을 수 있음
        alert(
          "회원 탈퇴가 처리되었을 수 있습니다. 로그아웃 후 다시 로그인을 시도해주세요."
        );
        // 로그아웃 처리 (쿠키 삭제)
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // 로그인 페이지로 리다이렉트
        window.location.href = "../../html/pages/login.html";
      } else {
        alert("회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    });
}
