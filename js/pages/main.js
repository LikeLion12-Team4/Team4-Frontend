let userLikedVideos = new Set();

window.addEventListener("load", function () {
  var allElements = this.document.getElementsByTagName("*");
  var isLogin = sessionStorage.getItem("isLogin");

  if (isLogin) {
    document.querySelector(".category_container").style.visibility = "visible";
    fetchLikedVideos().then(() => fetchAndDisplayUserVideos());
  } else {
    document.querySelector(".category_container").style.visibility = "visible";
    fetchAndDisplayRandomVideos();
  }

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

// 수정된 fetchLikedVideos 함수
function fetchLikedVideos() {
  return fetch("https://stand-up-back.store/videolike/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then((likedVideos) => {
      userLikedVideos = new Set(likedVideos.map((item) => item.video.id));
      console.log("Fetched liked videos:", userLikedVideos);
    })
    .catch((error) => console.error("Error fetching liked videos:", error));
}

// 수정된 createVideoCard 함수
function createVideoCard(video) {
  const isLiked = userLikedVideos.has(video.id);
  return `
    <div class="video_card">
      <a href="#" class="video-link" data-video-id="${video.id}" data-youtube-link="${video.youtubelink}">
        <img src="${video.thumbnail}" alt="${video.title}">
        <span class="video_min">${video.length}분</span>
        <span class="bodypart">${video.bodypart.bodyname}</span>
        <span class="video_comment">${video.title}</span>
      </a>
      <i class="fa-heart ${isLiked ? "fa-solid" : "fa-regular"}" data-video-id="${video.id}" style="color: ${isLiked ? "#6266ED" : ""}"></i>
    </div>
  `;
}

function createCategory(bodypart, videos, userName) {
  const category = document.createElement("div");
  category.classList.add("category");
  category.innerHTML = `
    <p>${userName}님의 꼿꼿한 ${bodypart}을 위해! ${bodypart}에 좋은 스트레칭</p>
    <div class="video_slider">
      <button class="left_btn">&lt;</button>
      <div class="video_container">
        ${videos.map((video) => createVideoCard(video)).join("")}
      </div>
      <button class="right_btn">&gt;</button>
    </div>
  `;
  return category;
}

function createLastCategory(videos) {
  const lastCategory = document.querySelector(".last_category");
  const bodypartChoice = lastCategory.querySelector(".bodypart_choice");
  const lastVideoContainer = document.getElementById("lastVideoContainer");

  if (!bodypartChoice || !lastVideoContainer) {
    console.error("Element(s) for lastCategory not found.");
    return;
  }

  bodypartChoice.innerHTML = [...new Set(videos.map(video => video.bodypart.bodyname))]
    .map(part => `<span data-bodypart="${part}">${part}</span>`)
    .join("");

  lastVideoContainer.innerHTML = videos
    .map((video) => createVideoCard(video))
    .join("");

  implementBodypartChoice(lastCategory, videos);
  addEventListeners();
}

function implementBodypartChoice(lastCategory, allVideos) {
  const bodypartChoices = lastCategory.querySelectorAll(".bodypart_choice span");
  const videoCards = lastCategory.querySelectorAll(".video_card");

  bodypartChoices.forEach((choice) => {
    choice.addEventListener("click", function () {
      const selectedPart = this.getAttribute("data-bodypart");
      bodypartChoices.forEach((part) => {
        part.style.backgroundColor = part === this ? "#6266ED" : "#EAEAEA";
        part.style.color = part === this ? "white" : "black";
      });

      videoCards.forEach((card) => {
        const bodypart = card.querySelector(".bodypart").textContent;
        card.style.display = bodypart === selectedPart ? "flex" : "none";
      });
    });
  });
}

function initializeSliders() {
  const sliders = document.querySelectorAll(".video_slider");
  sliders.forEach((slider) => {
    const container = slider.querySelector(".video_container");
    const leftBtn = slider.querySelector(".left_btn");
    const rightBtn = slider.querySelector(".right_btn");

    leftBtn.addEventListener("click", () => {
      container.scrollBy({ left: -240, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: 240, behavior: "smooth" });
    });
  });
}

function displayVideos(videos) {
  const categoryContainer = document.querySelector(".category_container");
  categoryContainer.innerHTML = "";

  const userName = document.querySelector(".user_name").innerText || "사용자";

  for (const bodypart in videos) {
    const category = createCategory(bodypart, videos[bodypart], userName);
    categoryContainer.appendChild(category);
  }

  createLastCategory(Object.values(videos).flat());
  initializeSliders();
  addEventListeners();
}

function fetchAndDisplayVideos() {
  fetch("https://stand-up-back.store/videos/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then((videos) => {
      displayVideos(videos);
    })
    .catch((error) => console.error("Error:", error));
}

function fetchAndDisplayUserVideos() {
  const token = getToken();
  if (!token) {
    console.error("No token found. User might not be logged in.");
    fetchAndDisplayRandomVideos();
    return;
  }

  Promise.all([
    fetch("https://stand-up-back.store/users/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => response.json()),
    fetch("https://stand-up-back.store/videos/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => response.json())
  ])
  .then(([userData, videos]) => {
    const selectedBodyParts = userData.bodypart.map(part => part.bodyname);

    const filteredVideos = {};
    for (const bodypart in videos) {
      if (selectedBodyParts.includes(bodypart)) {
        filteredVideos[bodypart] = videos[bodypart];
      }
    }
    
    displayVideos(filteredVideos);
  
    createLastCategory(Object.values(videos).flat());
  })
  .catch((error) => {
    console.error("Error fetching user data or videos:", error);
    fetchAndDisplayRandomVideos();
  });
}

function addEventListeners() {
  document.querySelectorAll(".fa-heart").forEach(function (heart) {
    heart.addEventListener("click", handleLikeClick);
    // 이벤트 전파 중단
    heart.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

  document.querySelectorAll(".video-link").forEach(function (link) {
    link.addEventListener("click", handleVideoClick);
  });
}

// 수정된 handleLikeClick 함수
async function handleLikeClick(event) {
  event.preventDefault();
  const heartIcon = event.target;
  const videoId = heartIcon.dataset.videoId;
  const isLiked = heartIcon.classList.contains("fa-solid");

  try {
    let response;
    if (isLiked) {
      // 좋아요 취소
      response = await fetch(`https://stand-up-back.store/video_id/${videoId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } else {
      // 좋아요 추가
      response = await fetch(`https://stand-up-back.store/video_id/${videoId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    }

    if (response.ok) {
      console.log(isLiked ? "Video unliked successfully" : "Video liked successfully");
      // 아이콘 토글
      heartIcon.classList.toggle("fa-solid");
      heartIcon.classList.toggle("fa-regular");
      heartIcon.style.color = isLiked ? "" : "#6266ED";

      if (isLiked) {
        userLikedVideos.delete(parseInt(videoId));
      } else {
        userLikedVideos.add(parseInt(videoId));
      }
      console.log("Updated liked videos:", userLikedVideos);
    } else {
      console.error(isLiked ? "Failed to unlike video" : "Failed to like video");
      // 서버 응답 에러 처리
      const errorData = await response.json();
      console.error("Server response:", errorData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function handleVideoClick(event) {
  event.preventDefault();
  const link = event.currentTarget;
  const videoId = link.dataset.videoId;
  const youtubeLink = link.dataset.youtubeLink;

  fetch(`https://stand-up-back.store/videos/${videoId}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        window.open(youtubeLink, "_blank");
      } else {
        console.error("Error recording video view");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function getToken() {
  return getCookie("accessToken") || null;
}

function getUserInfo() {
  fetch("https://stand-up-back.store/users/user/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      const name = result.fullname;
      document.querySelector(".user_name").innerText = name;
      console.log(name);
    })
    .catch((error) => console.log("error", error));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function fetchAndDisplayRandomVideos() {
  fetch("https://stand-up-back.store/videos/", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((videos) => {
      const allVideos = Array.isArray(videos) ? videos : Object.values(videos).flat();
      const shuffledVideos = shuffleArray(allVideos);
      const selectedVideos = shuffledVideos.slice(0, 40);

      const midIndex = Math.ceil(selectedVideos.length / 2);
      const firstHalfVideos = selectedVideos.slice(0, midIndex);
      const secondHalfVideos = selectedVideos.slice(midIndex);

      const categoryContainer = document.querySelector(".category_container");
      categoryContainer.innerHTML = `
        <div class="video_slider">
          <button class="left_btn">&lt;</button>
          <div class="video_container">
            ${firstHalfVideos.map((video) => createVideoCard(video)).join("")}
          </div>
          <button class="right_btn">&gt;</button>
        </div>
        <div class="video_slider">
          <button class="left_btn">&lt;</button>
          <div class="video_container">
            ${secondHalfVideos.map((video) => createVideoCard(video)).join("")}
          </div>
          <button class="right_btn">&gt;</button>
        </div>
      `;

      const lastCategory = document.querySelector(".last_category");
      const bodypartChoice = lastCategory.querySelector(".bodypart_choice");

      const uniqueBodyparts = [...new Set(selectedVideos.map(video => video.bodypart.bodyname))];
      bodypartChoice.innerHTML = uniqueBodyparts
        .map(part => `<span data-bodypart="${part}">${part}</span>`)
        .join("");

      const lastVideoContainer = document.getElementById("lastVideoContainer");
      lastVideoContainer.innerHTML = selectedVideos
        .map((video) => createVideoCard(video))
        .join("");

      implementBodypartChoice(lastCategory, selectedVideos);
      initializeSliders();
      addEventListeners();
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  getUserInfo();
});
  
  