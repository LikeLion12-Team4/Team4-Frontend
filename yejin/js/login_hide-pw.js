// 로그인
let inputPassword = document.querySelector("#login-pw");
let hidePassword = document.querySelector(".hide-pw-img");

hidePassword.addEventListener("click", function () {
  if (inputPassword.type === "password") {
    inputPassword.type = "text";
    hidePassword.src = "css/icon/비밀번호 보이기.svg";
  } else {
    inputPassword.type = "password";
    hidePassword.src = "css/icon/비밀번호 가리기.svg";
  }
});
