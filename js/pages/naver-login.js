function submitLoginForm(event) {
  event.preventDefault(); // 기본 제출 동작을 막습니다.

  // 서버에 로그인 요청을 보냅니다.
  var requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  // 서버에 로그인 요청을 보냅니다.
  fetch(
    "/naver/login/finish/?code=h9U6kcuCnpOFg2heKM&state=STATE_STRING",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      console.log(response);
      return response.json();
    })
    .then((data) => {
      var accessToken = data.token; // 서버로부터 받은 토큰
      // 토큰을 쿠키에 저장합니다.
      setCookie("accessToken", accessToken, 1);
      alert("성공");
      // 로그인이 성공하면 다음 동작을 수행합니다.
      window.location.replace("main.html");
    })
    .catch((error) => {
      alert("아이디나 비밀번호를 다시 확인해주세요", error);
      // 로그인 실패 시 사용자에게 메시지를 표시하는 등의 동작을 수행할 수 있습니다.
    });
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
