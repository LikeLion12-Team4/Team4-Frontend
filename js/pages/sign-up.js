// document.getElementById('sign-up-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     fetch('http://3.37.18.8:8000/users/join/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({username: username, password: password}),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

// });

// document.addEventListener("DOMContentLoaded", function () {
//   var API_SERVER_DOMAIN_JOIN = "http://3.37.18.8:8000/users/join/";

//   function submitSignUpForm(event) {
//     event.preventDefault(); // 기본 제출 동작을 막습니다.

//     // 사용자가 입력한 정보를 가져옵니다.
//     var username = document.getElementById("sign-up_id").value;
//     var password = document.getElementById("sign-up_pw").value;
//     var email = document.getElementById("sign-up_email").value;
//     var fullname = document.getElementById("sign-up_name").value;

//     // FormData 객체를 생성하고 사용자 입력을 추가합니다.
//     var formdata = new FormData();
//     formdata.append("username", username);
//     formdata.append("password", password);
//     formdata.append("email", email);
//     formdata.append("fullname", fullname);

//     // 서버에 회원가입 요청을 보냅니다.
//     var requestOptions = {
//       method: "POST",
//       body: formdata,
//       redirect: "follow",
//     };

//     fetch(API_SERVER_DOMAIN_JOIN, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Sign-up failed");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         alert("회원가입이 성공적으로 완료되었습니다!");
//         window.location.replace("/pages/survey.html");
//       })
//       .catch((error) => {
//         console.log("error", error);
//         alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
//       });
//   }

//   // 회원가입 폼에 이벤트 리스너를 추가합니다.
//   document.querySelector("form").addEventListener("submit", submitSignUpForm);
// });

document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN_JOIN = "http://3.37.18.8:8000/users/join/";
  var API_SERVER_DOMAIN_EMAIL_SEND = "http://3.37.18.8:8000/email/send/";
  var API_SERVER_DOMAIN_EMAIL_VERIFY = "http://3.37.18.8:8000/email/verify/";

  function submitSignUpForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    // 사용자가 입력한 정보를 가져옵니다.
    var username = document.getElementById("sign-up_id").value;
    var password = document.getElementById("sign-up_pw").value;
    var email = document.getElementById("sign-up_email").value;
    var fullname = document.getElementById("sign-up_name").value;

    // FormData 객체를 생성하고 사용자 입력을 추가합니다.
    var formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("email", email);
    formdata.append("fullname", fullname);

    // 서버에 회원가입 요청을 보냅니다.
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_JOIN, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Sign-up failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("회원가입이 성공적으로 완료되었습니다!");
        window.location.replace("/pages/survey.html");
      })
      .catch((error) => {
        console.log("error", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  function sendVerificationNumber(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    var email = document.getElementById("sign-up_email").value;

    // FormData 객체를 생성하고 이메일을 추가합니다.
    var formdata = new FormData();
    formdata.append("email", email);

    // 서버에 이메일 인증번호 요청을 보냅니다.
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_EMAIL_SEND, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Verification email send failed");
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
        alert("인증번호가 이메일로 전송되었습니다.");
        // 인증번호 전송 후 타이머 시작 등의 추가 동작을 수행할 수 있습니다.
      })
      .catch((error) => {
        console.log("error", error);
        alert("인증번호 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  function verifyEmail(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    var email = document.getElementById("sign-up_email").value;
    var verifyCode = document.getElementById(
      "sign-up_verification-number"
    ).value;

    // FormData 객체를 생성하고 이메일과 인증번호를 추가합니다.
    var formdata = new FormData();
    formdata.append("verify", verifyCode);
    formdata.append("email", email);

    // 서버에 인증번호 확인 요청을 보냅니다.
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(API_SERVER_DOMAIN_EMAIL_VERIFY, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Verification failed");
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
        alert("인증번호가 확인되었습니다.");
        // 인증번호 확인 후 추가 동작을 수행할 수 있습니다.
      })
      .catch((error) => {
        console.log("error", error);
        alert("인증번호 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }

  // 회원가입 폼에 이벤트 리스너를 추가합니다.
  document.querySelector("form").addEventListener("submit", submitSignUpForm);

  // 인증번호 전송 버튼에 이벤트 리스너를 추가합니다.
  document
    .getElementById("send_verification-number")
    .addEventListener("click", sendVerificationNumber);

  // 인증번호 재전송 버튼에 이벤트 리스너를 추가합니다.
  document
    .getElementById("resend_verification-number")
    .addEventListener("click", sendVerificationNumber);

  // 인증번호 확인 버튼에 이벤트 리스너를 추가합니다.
  document
    .getElementById("check_verification-number")
    .addEventListener("click", verifyEmail);
});

// document.addEventListener("DOMContentLoaded", function () {
//   var API_SERVER_DOMAIN_JOIN = "http://3.37.18.8:8000/users/join/";
//   var API_SERVER_DOMAIN_EMAIL_SEND = "http://3.37.18.8:8000/email/send/";
//   var API_SERVER_DOMAIN_EMAIL_VERIFY = "http://3.37.18.8:8000/email/verify/";

//   function submitSignUpForm(event) {
//     event.preventDefault(); // 기본 제출 동작을 막습니다.

//     // 사용자가 입력한 정보를 가져옵니다.
//     var username = document.getElementById("sign-up_id").value;
//     var password = document.getElementById("sign-up_pw").value;
//     var email = document.getElementById("sign-up_email").value;
//     var fullname = document.getElementById("sign-up_name").value;

//     fetch(API_SERVER_DOMAIN_JOIN, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: username,
//         password: password,
//         email: email,
//         fullname: fullname,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Sign-up failed");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         // 회원가입이 성공하면 다음 동작을 수행합니다.
//         alert("회원가입이 성공적으로 완료되었습니다!");
//         window.location.replace("/pages/survey.html");
//       })
//       .catch((error) => {
//         console.log("error", error);
//         alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
//         // 회원가입 실패 시 사용자에게 메시지를 표시하는 등의 동작을 수행할 수 있습니다.
//       });
//   }

//   function sendVerificationNumber(event) {
//     event.preventDefault(); // 기본 제출 동작을 막습니다.

//     var email = document.getElementById("sign-up_email").value;

//     fetch(API_SERVER_DOMAIN_EMAIL_SEND, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: email,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Verification email send failed");
//         }
//         return response.text();
//       })
//       .then((result) => {
//         console.log(result);
//         alert("인증번호가 이메일로 전송되었습니다.");
//         // 인증번호 전송 후 타이머 시작 등의 추가 동작을 수행할 수 있습니다.
//       })
//       .catch((error) => {
//         console.log("error", error);
//         alert("인증번호 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
//       });
//   }

//   function verifyEmail(event) {
//     event.preventDefault(); // 기본 제출 동작을 막습니다.

//     var email = document.getElementById("sign-up_email").value;
//     var verifyCode = document.getElementById(
//       "sign-up_verification-number"
//     ).value;

//     fetch(API_SERVER_DOMAIN_EMAIL_VERIFY, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: email,
//         verifyCode: verifyCode,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Verification failed");
//         }
//         return response.text();
//       })
//       .then((result) => {
//         console.log(result);
//         alert("인증번호가 확인되었습니다.");
//         // 인증번호 확인 후 추가 동작을 수행할 수 있습니다.
//       })
//       .catch((error) => {
//         console.log("error", error);
//         alert("인증번호 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
//       });
//   }

//   // 회원가입 폼에 이벤트 리스너를 추가합니다.
//   document.querySelector("form").addEventListener("submit", submitSignUpForm);

//   // 인증번호 전송 버튼에 이벤트 리스너를 추가합니다.
//   document
//     .getElementById("send_verification-number")
//     .addEventListener("click", sendVerificationNumber);

//   // 인증번호 재전송 버튼에 이벤트 리스너를 추가합니다.
//   document
//     .getElementById("resend_verification-number")
//     .addEventListener("click", sendVerificationNumber);

//   // 인증번호 확인 버튼에 이벤트 리스너를 추가합니다.
//   document
//     .getElementById("check_verification-number")
//     .addEventListener("click", verifyEmail);
// });
