// //******** 회원가입 여부 함수 추가*********

// // 쿠키 설정 함수
// function setCookie(name, value, days) {
//   var expires = "";
//   if (days) {
//     var date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   var domain = window.location.hostname;
//   document.cookie =
//     name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
// }

// // 쿠키 가져오기 함수
// function getCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(";");
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == " ") c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

// // URL에서 인가 코드 추출 후 처리
// document.addEventListener("DOMContentLoaded", function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const authCode = urlParams.get("code");
//   console.log(authCode);

//   if (authCode) {
//     var formdata = new FormData();
//     formdata.append("code", authCode);

//     // 서버에 로그인 요청을 보냅니다.
//     var requestOptions = {
//       method: "POST",
//       body: formdata,
//       redirect: "follow",
//     };

//     fetch("http://3.37.90.114:8000/naver/login/finish/", requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok " + response.statusText);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         alert("로그인이 성공적으로 완료되었습니다!");

//         // 서버로부터 받은 토큰을 쿠키에 저장합니다.
//         var token = data.access_token;

//         // 반환된 access_token을 사용하여 다른 URL에 POST 요청을 보냅니다.
//         var additionalFormData = new FormData();
//         additionalFormData.append("access_token", token); // 필요한 데이터 추가

//         var additionalRequestOptions = {
//           method: "POST",
//           body: additionalFormData,
//           redirect: "follow",
//         };

//         return fetch(
//           "http://3.37.90.114:8000/naver/jwt/",
//           additionalRequestOptions
//         );
//       })
//       .then((response) => {
//         if (response.status != 200) {
//           throw new Error("Additional request failed");
//         }
//         return response.json();
//       })
//       .then((additionalData) => {
//         console.log(additionalData);
//         setCookie("accessToken", additionalData.access_token, 1);
//         setCookie("refreshToken", additionalData.refresh_token, 1);

//         // is_created 값을 확인하여 페이지를 이동합니다.
//         if (additionalData.user_info.is_created) {
//           window.location.replace("survey.html");
//         } else {
//           window.location.replace("main.html");
//         }
//       })
//       .catch((error) => {
//         console.log("error", error);
//       });
//   } else {
//     console.error("Authorization code not found");
//   }
// });

// // 액세스 토큰 갱신 함수
// function refreshAccessToken() {
//   var refreshToken = getCookie("refresh_token");
//   if (refreshToken) {
//     // 리프레시 토큰을 사용해 새로운 액세스 토큰을 받아옵니다.
//     fetch("http://3.37.90.114:8000/naver/login/finish/", {
//       method: "POST",
//       body: JSON.stringify({ refresh_token: refreshToken }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.access_token) {
//           setCookie("access_token", data.access_token, 1);
//           fetchProtectedResource(); // 새 토큰으로 다시 요청을 보냅니다.
//         } else {
//           console.error("Failed to refresh access token");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   } else {
//     console.error("Refresh token not found");
//   }
// }

// *************로그인 시 헤더 로그아웃으로 바뀜********

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

    fetch("http://3.37.90.114:8000/naver/login/finish/", requestOptions)
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
          "http://3.37.90.114:8000/naver/jwt/",
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

        // 로그인 상태를 세션 스토리지에 저장합니다.
        sessionStorage.setItem("isLogin", "true");

        // is_created 값을 확인하여 페이지를 이동합니다.
        if (additionalData.user_info.is_created) {
          window.location.replace("survey.html");
        } else {
          window.location.replace("main.html");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  } else {
    console.error("Authorization code not found");
  }
});

// 액세스 토큰 갱신 함수
function refreshAccessToken() {
  var refreshToken = getCookie("refresh_token");
  if (refreshToken) {
    // 리프레시 토큰을 사용해 새로운 액세스 토큰을 받아옵니다.
    fetch("http://3.37.90.114:8000/naver/login/finish/", {
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
