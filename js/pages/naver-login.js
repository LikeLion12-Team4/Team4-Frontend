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

var naverLogin = new naver.LoginWithNaverId({
  clientId: "zYwQyJbcQEHaGmhJn_cv", //내 애플리케이션 정보에 cliendId를 입력해줍니다.
  callbackUrl: "http://127.0.0.1:8000/html/pages/naver-login.html", // 내 애플리케이션 API설정의 Callback URL 을 입력해줍니다.
  isPopup: false,
  loginButton: { color: "green", type: 1, height: 43 },
});

naverLogin.init();
