document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN = "http://3.37.18.8:8000/users/login/";

  function submitLoginForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    // 사용자가 입력한 아이디과 비밀번호를 가져옵니다.
    var id = document.getElementById("login-id").value;
    var password = document.getElementById("login-pw").value;

    // FormData 객체를 생성하고 사용자 입력을 추가합니다.
    var formdata = new FormData();
    formdata.append("username", id);
    formdata.append("password", password);

    // 서버에 로그인 요청을 보냅니다.
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    // 서버에 로그인 요청을 보냅니다.
    fetch(API_SERVER_DOMAIN, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        var accessToken = data.token; // 서버로부터 받은 토큰
        // 토큰을 쿠키에 저장합니다.
        setCookie("accessToken", accessToken, 1);
        sessionStorage.setItem("isLogin", true);
        var isLogin = sessionStorage.getItem("isLogin");
        alert(isLogin)
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

  function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  // 로그인 폼에 이벤트 리스너를 추가합니다.
  document
    .getElementById("login-btn")
    .addEventListener("click", submitLoginForm);
});
