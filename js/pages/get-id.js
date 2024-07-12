document.addEventListener("DOMContentLoaded", function () {
  var username = sessionStorage.getItem("username");
  var sent = "고객님의 아이디는 " + username + " 입니다.";
  if (username) {
    document.querySelector(".email").innerText = sent;
  } else {
    console.log("No email found in session storage.");
  }
});
