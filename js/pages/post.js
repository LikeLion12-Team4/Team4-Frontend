// 로그인 정보 가져오기

let API_SERVER_DOMAIN = "http://3.37.90.114:8000";

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

function checkAndFetch(url, options) {
  // 토큰 존재하는지 확인 후 fetch하는 로직
  const token = getToken();
  if (!token) {
    window.location.href = "../../html/pages/login.html"; // 로그인 페이지 URL로 변경하세요
    return Promise.reject("No token found");
  }
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, options);
}

function fetchUserInfo() {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    redirect: "follow",
  };

  checkAndFetch("http://3.37.90.114:8000/users/user/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // 닉네임 업데이트
      const nicknameElements = document.querySelectorAll(".nickname");
      nicknameElements.forEach((element) => {
        element.textContent = result.username;
      });

      // 아이디 업데이트
      const idElement = document.querySelector(
        ".profileMenu:nth-child(2) .profileMenuValue"
      );
      if (idElement) {
        idElement.textContent = result.username;
      }

      // 이름 업데이트
      const nameElement = document.querySelector(
        ".profileMenu:nth-child(4) .profileMenuValue"
      );
      if (nameElement) {
        nameElement.textContent = result.fullname;
      }

      // 이메일 업데이트
      const emailElement = document.querySelector(
        ".profileMenu:nth-child(5) .profileMenuValue"
      );
      if (emailElement) {
        emailElement.textContent = result.email;
      }
    })
    .catch((error) => console.log("error", error));
}

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

// 글쓰기 기능 js

document.addEventListener("DOMContentLoaded", function () {
  const token = getToken();
  if (!token) {
    window.location.href = "../../html/pages/login.html"; // 로그인 페이지 URL로 리다이렉트
    return;
  }

  // fetchUserInfo 함수가 정의되어 있다고 가정
  // fetchUserInfo();

  // 이미지 삽입부분
  const imageUploadInput = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");

  if (imageUploadInput && imagePreview) {
    imageUploadInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.innerHTML = "";
          const img = document.createElement("img");
          img.src = e.target.result;
          imagePreview.appendChild(img);

          const p = document.createElement("p");
          p.textContent = `파일명: ${file.name}`;
          imagePreview.appendChild(p);
        };
        reader.readAsDataURL(file);
      }
    });
  } else {
    console.error("이미지 업로드 요소를 찾을 수 없습니다.");
  }

  // 게시글 등록 버튼 클릭 이벤트
  const postingButton = document.querySelector(".postingButtonSubmit");
  if (postingButton) {
    postingButton.addEventListener("click", function (event) {
      event.preventDefault();
      submitPost();
    });
  } else {
    console.error("게시글 등록 버튼을 찾을 수 없습니다.");
  }
});

function submitPost() {
  const title = document.querySelector(".postingTitleInput").value;
  const content = document.querySelector(".postingContentInput").value;
  const categorySelect = document.querySelector(".categorySelect");
  const categoryId = categorySelect.value;
  const categoryName =
    categorySelect.options[categorySelect.selectedIndex].text;
  const imageFile = document.getElementById("imageUpload").files[0];

  if (!title || !content || !categoryId) {
    alert("제목, 내용, 카테고리를 모두 입력해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("forum", categoryId);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const API_URL = `${API_SERVER_DOMAIN}/post/${categoryId}/`; // 슬래시 추가

  console.log("Sending request to:", API_URL);

  checkAndFetch(API_URL, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${text}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("게시글이 성공적으로 등록되었습니다:", data);
      alert("게시글이 성공적으로 등록되었습니다.");
      // 성공 후 처리 (예: 게시글 목록 페이지로 리다이렉트)
      // window.location.href = "게시글 목록 페이지 URL";
    })
    .catch((error) => {
      console.error("게시글 등록 중 오류 발생:", error);
      alert(`게시글 등록 중 오류가 발생했습니다: ${error.message}`);
    });
}
