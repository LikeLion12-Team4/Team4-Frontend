document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN_JOIN = "http://3.37.18.8:8000/users/reset_pwd/";

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

  function resetPwForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    // 사용자가 입력한 정보를 가져옵니다.
    var password = document.getElementById("new-pw").value;
    console.log(password);
    var re_password = document.getElementById("check_new-pw").value;
    console.log(re_password);

    // FormData 객체를 생성하고 사용자 입력을 추가합니다.
    var formdata = new FormData();
    formdata.append("password", password);
    formdata.append("re_password", re_password);

    // 쿠키에서 인증 토큰을 가져옵니다.
    var accessToken = getCookie("accessToken");

    // 서버에 회원가입 요청을 보냅니다.
    var requestOptions = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_JOIN, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("새 비밀번호 설정 성공!");

        // // 서버로부터 받은 토큰을 쿠키에 저장합니다.
        // setCookie("accessToken", data.accessToken, 1);

        // 성공 시 설문 페이지로 이동
        window.location.replace("login.html");
      })
      .catch((error) => {
        console.log("error", error);
        alert("새 비밀번호 설정 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  document
    .querySelector(".get-pw_login")
    .addEventListener("click", resetPwForm);
});
