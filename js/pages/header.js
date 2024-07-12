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
  
  function getToken() {
    return getCookie("accessToken") || null;
  }
  var name ='';
  function getUserInfo() {
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      redirect: "follow",
    };
  
    fetch("http://3.37.18.8:8000/users/user/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        name = result.username;
        document.querySelector('.user_name').innerText = name;
        console.log(name)
        
      })
      .catch((error) => console.log("error", error));
  }
  getUserInfo();
});

