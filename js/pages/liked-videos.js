//
// const getToken() = window.APP_CONFIG.getToken();

// 로그인 정보 가져오기

let API_BASE_URL = "http://3.37.90.114:8000";

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

// API로부터 데이터를 가져와서 비디오 카드를 생성하는 함수
async function fetchAndCreateVideoCards() {
  try {
    const response = await checkAndFetch(`${API_BASE_URL}/videolike/`, {
      method: "GET",
    });
    const data = await response.json();
    console.log("API Response:", data);
    createVideoCards(data);
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
}

// 비디오 카드를 생성하는 함수
function createVideoCards(data) {
  const container = document.getElementById("videoContainer");
  container.innerHTML = "";

  const videoItems = Array.isArray(data) ? data : [data];

  videoItems.forEach((item) => {
    const video = item.video;
    const card = document.createElement("div");
    card.className = "video_card";
    card.innerHTML = `
      <a href="#" class="video-link" data-video-id="${video.id}" data-youtube-link="${video.youtubelink}">
        <img src="${video.thumbnail}" alt="${video.title}" />
        <span class="video_min">${video.length}분</span>
        <span class="bodypart">${video.bodypart.bodyname}</span>
        <span class="video_comment">${video.title}</span>
      </a>
      <i class="fa-solid fa-heart" data-video-id="${video.id}"></i>
    `;
    container.appendChild(card);

    // 비디오 링크에 이벤트 리스너 추가
    const videoLink = card.querySelector(".video-link");
    videoLink.addEventListener("click", handleVideoClick);

    // 하트 아이콘에 이벤트 리스너 추가
    const heartIcon = card.querySelector(".fa-heart");
    heartIcon.addEventListener("click", handleHeartClick);

    // 하트 아이콘 클릭 시 이벤트 전파 중단
    heartIcon.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
}

// 하트 아이콘 클릭 시 취소/복귀
async function handleHeartClick(event) {
  const heartIcon = event.target;
  const videoId = heartIcon.dataset.videoId;
  const isLiked = heartIcon.classList.contains("fa-solid");

  try {
    let response;
    if (isLiked) {
      // 좋아요 취소
      response = await checkAndFetch(`${API_BASE_URL}/video_id/${videoId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        redirect: "follow",
      });
    } else {
      // 좋아요 추가
      response = await checkAndFetch(`${API_BASE_URL}/video_id/${videoId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        redirect: "follow",
      });
    }

    if (response.ok) {
      console.log(
        isLiked ? "Video unliked successfully" : "Video liked successfully"
      );
      // 아이콘 토글
      heartIcon.classList.toggle("fa-solid");
      heartIcon.classList.toggle("fa-regular");
    } else {
      console.error(
        isLiked ? "Failed to unlike video" : "Failed to like video"
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// 비디오 클릭 처리 함수
async function handleVideoClick(event) {
  event.preventDefault();
  const videoId = event.currentTarget.dataset.videoId;
  const youtubeLink = event.currentTarget.dataset.youtubeLink;

  try {
    // 서버에 비디오 조회 정보 전송
    const response = await checkAndFetch(`${API_BASE_URL}/videos/${videoId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (response.ok) {
      console.log(`Video ${videoId} view recorded successfully`);
      // 유튜브 링크 열기
      window.open(youtubeLink, "_blank");
    } else {
      console.error(`Failed to record video ${videoId} view`);
    }
  } catch (error) {
    console.error("Error recording video view:", error);
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault(); // 기본 제출 동작 막기

  const token = getToken();
  if (!token) {
    window.location.href = "../../html/pages/login.html"; // 로그인 페이지 URL로 리다이렉트시캄ㅇ
    return;
  }
  // 페이지 로드 시 비디오 카드 생성
  fetchAndCreateVideoCards();
});
