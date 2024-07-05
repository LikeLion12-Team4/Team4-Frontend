// 이메일 입력창 정보
let inputEmail = document.querySelector("#sign-up_email");
let failureEmailMessage = document.querySelector(".failureEmail-message");

// 이메일 유효성 검증
function emailCheck(str) {
  return /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+$/.test(str);
}

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
