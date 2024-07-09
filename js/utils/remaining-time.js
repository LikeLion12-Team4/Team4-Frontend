document.addEventListener("DOMContentLoaded", () => {
  const remainingTime = document.querySelector(".remaining-time");
  const remainingMin = document.querySelector(".remaining-min");
  const remainingSec = document.querySelector(".remaining-sec");
  const sendBtn = document.querySelector("#send_verification-number");
  const checkBtn = document.querySelector("#check_verification-number");
  const resendBtn = document.querySelector("#resend_verification-number");

  let time = 180;
  let timer; // 타이머 ID를 저장할 변수

  const startTimer = () => {
    remainingTime.classList.remove("hide"); // 인증번호 전송 버튼 클릭 시 remaining-time 나타남

    timer = setInterval(function () {
      if (time > 0) {
        time -= 1;
        let min = Math.floor(time / 60);
        let sec = String(time % 60).padStart(2, "0");
        remainingMin.innerText = min;
        remainingSec.innerText = sec;
      } else {
        // 0초가 되면 인증번호 전송&확인 버튼 비활성화
        sendBtn.disabled = true;
        checkBtn.disabled = true;
        sendBtn.style.backgroundColor = "gray";
        checkBtn.style.backgroundColor = "gray";
        clearInterval(timer); // 타이머 정지
      }
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timer); // 기존 타이머 정지
    time = 180; // 시간 초기화
    sendBtn.disabled = false;
    checkBtn.disabled = false;
    sendBtn.style.backgroundColor = "";
    checkBtn.style.backgroundColor = "";
    startTimer(); // 타이머 재시작
  };

  sendBtn.addEventListener("click", startTimer);
  resendBtn.addEventListener("click", resetTimer);
});
