document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN_EMAIL_SEND = "http://3.37.18.8:8000/email/send/";

  function sendVerificationNumber(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    var email = document.getElementById("sign-up_email").value;

    // FormData 객체를 생성하고 이메일을 추가합니다.
    var formdata = new FormData();
    formdata.append("email", email);

    // 서버에 이메일 인증번호 요청을 보냅니다.
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
        // 인증번호 전송 후 타이머 시작 등의 추가 동작을 수행할 수 있습니다.
      })
      .catch((error) => {
        console.log("error", error);
        alert("인증번호 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  // 인증번호 전송 버튼에 이벤트 리스너를 추가합니다.
  document
    .getElementById("send_verification-number")
    .addEventListener("click", sendVerificationNumber);
});
