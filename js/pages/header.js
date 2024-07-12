window.addEventListener('load', function() {
  var isLogin = sessionStorage.getItem("isLogin");

    console.log(isLogin);
    // if (isLogin) {
        
    //     document.querySelector(".login_btn").style.visibility = "hidden";
    //     document.querySelector('.signup_btn').style.visibility = "hidden";
    //     document.querySelector('.logout_btn').style.visibility = "visible";
    //     document.querySelector('.welcome_msg').style.visibility = "visible";
    // }
    var isLogin = sessionStorage.getItem("isLogin") === "true";

    if (isLogin) {
        // 로그인 상태일 때의 코드
        document.querySelector(".logout_btn").style.display = "block";
        document.querySelector(".login_btn").style.display = "none";
        document.querySelector('.signup_btn').style.display = "none";
    } else {
        // 비로그인 상태일 때의 코드
        document.querySelector(".logout_btn").style.display = "none";
        document.querySelector(".login_btn").style.display = "block";
        document.querySelector('.signup_btn').style.display = "block";
    }

});

const hardcodedToken = window.APP_CONFIG.hardcodedToken;
function fetchUserInfo() {
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${hardcodedToken}`,
      },
      redirect: "follow",
    };
  
    fetch("http://3.37.18.8:8000/users/user/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // 닉네임 업데이트
        const usernameElements = document.querySelectorAll(".user_name");
        usernameElements.forEach((element) => {
          element.textContent = result.username;
        });
    });
}