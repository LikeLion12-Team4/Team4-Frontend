document.addEventListener("DOMContentLoaded", () => {
  const remainingTime = document.querySelector(".remaining-time");
  const remainingMin = document.querySelector(".remaining-min");
  const remainingSec = document.querySelector(".remaining-sec");
  const sendBtn = document.querySelector("#send_verification-number");
  const checkBtn = document.querySelector("#check_verification-number");
  const resendBtn = document.querySelector("#resend_verification-number");
  const emailInput = document.querySelector("#sign-up_email");
  const verificationInput = document.querySelector(
    "#sign-up_verification-number"
  );

  let time = 180;
  let timer;

  const updateSendBtnState = () => {
    if (emailInput.value.trim() !== "") {
      sendBtn.disabled = false;
      sendBtn.style.backgroundColor = "";
    } else {
      sendBtn.disabled = true;
      sendBtn.style.backgroundColor = "gray";
    }
  };

  const startTimer = () => {
    remainingTime.classList.remove("hide");
    timer = setInterval(() => {
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

  const sendEmail = async () => {
    const email = emailInput.value;
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("https://stand-up-back.store/email/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        throw new Error("이메일 전송 실패");
      }

      alert("인증번호가 전송되었습니다.");
      startTimer();
    } catch (error) {
      console.error("error", error);
      alert("인증번호 전송에 실패했습니다.");
    }
  };

  const verifyEmail = async () => {
    const email = emailInput.value;
    const code = verificationInput.value;

    if (!code) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "https://stand-up-back.store/email/verify/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: email, code: code }),
        }
      );

      if (!response.ok) {
        throw new Error("인증 실패");
      }

      clearInterval(timer);
      alert("인증에 성공했습니다.");
    } catch (error) {
      console.error("error", error);
      alert("인증번호 확인에 실패했습니다.");
    }
  };

  emailInput.addEventListener("input", updateSendBtnState);
  sendBtn.addEventListener("click", sendEmail);
  resendBtn.addEventListener("click", () => {
    resetTimer();
    sendEmail();
  });
  checkBtn.addEventListener("click", verifyEmail);

  updateSendBtnState(); // 초기 상태 업데이트
});
