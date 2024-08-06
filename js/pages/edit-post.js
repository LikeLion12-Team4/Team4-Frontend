// 로그인 정보 가져오기

let API_SERVER_DOMAIN = "https://stand-up-back.store";

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

function checkAndFetch(url, options = {}) {
  const token = getToken();
  if (!token) {
    window.location.href = "../../html/pages/login.html";
    return Promise.reject("No token found");
  }

  if (!(options.body instanceof FormData)) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  });
}

function fetchUserInfo() {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    redirect: "follow",
  };

  checkAndFetch("https://stand-up-back.store/users/user/", requestOptions)
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
    window.location.href = "../../html/pages/login.html";
    return;
  }

  currentPostId = getPostIdFromUrl();
  if (!currentPostId) {
    alert("게시글 ID를 찾을 수 없습니다.");
    window.location.href = "../../html/pages/community.html";
    return;
  }

  fetchPostDetails(currentPostId);

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
  }

  const postingButton = document.querySelector(".postingButton");
  if (postingButton) {
    postingButton.addEventListener("click", function (event) {
      event.preventDefault();
      updatePost();
    });
  }
});

function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function fetchPostDetails(postId) {
  checkAndFetch(`${API_SERVER_DOMAIN}/post/get/${postId}/`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((post) => {
      fillPostForm(post);
    })
    .catch((error) => {
      console.error("게시글 정보 가져오기 실패:", error);
      alert("게시글 정보를 가져오는데 실패했습니다.");
    });
}

function fillPostForm(post) {
  document.querySelector(".categorySelect").value = post.forum.id;
  document.querySelector(".postingTitle").value = post.title;
  document.querySelector(".postingContent").value = post.content;

  if (post.image) {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = `<img src="${post.image}" alt="현재 이미지"><p>현재 이미지</p>`;
  }
}

function updatePost() {
  const title = document.querySelector(".postingTitle").value;
  const content = document.querySelector(".postingContent").value;
  const categorySelect = document.querySelector(".categorySelect");
  const categoryId = categorySelect.value;
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

  checkAndFetch(`${API_SERVER_DOMAIN}/post/retrieve/${currentPostId}/`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("게시글이 성공적으로 수정되었습니다:", data);
      alert("게시글이 성공적으로 수정되었습니다.");
      window.location.href = `../../html/pages/post.html?id=${currentPostId}`;
    })
    .catch((error) => {
      console.error("게시글 수정 중 오류 발생:", error);
      alert(`게시글 수정 중 오류가 발생했습니다: ${error.message}`);
    });
}
