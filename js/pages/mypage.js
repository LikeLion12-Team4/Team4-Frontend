const myToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNjIzMzI4LCJpYXQiOjE3MjA2MTk3MjgsImp0aSI6IjQ1MjJiZWM1OWMzNzQwMjU5YzA1NzZlMTIzZTM4YzBkIiwidXNlcl9pZCI6MX0.-Z-J6ZnJpK9PhgQ8fwraR6d5ut8yRI2RsM522S_ZFok";
// 테스트용!! 삭제

// include.js
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

document // '펼치기' -> 내 프로필 페이지로 이동
  .getElementById("profile-button")
  .addEventListener("click", function () {
    window.location.href = "../../html/pages/profile.html";
  });

document // 개수 클릭하면 좋아요 표시한 영상 페이지로 이동
  .getElementById("liked_video")
  .addEventListener("click", function () {
    window.location.href = "../../html/pages/liked-videos.html";
  });

document // 최근 시청한 영상 띄워주기
  .getElementById("recent_video")
  .addEventListener("click", function () {
    // 로그인 토큰을 가져오는 로직 (예: localStorage에서)
    const token = localStorage.getItem("userToken");

    if (!token) {
      console.log("사용자가 로그인하지 않았습니다.");
      // 로그인 페이지로 리다이렉트하거나 로그인 요청 메시지를 표시
      return;
    }

    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch("http://3.37.18.8:8000/users/user/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        const recentVideoLink = result.recent_video.youtube_link;
        if (recentVideoLink) {
          window.open(recentVideoLink, "_blank"); //새창에서 열기!
        } else {
          console.log("최근 시청한 영상이 없습니다.");
        }
      })
      .catch((error) => console.log("error", error));
  });
