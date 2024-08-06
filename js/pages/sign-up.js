document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN_JOIN = "https://stand-up-back.store/users/join/";
  var API_SERVER_DOMAIN_EMAIL_SEND = "https://stand-up-back.store/email/send/";
  var API_SERVER_DOMAIN_EMAIL_VERIFY =
    "https://stand-up-back.store/email/verify/";

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function submitSignUpForm(event) {
    event.preventDefault();

    var username = document.getElementById("sign-up_id").value;
    var password = document.getElementById("sign-up_pw").value;
    var email = document.getElementById("sign-up_email").value;
    var fullname = document.getElementById("sign-up_name").value;

    var formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("email", email);
    formdata.append("fullname", fullname);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_JOIN, requestOptions)
      .then((response) => {
        if (response.status != 201) {
          throw new Error("Sign-up failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        sessionStorage.setItem("fullname", fullname);
        alert("회원가입이 성공적으로 완료되었습니다!");
        setCookie("accessToken", data.token, 1);
        window.location.replace("survey.html");
      })
      .catch((error) => {
        console.log("error", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  function sendVerificationNumber(event) {
    event.preventDefault();

    var email = document.getElementById("sign-up_email").value;

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    var formdata = new FormData();
    formdata.append("email", email);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_EMAIL_SEND, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Verification email send failed");
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
        alert("인증번호가 이메일로 전송되었습니다.");
        startTimer();
      })
      .catch((error) => {
        console.log("error", error);
        alert("인증번호 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  function verifyEmail(event) {
    event.preventDefault();

    var email = document.getElementById("sign-up_email").value;
    var verifyCode = document.getElementById(
      "sign-up_verification-number"
    ).value;

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!verifyCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    var formdata = new FormData();
    formdata.append("verify", verifyCode);
    formdata.append("email", email);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_EMAIL_VERIFY, requestOptions)
      .then((response) => {
        if (response.status != 202) {
          throw new Error("Verification failed");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        alert("인증번호가 확인되었습니다.");
        clearInterval(timer);
      })
      .catch((error) => {
        console.log("error", error);
        alert("인증번호 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  document
    .getElementById("sign-up_next")
    .addEventListener("click", submitSignUpForm);
  document
    .getElementById("send_verification-number")
    .addEventListener("click", sendVerificationNumber);
  document
    .getElementById("resend_verification-number")
    .addEventListener("click", sendVerificationNumber);
  document
    .getElementById("check_verification-number")
    .addEventListener("click", verifyEmail);

  const remainingTime = document.querySelector(".remaining-time");
  const remainingMin = document.querySelector(".remaining-min");
  const remainingSec = document.querySelector(".remaining-sec");
  const sendBtn = document.querySelector("#send_verification-number");
  const checkBtn = document.querySelector("#check_verification-number");
  const resendBtn = document.querySelector("#resend_verification-number");

  let time = 180;
  let timer;

  const startTimer = () => {
    remainingTime.classList.remove("hide");

    timer = setInterval(function () {
      if (time > 0) {
        time -= 1;
        let min = Math.floor(time / 60);
        let sec = String(time % 60).padStart(2, "0");
        remainingMin.innerText = min;
        remainingSec.innerText = sec;
      } else {
        sendBtn.disabled = true;
        checkBtn.disabled = true;
        sendBtn.style.backgroundColor = "gray";
        checkBtn.style.backgroundColor = "gray";
        clearInterval(timer);
      }
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timer);
    time = 180;
    sendBtn.disabled = false;
    checkBtn.disabled = false;
    sendBtn.style.backgroundColor = "";
    checkBtn.style.backgroundColor = "";
    startTimer();
  };

  document
    .getElementById("sign-up_email")
    .addEventListener("input", function () {
      var email = this.value;
      sendBtn.disabled = !email;
      resendBtn.disabled = !email;
    });

  resendBtn.addEventListener("click", resetTimer);
});
