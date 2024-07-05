// 회원가입
let inputSignUpPassword = document.querySelector("#sign-up_pw");
let hideSignUpPassword = document.querySelector(".sign-up_hide-pw-img");

hideSignUpPassword.addEventListener("click", function () {
  if (inputSignUpPassword.type === "password") {
    inputSignUpPassword.type = "text";
    hideSignUpPassword.src = "css/icon/비밀번호 보이기.svg";
  } else {
    inputSignUpPassword.type = "password";
    hideSignUpPassword.src = "css/icon/비밀번호 가리기.svg";
  }
});
