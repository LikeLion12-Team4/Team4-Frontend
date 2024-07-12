document.addEventListener("DOMContentLoaded", function () {
  var API_SERVER_DOMAIN = "http://3.37.18.8:8000/users/survey/";

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

  function submitSurveyForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    // 선택된 신체 부위를 가져옵니다.
    var selectedParts = selectedBody;

    // FormData 객체를 생성하고 사용자 입력을 추가합니다.
    var formdata = new FormData();
    formdata.append("bodypart", selectedParts);

    // 쿠키에서 인증 토큰을 가져옵니다.
    var accessToken = getCookie("accessToken");

    // 서버에 설문조사 결과를 보냅니다.
    var requestOptions = {
      method: "PUT",
      headers: {
        // Authorization: "Bearer " + accessToken,
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNzUzMDE1LCJpYXQiOjE3MjA3NDk0MTUsImp0aSI6IjJlOWQwOWQwMTZmMTQyNmNiZWNjNDg0ZGZlOTkxODE1IiwidXNlcl9pZCI6MjF9.RHxaEcw0gERJ2onP7p-70wjo5bAWnBvT07hNqgh6tkw",
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
