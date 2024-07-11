document.addEventListener("DOMContentLoaded", function () {
  var username = sessionStorage.getItem("username");
  var sent = "고객님의 아이디는 " + email + " 입니다.";
  if (email) {
    document.querySelector(".email").innerText = sent;
  } else {
    console.log("No email found in session storage.");
  }
});
