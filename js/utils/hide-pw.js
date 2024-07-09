function togglePasswordVisibility(inputSelector, imgSelector) {
  let inputPassword = document.querySelector(inputSelector);
  let hidePassword = document.querySelector(imgSelector);

  if (inputPassword && hidePassword) {
    // 요소가 존재하는지 확인
    hidePassword.addEventListener("click", function () {
      if (inputPassword.type === "password") {
        inputPassword.type = "text";
        hidePassword.src = "../../assets/icons/비밀번호 보이기.svg";
      } else {
        inputPassword.type = "password";
        hidePassword.src = "../../assets/icons/비밀번호 가리기.svg";
      }
    });
  }
}

// 로그인 비밀번호 토글
togglePasswordVisibility("#login-pw", ".hide-pw-img");

// 회원가입 비밀번호 토글
togglePasswordVisibility("#sign-up_pw", ".sign-up_hide-pw-img");
