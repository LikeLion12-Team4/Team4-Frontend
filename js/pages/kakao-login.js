document.addEventListener("DOMContentLoaded", function () {
  const url = window.location.href;
  console.log(url);

  const codeIndex = url.indexOf("=") + 1;
  const AuthorizationCode = url.slice(codeIndex, url.length).trim();
  console.log(AuthorizationCode);

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function kakaoLoginForm() {
    var formdata = new FormData();
    formdata.append("code", AuthorizationCode);

    // 서버에 로그인 요청을 보냅니다.
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    // 서버에 로그인 요청을 보냅니다.
    fetch("http://3.37.90.114:8000/kakao/login/finish/", requestOptions)
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Login failed");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("로그인이 성공적으로 완료되었습니다!");

        // 서버로부터 받은 토큰을 쿠키에 저장합니다.
        var token = data.access_token;

        // 반환된 access_token을 사용하여 다른 URL에 POST 요청을 보냅니다.
        var additionalFormData = new FormData();
        additionalFormData.append("access_token", token); // 필요한 데이터 추가

        var additionalRequestOptions = {
          method: "POST",
          body: additionalFormData,
          redirect: "follow",
        };

        return fetch(
          "http://3.37.90.114:8000/kakao/jwt/",
          additionalRequestOptions
        );
      })
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Additional request failed");
        }
        return response.json();
      })
      .then((additionalData) => {
        console.log(additionalData);
        setCookie("accessToken", additionalData.access_token, 1);
        setCookie("refreshToken", additionalData.refresh_token, 1);

        // 회원가입 성공 시 설문 페이지로 이동
        window.location.replace("survey.html");
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  kakaoLoginForm();
});

// const KaApiKey = KAKAO_API_KEY;
// //2. 카카오 초기화
// Kakao.init(bc722e2b433f46dd008869cc117eeb18);
// Kakao.isInitialized();
// //3. 카카오로그인 코드 확인
// function loginWithKakao() {
//   Kakao.Auth.login({
//     success: function (authObj) {
//       console.log(authObj); //access토큰 값
//       Kakao.Auth.setAccessToken(authObj.access_token); //access 토큰 값 저장
//       getInfo();
//     },
//     fail: function (err) {
//       console.log(err);
//     },
//   });
// }
// //4. 엑세스 토큰을 발급받고, 아래 함수를 호출시켜 사용자 정보 받아옴.
// function getInfo() {
//   Kakao.API.request({
//     url: "/v2/user/me",
//     success: function (res) {
//       console.log(res);
//       var email = res.kakao_account.email;
//       var profile_nickname = res.kakao_account.profile.nickname;
//       localStorage.setItem("username", profile_nickname);
//       localStorage.setItem("email", email);
//       console.log(profile_nickname);
//       console.log(id);
//     },
//     fail: function (error) {
//       alert("카카오 로그인 실패" + JSON.stringify(error));
//     },
//   });
// }

// //5.로그아웃 기능 - 카카오 서버에 접속하는 액세스 토큰을 만료 시킨다.
// function kakaoLogOut() {
//   if (!Kakao.Auth.getAccessToken()) {
//     alert("로그인을 먼저 하세요.");
//     return;
//   }
//   Kakao.Auth.logout(function () {
//     alert("로그아웃" + Kakao.Auth.getAccessToken());
//   });
// }
