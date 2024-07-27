// document.addEventListener("DOMContentLoaded", function () {
//   const url = window.location.href;
//   console.log(url);

//   const codeIndex = url.indexOf("=") + 1;
//   const AuthorizationCode = url.slice(codeIndex, url.length).trim();
//   console.log(AuthorizationCode);

//   function setCookie(name, value, days) {
//     var expires = "";
//     if (days) {
//       var date = new Date();
//       date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//       expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + value + expires + "; path=/";
//   }

//   function kakaoLoginForm() {
//     var formdata = new FormData();
//     formdata.append("code", AuthorizationCode);

//     // 서버에 로그인 요청을 보냅니다.
//     var requestOptions = {
//       method: "POST",
//       body: formdata,
//       redirect: "follow",
//     };

//     // 서버에 로그인 요청을 보냅니다.
//     fetch("http://3.37.90.114:8000/kakao/login/finish/", requestOptions)
//       .then((response) => {
//         if (response.status != 200) {
//           throw new Error("Login failed");
//         }
//         console.log(response);
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         alert("회원가입이 성공적으로 완료되었습니다!");

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
//           "http://3.37.90.114:8000/kakao/jwt/",
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

//         // 회원가입 성공 시 설문 페이지로 이동
//         window.location.replace("survey.html");
//       })
//       .catch((error) => {
//         console.log("error", error);
//       });
//   }
//   kakaoLoginForm();
// });
