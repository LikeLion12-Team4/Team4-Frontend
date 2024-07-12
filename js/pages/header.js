window.addEventListener('load', function() {
    var allElements = this.document.getElementsByTagName('*');
    // var isLogin = sessionStorage.getItem("isLogin");
  var isLogin = false;
  console.log(isLogin);
  if (isLogin) {
    this.document.querySelector(".login_btn").style.display = "none";
    this.document.querySelector('.signup_btn').style.display = "none";
    this.document.querySelector('.logout_btn').style.display = "flex";
    this.document.querySelector('.welcome_msg').style.visibility = "visible";
  }
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
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