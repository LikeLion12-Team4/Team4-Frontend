// const naverLogin = new naver.LoginWithNaverId({
//   clientId: "zYwQyJbcQEHaGmhJn_cv",
//   callbackUrl: "http://127.0.0.1:8000/html/pages/survey.html",
//   loginButton: { color: "green", type: 1, height: 43 },
// });

// naverLogin.init();

// // naverLogin.getLoginStatus(function (status) {
// //   if (status) {
// //     const nickName = naverLogin.user.getNickName();
// //     const age = naverLogin.user.getAge();
// //     const birthday = naverLogin.user.getBirthday();

// //     if (nickName === null || nickName === undefined) {
// //       alert("별명이 필요합니다. 정보제공을 동의해주세요.");
// //       naverLogin.reprompt();
// //       return;
// //     } else {
// //       setLoginStatus();
// //     }
// //   }
// // });
// // console.log(naverLogin);

// // 로그아웃 버튼.. 나중에...
// // function setLoginStatus() {
// //   const message_area = document.getElementById("message");
// //   message_area.innerHTML = `
// //      <h3> Login 성공 </h3>
// //      <div>user Nickname : ${naverLogin.user.nickname}</div>
// //      <div>user Age(범위) : ${naverLogin.user.age}</div>
// //      <div>user Birthday : ${naverLogin.user.birthday}</div>
// //      `;

// //   const button_area = document.getElementById("button_area");
// //   button_area.innerHTML = "<button id='btn_logout'>로그아웃</button>";

// //   const logout = document.getElementById("btn_logout");
// //   logout.addEventListener("click", (e) => {
// //     naverLogin.logout();
// //     location.replace("main.html");
// //   });
// // }

// // document.addEventListener("DOMContentLoaded", function () {
// //   const url = window.location.href;
// //   console.log(url);

// //   const codeIndex = url.indexOf("=") + 1;
// //   const AuthorizationCode = url.slice(codeIndex, url.length).trim();
// //   console.log(AuthorizationCode);

// //   function setCookie(name, value, days) {
// //     var expires = "";
// //     if (days) {
// //       var date = new Date();
// //       date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
// //       expires = "; expires=" + date.toUTCString();
// //     }
// //     document.cookie = name + "=" + value + expires + "; path=/";
// //   }

// //   function naverLoginForm() {
// //     var formdata = new FormData();
// //     formdata.append("code", AuthorizationCode);

// //     // // 사용자가 입력한 정보를 가져옵니다.
// //     // const nickName = naverLogin.user.getNickName();
// //     // const email = naverLogin.user.getEmail();

// //     // // FormData 객체를 생성하고 사용자 입력을 추가합니다.
// //     // var formdata = new FormData();
// //     // formdata.append("username", nickName);
// //     // formdata.append("email", email);

// //     // 서버에 로그인 요청을 보냅니다.
// //     var requestOptions = {
// //       method: "POST",
// //       body: formdata,
// //       redirect: "follow",
// //     };

// //     // 서버에 로그인 요청을 보냅니다.
// //     fetch("http://3.37.90.114:8000/naver/login/finish/", requestOptions)
// //       .then((response) => {
// //         if (response.status != 200) {
// //           throw new Error("Login failed");
// //         }
// //         console.log(response);
// //         return response.json();
// //       })
// //       .then((data) => {
// //         console.log(data);
// //         alert("로그인이 성공적으로 완료되었습니다!");

// //         // 서버로부터 받은 토큰을 쿠키에 저장합니다.
// //         var token = data.access_token;

// //         // 반환된 access_token을 사용하여 다른 URL에 POST 요청을 보냅니다.
// //         var additionalFormData = new FormData();
// //         additionalFormData.append("access_token", token); // 필요한 데이터 추가

// //         var additionalRequestOptions = {
// //           method: "POST",
// //           body: additionalFormData,
// //           redirect: "follow",
// //         };

// //         return fetch(
// //           "http://3.37.90.114:8000/naver/jwt/",
// //           additionalRequestOptions
// //         );
// //       })
// //       .then((response) => {
// //         if (response.status != 200) {
// //           throw new Error("Additional request failed");
// //         }
// //         return response.json();
// //       })
// //       .then((additionalData) => {
// //         console.log(additionalData);
// //         setCookie("accessToken", additionalData.access_token, 1);
// //         setCookie("refreshToken", additionalData.refresh_token, 1);

// //         // 회원가입 성공 시 설문 페이지로 이동
// //         window.location.replace("survey.html");
// //       })
// //       .catch((error) => {
// //         console.log("error", error);
// //       });
// //   }
// //   naverLoginForm();
// // });

// ************************
var naverLogin = new naver.LoginWithNaverId({
  clientId: "zYwQyJbcQEHaGmhJn_cv", //내 애플리케이션 정보에 cliendId를 입력해줍니다.
  callbackUrl: "http://127.0.0.1:8000/html/pages/naver-login.html", // 내 애플리케이션 API설정의 Callback URL 을 입력해줍니다.
  isPopup: false,
  loginButton: { color: "green", type: 1, height: 43 },
});

naverLogin.init();

// ***************************
// var naverLogin = new naver.LoginWithNaverId({
//   clientId: "zYwQyJbcQEHaGmhJn_cv", // 내 애플리케이션 정보에 clientId를 입력해줍니다.
//   callbackUrl: "http://127.0.0.1:8000/html/pages/naver-login.html", // 내 애플리케이션 API설정의 Callback URL을 입력해줍니다.
//   isPopup: false,
//   callbackHandle: true,
// });

// // 네아로 로그인 정보를 초기화하기 위하여 init 호출
// naverLogin.init();

// // 쿠키 설정 함수
// function setCookie(name, value, days) {
//   var expires = "";
//   if (days) {
//     var date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// // 쿠키 가져오기 함수
// function getCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(";");
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == " ") c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) == 0)
//       return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

// // 액세스 토큰을 URL 해시에서 추출
// const getTokenFromHash = () => {
//   const hash = window.location.hash.substring(1); // 해시에서 '#' 기호를 제거
//   const params = new URLSearchParams(hash); // 해시를 파라미터로 변환
//   const token = params.get("access_token"); // 'access_token' 파라미터 값 추출
//   // 토큰이 제대로 추출되었는지 확인하기 위해 콘솔 로그를 사용
//   console.log("Access Token:", token);
//   // 액세스 토큰을 쿠키에 저장
//   if (token) {
//     setCookie("access_token", token, 1); // 쿠키에 저장, 유효 기간 1일
//     // 서버와 통신하여 토큰을 검증
//     var formData = new FormData();
//     formData.append("access_token", token);
//     fetch("http://3.37.90.114:8000/naver/login/finish/", {
//       method: "POST",
//       body: formData,
//       redirect: "follow",
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(
//             "Network response was not ok " + response.statusText
//           );
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.access_token) {
//           setCookie("access_token", data.access_token, 1);
//           setCookie("refresh_token", data.refresh_token, 1);
//           alert("로그인이 성공적으로 완료되었습니다!");
//           window.location.replace("main.html");
//         } else {
//           console.error("Failed to obtain access token");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert("로그인 처리 중 오류가 발생했습니다.");
//       });
//   } else {
//     console.error("Access Token not found in URL");
//   }
// };

// // URL 해시에서 토큰을 추출
// document.addEventListener("DOMContentLoaded", getTokenFromHash);

// // 보호된 리소스 요청 함수
// function fetchProtectedResource() {
//   var accessToken = getCookie("access_token");
//   if (accessToken) {
//     fetch("http://3.37.90.114:8000/naver/protected-resource/", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => {
//         if (response.status === 401) {
//           refreshAccessToken();
//         } else {
//           return response.json();
//         }
//       })
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   } else {
//     console.error("Access token not found");
//   }
// }

// // 액세스 토큰 갱신 함수
// function refreshAccessToken() {
//   var refreshToken = getCookie("refresh_token");
//   if (refreshToken) {
//     fetch("http://3.37.90.114:8000/naver/refresh-token/", {
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
//           fetchProtectedResource();
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

// ***********************
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

// // 사용자 정보 가져오기 함수
// function getInfo() {
//   Kakao.API.request({
//     url: "/v2/user/me",
//     success: function (res) {
//       console.log(res);
//       var email = res.kakao_account.email;
//       var profile_nickname = res.kakao_account.profile.nickname;

//       // 액세스 토큰을 쿠키에 저장
//       setCookie("access_token", Kakao.Auth.getAccessToken(), 1);

//       // 이메일 정보를 로컬 스토리지에 저장하고 로그인 완료 메시지 표시
//       localStorage.setItem("username", profile_nickname);
//       alert("로그인이 성공적으로 완료되었습니다!");
//       window.location.replace("main.html");
//     },
//     fail: function (error) {
//       alert("카카오 로그인 실패: " + JSON.stringify(error));
//     },
//   });
// }

// 보호된 리소스 요청 함수
function fetchProtectedResource() {
  var accessToken = getCookie("access_token");
  if (accessToken) {
    fetch("http://3.37.90.114:8000/naver/login/finish/", {
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
