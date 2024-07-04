// 새 비밀번호 입력창 정보
let inputNewPassword = document.querySelector("#new-pw");
let inputNewPasswordCheck = document.querySelector("#check_new-pw");
let failurePasswordMessage = document.querySelector(".failurePassword-message");
let mismatchMessage = document.querySelector(".mismatch-message");

// 새 비밀번호 일치 확인 함수
function isMatch(password1, password2) {
  return password1 === password2;
}

// 비밀번호 유효성 검증
function passwordCheck(str) {
  return /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,15}$/.test(
    str
  );
}

// 비밀번호 이벤트
inputNewPassword.onkeyup = function () {
  if (inputNewPassword.value.length !== 0) {
    if (passwordCheck(inputNewPassword.value)) {
      failurePasswordMessage.classList.add("hide");
    } else {
      failurePasswordMessage.classList.remove("hide");
    }
  } else {
    failurePasswordMessage.classList.add("hide");
  }
};

// 새 비밀번호 일치 확인 이벤트
inputNewPasswordCheck.onkeyup = function () {
  if (inputNewPasswordCheck.value.length !== 0) {
    if (isMatch(inputNewPassword.value, inputNewPasswordCheck.value)) {
      mismatchMessage.classList.add("hide");
    } else {
      mismatchMessage.classList.remove("hide");
    }
  } else {
    mismatchMessage.classList.add("hide");
  }
};
