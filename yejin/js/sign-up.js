// 아이디 입력창 정보
let inputId = document.querySelector("#sign-up_id");
// 성공 메시지 정보
let successMessage = document.querySelector(".success-message");
// 실패 메시지 정보 (글자수 제한 4~12글자, 영어&숫자만)
let failureMessage = document.querySelector(".failure-message");

// 비밀번호 입력창 정보
let inputPassword = document.querySelector("#sign-up_pw");
let failurePasswordMessage = document.querySelector(".failurePassword-message");

// 이메일 입력창 정보
let inputEmail = document.querySelector("#sign-up_email");
let failureEmailMessage = document.querySelector(".failureEmail-message");

// 아이디 유효성 검증
// 영문 또는 숫자
// function idCheck(str) {
//   return /^[A-Za-z0-9]{4,12}$/.test(str);
// }

// 한글 또는 영문
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

// 아이디 이벤트
inputId.onkeyup = function () {
  // 값을 입력한 경우
  if (inputId.value.length !== 0) {
    if (idCheck(inputId.value) === false) {
      successMessage.classList.add("hide");
      failureMessage.classList.remove("hide");
    }
    // 조건을 모두 만족할 경우
    else if (idCheck(inputId.value)) {
      successMessage.classList.remove("hide"); // 사용할 수 있는 아이디입니다.
      failureMessage.classList.add("hide"); // 실패 메시지가 가려져야 함
    }
  }

  // 값을 입력하지 않은 경우 (지웠을 때) -> 모든 메시지를 가림
  else {
    successMessage.classList.add("hide");
    failureMessage.classList.add("hide");
  }
};

// 비밀번호 이벤트
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

// 이메일 이벤트
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
