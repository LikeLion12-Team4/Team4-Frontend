let userLikedVideos = new Set();

window.addEventListener("load", function () {
  var allElements = this.document.getElementsByTagName("*");
  var isLogin = sessionStorage.getItem("isLogin");

  if (isLogin) {
    document.querySelector(".category_container").style.visibility = "visible";
  }
  console.log(isLogin);

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

  fetchLikedVideos().then(() => fetchAndDisplayVideos());
});

function fetchLikedVideos() {
  return fetch("http://3.37.18.8:8000/videolike/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then((likedVideos) => {
      userLikedVideos = new Set(likedVideos.map((video) => video.id));
    })
    .catch((error) => console.error("Error fetching liked videos:", error));
}

function createVideoCard(video) {
  const isLiked = userLikedVideos.has(video.id);
  return `
    <div class="video_card">
      <a href="#" class="video-link" data-video-id="${
        video.id
      }" data-youtube-link="${video.youtubelink}">
        <img src="${video.thumbnail}" alt="${video.title}">
        <span class="video_min">${video.length}분</span>
        <span class="bodypart">${video.bodypart.bodyname}</span>
        <span class="video_comment">${video.title}</span>
      </a>
      <i class="fa-heart ${
        isLiked ? "fa-solid" : "fa-regular"
      }" data-video-id="${video.id}" style="color: ${
    isLiked ? "#6266ED" : ""
  }"></i>
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

  bodypartChoice.innerHTML = Object.keys(videos)
    .map((part) => `<span data-bodypart="${part}">${part}</span>`)
    .join("");

  lastVideoContainer.innerHTML = Object.values(videos)
    .flat()
    .map((video) => createVideoCard(video))
    .join("");

  implementBodypartChoice(lastCategory, Object.values(videos).flat());
}

function implementBodypartChoice(lastCategory, allVideos) {
  const bodypartChoices = lastCategory.querySelectorAll(
    ".bodypart_choice span"
  );
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
      container.scrollBy({ left: -230, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      container.scrollBy({ left: 230, behavior: "smooth" });
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

  createLastCategory(videos);
  initializeSliders();
  addEventListeners();
}

function fetchAndDisplayVideos() {
  fetch("http://3.37.18.8:8000/videos/", {
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

function addEventListeners() {
  document.querySelectorAll(".fa-heart").forEach(function (heart) {
    heart.addEventListener("click", handleLikeClick);
  });

  document.querySelectorAll(".video-link").forEach(function (link) {
    link.addEventListener("click", handleVideoClick);
  });
}

function handleLikeClick(event) {
  event.preventDefault();
  const heartIcon = event.target;
  const videoId = heartIcon.dataset.videoId;
  const isLiked = heartIcon.classList.contains("fa-solid");

  const method = isLiked ? "DELETE" : "POST";
  const url = `http://3.37.18.8:8000/video_id/${videoId}/`;

  fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        heartIcon.classList.toggle("fa-solid");
        heartIcon.classList.toggle("fa-regular");
        heartIcon.style.color = isLiked ? "" : "#6266ED";

        if (isLiked) {
          userLikedVideos.delete(parseInt(videoId));
        } else {
          userLikedVideos.add(parseInt(videoId));
        }
        console.log(`Video ${videoId} like status updated`);
      } else {
        console.error("Error updating like status");
        return response.text();
      }
    })
    .then((errorText) => {
      if (errorText) console.error("Server response:", errorText);
    })
    .catch((error) => console.error("Error:", error));
}

function handleVideoClick(event) {
  event.preventDefault();
  const link = event.currentTarget;
  const videoId = link.dataset.videoId;
  const youtubeLink = link.dataset.youtubeLink;

  fetch(`http://3.37.18.8:8000/videos/${videoId}/`, {
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
  fetch("http://3.37.18.8:8000/users/user/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      const name = result.username;
      document.querySelector(".user_name").innerText = name;
      console.log(name);
    })
    .catch((error) => console.log("error", error));
}

document.addEventListener("DOMContentLoaded", function () {
  getUserInfo();
});
