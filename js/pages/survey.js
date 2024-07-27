// 1
// document.addEventListener("DOMContentLoaded", function () {
//   var API_SERVER_DOMAIN = "http://3.37.18.8:8000/users/survey/";

//   function getCookie(name) {
//     var nameEQ = name + "=";
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = cookies[i];
//       while (cookie.charAt(0) === " ") {
//         cookie = cookie.substring(1, cookie.length);
//       }
//       if (cookie.indexOf(nameEQ) === 0) {
//         return cookie.substring(nameEQ.length, cookie.length);
//       }
//     }
//     return null;
//   }

//   // function getToken() {
//   //   return getCookie("accessToken") || null;
//   // }

//   function submitSurveyForm(event) {
//     event.preventDefault(); // 기본 제출 동작을 막습니다.

//     // 선택된 신체 부위를 가져옵니다.
//     var selectedParts = selectedBody;

//     // FormData 객체를 생성하고 사용자 입력을 추가합니다.
//     var formdata = new FormData();
//     formdata.append("bodypart", selectedParts);

//     // 쿠키에서 인증 토큰을 가져옵니다.
//     var accessToken = getCookie("accessToken");
//     console.log(accessToken);

//     // 서버에 설문조사 결과를 보냅니다.
//     var requestOptions = {
//       method: "PUT",
//       headers: {
//         Authorization: "Bearer " + accessToken,
//         // Authorization:
//         //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNzY5NjI3LCJpYXQiOjE3MjA3NjYwMjcsImp0aSI6IjY1ZGZkOTBhOGJlZTQ5NmNhYTUyZWJjYjJkYzdiM2MyIiwidXNlcl9pZCI6MjF9.LvkcvKqvWwCJaq-25MTVv2SVOHwWu-CEf2GPh-RYDuE",
//       },
//       body: formdata,
//       redirect: "follow",
//     };

//     fetch(API_SERVER_DOMAIN, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Survey submission failed");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         alert("설문조사가 성공적으로 제출되었습니다!");
//         window.location.replace("login.html"); // 설문조사 성공 시 index.html로 이동
//       })
//       .catch((error) => {
//         alert("설문조사 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
//         console.error("Error:", error);
//       });
//   }

//   document
//     .getElementById("survey_submit")
//     .addEventListener("click", submitSurveyForm);

//   let selectedBody = "";

//   window.selectBodyPart = function (part) {
//     const button = document.getElementById(part);

//     if (!selectedBody.includes(part)) {
//       if (selectedBody.length > 0) {
//         selectedBody += "," + part;
//       } else {
//         selectedBody = part;
//       }
//       button.querySelector("img").classList.add("selected");
//     } else {
//       let partsArray = selectedBody.split(",");
//       partsArray = partsArray.filter((p) => p !== part);
//       selectedBody = partsArray.join(",");
//       button.querySelector("img").classList.remove("selected");
//     }

//     console.log(selectedBody);
//   };
// });

// 2
// document.addEventListener("DOMContentLoaded", function () {
//   var API_SERVER_DOMAIN = "http://3.37.18.8:8000/users/survey/";

//   function getCookie(name) {
//     var nameEQ = name + "=";
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = cookies[i];
//       while (cookie.charAt(0) === " ") {
//         cookie = cookie.substring(1, cookie.length);
//       }
//       if (cookie.indexOf(nameEQ) === 0) {
//         return cookie.substring(nameEQ.length, cookie.length);
//       }
//     }
//     return null;
//   }

//   function getToken() {
//     return getCookie("accessToken") || null;
//   }

//   // 회원가입 후 로그인 정보를 쿠키에 저장
//   function handleSignupResponse(response) {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error("Signup failed");
//     }
//   }

//   function storeLoginInfo(data) {
//     // 로그인 정보를 쿠키에 저장 (accessToken)
//     document.cookie = `accessToken=${data.accessToken}; path=/`;
//     // survey.html로 이동
//     window.location.href = "../../html/pages/survey.html";
//   }

//   // 예시 회원가입 처리 코드
//   fetch(signupUrl, requestOptions)
//     .then(handleSignupResponse)
//     .then(storeLoginInfo)
//     .catch((error) => {
//       console.error("Error:", error);
//       alert("회원가입 중 오류가 발생했습니다.");
//     });

//   function submitSurveyForm(event) {
//     event.preventDefault(); // 기본 제출 동작을 막습니다.

//     const token = getToken();
//     if (!token) {
//       window.location.href = "../../html/pages/login.html"; // 로그인 페이지 URL로 리다이렉트시캄ㅇ
//       return;
//     }

//     // 선택된 신체 부위를 가져옵니다.
//     var selectedParts = selectedBody;

//     // FormData 객체를 생성하고 사용자 입력을 추가합니다.
//     var formdata = new FormData();
//     formdata.append("bodypart", selectedParts);

//     // 쿠키에서 인증 토큰을 가져옵니다.
//     // var accessToken = getCookie("accessToken");
//     // console.log(accessToken);

//     // 서버에 설문조사 결과를 보냅니다.
//     var requestOptions = {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//         // Authorization:
//         //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNzY5NjI3LCJpYXQiOjE3MjA3NjYwMjcsImp0aSI6IjY1ZGZkOTBhOGJlZTQ5NmNhYTUyZWJjYjJkYzdiM2MyIiwidXNlcl9pZCI6MjF9.LvkcvKqvWwCJaq-25MTVv2SVOHwWu-CEf2GPh-RYDuE",
//       },
//       body: formdata,
//       redirect: "follow",
//     };

//     checkAndFetch(API_SERVER_DOMAIN, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Survey submission failed");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         alert("설문조사가 성공적으로 제출되었습니다!");
//         window.location.replace("main.html"); // 설문조사 성공 시 index.html로 이동
//       })
//       .catch((error) => {
//         alert("설문조사 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
//         console.error("Error:", error);
//       });
//   }

//   document
//     .getElementById("survey_submit")
//     .addEventListener("click", submitSurveyForm);

//   let selectedBody = "";

//   window.selectBodyPart = function (part) {
//     const button = document.getElementById(part);

//     if (!selectedBody.includes(part)) {
//       if (selectedBody.length > 0) {
//         selectedBody += "," + part;
//       } else {
//         selectedBody = part;
//       }
//       button.querySelector("img").classList.add("selected");
//     } else {
//       let partsArray = selectedBody.split(",");
//       partsArray = partsArray.filter((p) => p !== part);
//       selectedBody = partsArray.join(",");
//       button.querySelector("img").classList.remove("selected");
//     }

//     console.log(selectedBody);
//   };
// });

document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN = "http://3.37.90.114:8000/users/survey/";

  var username = sessionStorage.getItem("username");
  console.log(username);

  var sent = username;
  if (username) {
    document.querySelector(".username").innerText = sent;
  } else {
    console.log("No username found in session storage.");
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
    console.log(cookies);
    return null;
  }

  function getToken() {
    console.log(getCookie("accessToken"));
    return getCookie("accessToken") || null;
  }

  function submitSurveyForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    const token = getToken();
    console.log(token);
    if (!token) {
      window.location.href = "../../html/pages/login.html"; // 로그인 페이지 URL로 리다이렉트

      return;
    }

    // 선택된 신체 부위를 가져옵니다.
    var selectedParts = selectedBody;

    // FormData 객체를 생성하고 사용자 입력을 추가합니다.
    var formdata = new FormData();
    formdata.append("bodypart", selectedParts);

    // 서버에 설문조사 결과를 보냅니다.
    var requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Survey submission failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("설문조사가 성공적으로 제출되었습니다!");
        window.location.replace("main.html"); // 설문조사 성공 시 index.html로 이동
      })
      .catch((error) => {
        alert("설문조사 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
        console.error("Error:", error);
      });
  }

  document
    .getElementById("survey_submit")
    .addEventListener("click", submitSurveyForm);

  let selectedBody = "";

  window.selectBodyPart = function (part) {
    const button = document.getElementById(part);

    if (!selectedBody.includes(part)) {
      if (selectedBody.length > 0) {
        selectedBody += "," + part;
      } else {
        selectedBody = part;
      }
      button.querySelector("img").classList.add("selected");
    } else {
      let partsArray = selectedBody.split(",");
      partsArray = partsArray.filter((p) => p !== part);
      selectedBody = partsArray.join(",");
      button.querySelector("img").classList.remove("selected");
    }

    console.log(selectedBody);
  };
});
