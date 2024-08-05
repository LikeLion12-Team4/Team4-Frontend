document.addEventListener("DOMContentLoaded", function () {
  var isLogin = sessionStorage.getItem("isLogin");

  function change() {
    console.log(isLogin);
    if (isLogin == "true") {
      document.querySelector(".login_btn").style.visibility = "hidden";
      document.querySelector(".signup_btn").style.visibility = "hidden";
      document.querySelector(".logout_btn").style.visibility = "visible";
      document.querySelector(".welcome_msg").style.visibility = "visible";
    } else {
      document.querySelector(".login_btn").style.visibility = "visible";
      document.querySelector(".signup_btn").style.visibility = "visible";
      document.querySelector(".logout_btn").style.visibility = "hidden";
      document.querySelector(".welcome_msg").style.visibility = "hidden";
    }
  }

  change();

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

  function deleteCookie(name) {
    var domain = window.location.hostname;
    document.cookie = name + "=; Max-Age=-99999999; path=/; domain=" + domain;
  }

  function getToken() {
    return getCookie("accessToken") || null;
  }

  var name = "";

  function getUserInfo() {
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      redirect: "follow",
    };

    fetch("https://stand-up-back.store/users/user/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        name = result.fullname;
        document.querySelector(".user_name").innerText = name;
        console.log(name);
      })
      .catch((error) => console.log("error", error));
  }

  getUserInfo();

  window.addEventListener("load", function () {
    var allElements = document.getElementsByTagName("*");
    Array.prototype.forEach.call(allElements, function (el) {
      var includePath = el.dataset.includePath;
      if (includePath) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            el.outerHTML = this.responseText;
          }
        };
        xhttp.open("GET", includePath, true);
        xhttp.send();
      }
    });
  });

  function logout() {
    // 모든 경로와 도메인에 대해 쿠키 삭제
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    sessionStorage.removeItem("isLogin");
    sessionStorage.clear();

    // 디버깅: 로그아웃 후 쿠키 상태 확인
    console.log("accessToken after logout: ", getCookie("accessToken"));
    console.log("refreshToken after logout: ", getCookie("refreshToken"));

    // 로그인 페이지로 이동합니다.
    window.location.replace("login.html");
  }

  // 로그아웃 버튼에 이벤트 리스너를 추가합니다.
  document.querySelector(".logout_btn").addEventListener("click", logout);
});




