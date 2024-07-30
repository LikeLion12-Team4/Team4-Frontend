// document.addEventListener("DOMContentLoaded", function () {
//   const CLIENT_ID = "16f602893738411c9cd970b4c387e849";
//   const REDIRECT_URI = "http://127.0.0.1:8000/html/pages/kakao-empty.html";

//   const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
//   document.getElementById("kakao-login-btn").href = KAKAO_AUTH_URL;
// });

// 쿠키 설정 함수
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  var domain = window.location.hostname;
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
}

// 쿠키 가져오기 함수
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// 페이지 로드 후 Kakao 초기화
document.addEventListener("DOMContentLoaded", function () {
  // Kakao SDK 초기화
  Kakao.init("YOUR_CLIENT_ID_HERE");
  console.log(Kakao.isInitialized()); // true가 출력되어야 함

  // 쿠키에서 액세스 토큰을 가져와 로그인 상태를 유지
  var accessToken = getCookie("access_token");
  if (accessToken) {
    Kakao.Auth.setAccessToken(accessToken);
    getInfo(); // 또는 필요한 로직을 수행합니다.
  }
});

// URL에서 인가 코드 추출 후 처리
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");
  console.log(authCode);

  if (authCode) {
    var formdata = new FormData();
    formdata.append("code", authCode);

    // 서버에 로그인 요청을 보냅니다.
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://3.37.90.114:8000/kakao/login/finish/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
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
        console.log(data.access_token);
        window.location.replace("main.html");
      })
      .catch((error) => {
        console.log("error", error);
      });
  } else {
    console.error("Authorization code not found");
  }
});

// 사용자 정보 가져오기 함수
function getInfo() {
  Kakao.API.request({
    url: "/v2/user/me",
    success: function (res) {
      console.log(res);
      var email = res.kakao_account.email;
      var profile_nickname = res.kakao_account.profile.nickname;

      // 액세스 토큰을 쿠키에 저장
      setCookie("access_token", Kakao.Auth.getAccessToken(), 1);

      // 이메일 정보를 로컬 스토리지에 저장하고 로그인 완료 메시지 표시
      localStorage.setItem("username", profile_nickname);
      alert("로그인이 성공적으로 완료되었습니다!");
      window.location.replace("main.html");
    },
    fail: function (error) {
      alert("카카오 로그인 실패: " + JSON.stringify(error));
    },
  });
}

// 보호된 리소스 요청 함수
function fetchProtectedResource() {
  var accessToken = getCookie("access_token");
  if (accessToken) {
    fetch("http://3.37.90.114:8000/kakao/login/finish/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // 토큰이 만료된 경우, 리프레시 토큰을 사용해 새 토큰을 받아옵니다.
          refreshAccessToken();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.error("Access token not found");
  }
}

// 액세스 토큰 갱신 함수
function refreshAccessToken() {
  var refreshToken = getCookie("refresh_token");
  if (refreshToken) {
    // 리프레시 토큰을 사용해 새로운 액세스 토큰을 받아옵니다.
    fetch("http://3.37.90.114:8000/kakao/login/finish/", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          setCookie("access_token", data.access_token, 1);
          fetchProtectedResource(); // 새 토큰으로 다시 요청을 보냅니다.
        } else {
          console.error("Failed to refresh access token");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.error("Refresh token not found");
  }
}
