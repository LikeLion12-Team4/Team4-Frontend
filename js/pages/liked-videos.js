//
const hardcodedToken = window.APP_CONFIG.hardcodedToken;

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
    const response = await fetch("http://3.37.18.8:8000/videolike/", {
      headers: {
        Authorization: `Bearer ${hardcodedToken}`,
      },
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
      <img src="${video.thumbnail}" alt="${video.title}" />
      <span class="video_min">${video.length}분</span>
      <span class="bodypart">${video.bodypart.bodyname}</span>
      <span class="video_comment">${video.title}</span>
      <i class="fa-solid fa-heart" data-video-id="${video.id}"></i>
    `;
    container.appendChild(card);

    // 하트 아이콘에 이벤트 리스너 추가
    const heartIcon = card.querySelector(".fa-heart");
    heartIcon.addEventListener("click", handleHeartClick);
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
      response = await fetch(`http://3.37.18.8:8000/video_id/${videoId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${hardcodedToken}`,
        },
        redirect: "follow",
      });
    } else {
      // 좋아요 추가
      response = await fetch(`http://3.37.18.8:8000/video_id/${videoId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hardcodedToken}`,
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

// 페이지 로드 시 비디오 카드 생성
fetchAndCreateVideoCards();
