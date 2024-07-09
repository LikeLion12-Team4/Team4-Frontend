// 아이디 입력창 정보
let inputId = document.querySelector("#sign-up_id");
// 비밀번호 입력창 정보
let inputPassword = document.querySelector("#sign-up_pw");
// 이메일 입력창 정보
let inputEmail = document.querySelector("#sign-up_email");
// 새 비밀번호 입력창 정보
let inputNewPassword = document.querySelector("#new-pw");
let inputNewPasswordCheck = document.querySelector("#check_new-pw");

// 성공 메시지 정보
let successMessage = document.querySelector(".success-message");
// 실패 메시지 정보 (아이디: 글자수 제한 4~12글자, 영어&숫자만)
let failureMessage = document.querySelector(".failure-message");
// 실패 메시지 정보 (비밀번호)
let failurePasswordMessage = document.querySelector(".failurePassword-message");
// 실패 메시지 정보 (이메일)
let failureEmailMessage = document.querySelector(".failureEmail-message");
// 새 비밀번호 불일치 메시지 정보
let mismatchMessage = document.querySelector(".mismatch-message");

// 아이디 유효성 검증 (한글 또는 영문)
function idCheck(str) {
  return /^[가-힣a-zA-Z]{2,10}$/.test(str);
}

// 비밀번호 유효성 검증
function passwordCheck(str) {
  return /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,15}$/.test(
    str
  );
}

// 이메일 유효성 검증
function emailCheck(str) {
  return /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+$/.test(str);
}

// 새 비밀번호 일치 확인 함수
function isMatch(password1, password2) {
  return password1 === password2;
}

// 아이디 이벤트
if (inputId) {
  inputId.onkeyup = function () {
    if (inputId.value.length !== 0) {
      if (idCheck(inputId.value)) {
        successMessage.classList.remove("hide"); // 사용할 수 있는 아이디입니다.
        failureMessage.classList.add("hide"); // 실패 메시지가 가려져야 함
      } else {
        successMessage.classList.add("hide");
        failureMessage.classList.remove("hide");
      }
    } else {
      successMessage.classList.add("hide");
      failureMessage.classList.add("hide");
    }
  };
}

// 비밀번호 이벤트
if (inputPassword) {
  inputPassword.onkeyup = function () {
    if (inputPassword.value.length !== 0) {
      if (passwordCheck(inputPassword.value)) {
        failurePasswordMessage.classList.add("hide");
      } else {
        failurePasswordMessage.classList.remove("hide");
      }
    } else {
      failurePasswordMessage.classList.add("hide");
    }
  };
}

// 이메일 이벤트
if (inputEmail) {
  inputEmail.onkeyup = function () {
    if (inputEmail.value.length !== 0) {
      if (emailCheck(inputEmail.value)) {
        failureEmailMessage.classList.add("hide");
      } else {
        failureEmailMessage.classList.remove("hide");
      }
    } else {
      failureEmailMessage.classList.add("hide");
    }
  };
}

// 새 비밀번호 이벤트
if (inputNewPassword) {
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
}

// 새 비밀번호 확인 이벤트
if (inputNewPasswordCheck) {
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
}
