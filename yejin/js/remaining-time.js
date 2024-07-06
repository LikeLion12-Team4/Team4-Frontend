const remainingTime = document.querySelector(".remaining-time");
const remainingMin = document.querySelector(".remaining-min");
const remainingSec = document.querySelector(".remaining-sec");
const sendBtn = document.querySelector("#send_verification-number");
const checkBtn = document.querySelector("#check_verification-number");

let time = 180;
const timeWrap = () => {
  remainingTime.classList.remove("show"); // 인증번호 전송 버튼 클릭 시 remaining-time 나타남

  setInterval(function () {
    if (time > 0) {
      time = time - 1;
      let min = Math.floor(time / 60);
      let sec = String(time % 60).padStart(2, "0");
      remainingMin.innerText = min;
      remainingSec.innerText = sec;
      // time = time - 1
    } else {
      // 0초가 되면 인증번호 전송&확인 버튼 비활성화
      sendBtn.disabled = true;
      checkBtn.disabled = true;
      sendBtn.style.backgroundColor = "gray";
      checkBtn.style.backgroundColor = "gray";
    }
  }, 1000);
};
