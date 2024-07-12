// 토큰 하드코딩.. 로그인 완성되면 변경하자..
const hardcodedToken = window.APP_CONFIG.hardcodedToken;

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
      Authorization: `Bearer ${hardcodedToken}`,
    },
    redirect: "follow",
  };

  fetch("http://3.37.18.8:8000/users/user/", requestOptions)
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

// 아이디 업데이트 API 호출, 이부분 구현 안된듯ㅠㅠ *********
function updateUserId(newId) {
  var requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${hardcodedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: newId }),
    redirect: "follow",
  };

  fetch("http://3.37.18.8:8000/users/user/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("아이디가 성공적으로 변경되었습니다:", result);
      changeIdModal.style.display = "none";
      fetchUserInfo(); // 사용자 정보 새로고침
    })
    .catch((error) => console.log("error", error));
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
      alert("비밀번호는 8자 이상의 영문과 숫자 조합이어야 합니다.");
    }
  }
});

// 비밀번호 유효성 검사
function validatePassword(password, confirmPassword) {
  // 8자 이상, 영문과 숫자, 특수문자 중 2가지 이상 조합
  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return pwRegex.test(password) && password === confirmPassword;
}

// 비밀번호 업데이트 API 호출
function updateUserPassword(newPassword, confirmPassword) {
  var formdata = new FormData();
  formdata.append("password", newPassword);
  formdata.append("re_password", confirmPassword);

  var requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${hardcodedToken}`, // 인증 토큰 추가
    },
    body: formdata,
    redirect: "follow",
  };

  fetch("http://3.37.18.8:8000/users/reset_pwd/", requestOptions)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.text();
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
