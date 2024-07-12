// 토큰 하드코딩.. 로그인 완성되면 변경하자..
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

// 푸시 알림 설정

// 페이지 로드 시 사용자의 알림 설정을 가져오는 함수
function fetchAlarmSettings() {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${hardcodedToken}`,
    },
    redirect: "follow",
  };

  fetch("http://3.37.18.8:8000/alarms/option/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.is_option) {
        document.getElementById("notification_toggle").checked =
          result.is_alarm;
        document.getElementById("sound_toggle").checked = result.is_volumn;
        document.getElementById("notification_interval").value =
          result.interval;
      } else {
        // 초기값 설정
        document.getElementById("notification_toggle").checked = true;
        document.getElementById("sound_toggle").checked = true;
        document.getElementById("notification_interval").value = 10;
      }
    })
    .catch((error) => console.log("error", error));
}

// 알림 설정 업데이트
function updateAlarmSettings() {
  const isAlarm = document.getElementById("notification_toggle").checked;
  const isVolumn = document.getElementById("sound_toggle").checked;
  const interval = document.getElementById("notification_interval").value;

  var formdata = new FormData();
  formdata.append("interval", interval);
  formdata.append("is_alarm", isAlarm);
  formdata.append("is_volumn", isVolumn);
  formdata.append("is_option", true);

  var requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${hardcodedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      interval: interval,
      is_alarm: isAlarm,
      is_volumn: isVolumn,
      is_option: true,
    }),
    redirect: "follow",
  };
  var requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${hardcodedToken}`,
    },
    body: formdata,
    redirect: "follow",
  };

  fetch("http://3.37.18.8:8000/alarms/option/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("알림 설정이 업데이트되었습니다:", result);
    })
    .catch((error) => console.log("error", error));
}

// 최근 시청한 영상 정보 가져오기 및 표시
function fetchAndDisplayRecentVideo() {
  const token = hardcodedToken;

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
      const recentVideoElement = document.getElementById("recent_video");
      if (result.recent_video && result.recent_video.title) {
        recentVideoElement.textContent = result.recent_video.title;
        recentVideoElement.addEventListener("click", function () {
          if (result.recent_video.youtubelink) {
            window.open(result.recent_video.youtubelink, "_blank");
          } else {
            console.log("YouTube 링크가 없습니다.");
          }
        });
      } else {
        recentVideoElement.textContent = "최근 시청한 영상이 없습니다.";
      }
    })
    .catch((error) => console.log("error", error));
}
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
      const nicknameElements = document.querySelectorAll(".nickname");
      nicknameElements.forEach((element) => {
        element.textContent = result.username;
      });

      // 이메일 업데이트
      const userEmailElement = document.querySelector(".userEmail");
      if (userEmailElement) {
        userEmailElement.textContent = result.email;
      }

      // 최근 시청한 영상 정보 업데이트
      const recentVideoElement = document.getElementById("recent_video");
      if (result.recent_video && result.recent_video.title) {
        recentVideoElement.textContent = result.recent_video.title;
        recentVideoElement.addEventListener("click", function () {
          if (result.recent_video.youtubelink) {
            window.open(result.recent_video.youtubelink, "_blank");
          } else {
            console.log("YouTube 링크가 없습니다.");
          }
        });
      } else {
        recentVideoElement.textContent = "최근 시청한 영상이 없습니다.";
      }

      // 좋아요 누른 영상 개수 업데이트
      const likedVideoElement = document.getElementById("liked_video");
      likedVideoElement.innerHTML = `<i class="fa-solid fa-heart"></i>${result.userlikes_num}개`;
    })
    .catch((error) => console.log("error", error));
}

// 고민 부위 변경 로직 (^^ ㅠ..)

// 고민 부위 변경 로직

const bodyPartMap = {
  목: { id: 1, engName: "neck" },
  손목: { id: 2, engName: "wrist" },
  눈: { id: 3, engName: "eyes" },
  허리: { id: 4, engName: "back" },
  어깨: { id: 5, engName: "shoulders" },
};

// 모달 관련 변수
const modal = document.querySelector(".survey-modal_container");
const modalCloseBtn = document.querySelector(".survey-modal_close-btn");
const saveBtn = document.querySelector(".survey-modal_finished");
const bodyPartIcons = document.querySelectorAll(".survey-modal_icon > div");

// 선택된 bodypart를 저장할 배열
let selectedBodyParts = [];

document.addEventListener("DOMContentLoaded", function () {
  // 모달 열기
  const bodyPartChangeBtn = document.getElementById("body_part_change_btn");
  if (bodyPartChangeBtn) {
    bodyPartChangeBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      initializeSelectedBodyParts();
    });
  }

  // 모달 닫기
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // bodypart 아이콘 클릭 이벤트
  bodyPartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const part = icon.id.replace("bodypart-", "");
      selectBodyPart(part);
    });
  });

  // 저장 버튼 클릭 이벤트
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (selectedBodyParts.length > 0) {
        updateUserBodyParts();
        modal.style.display = "none";
      } else {
        alert("최소 1개 이상의 고민 부위를 선택해주세요.");
      }
    });
  }

  fetchAndDisplayBodyParts();
});

// 선택된 bodypart 초기화 및 표시
function initializeSelectedBodyParts() {
  selectedBodyParts = userBodyParts
    .map((id) =>
      Object.keys(bodyPartMap).find((key) => bodyPartMap[key].id === id)
    )
    .filter((part) => part !== undefined);
  updateBodyPartUI();
}

function selectBodyPart(part) {
  const index = selectedBodyParts.indexOf(part);
  if (index === -1) {
    selectedBodyParts.push(part);
  } else {
    selectedBodyParts.splice(index, 1);
  }
  updateBodyPartUI();
}

// UI 업데이트 함수
function updateBodyPartUI() {
  bodyPartIcons.forEach((icon) => {
    const part = icon.id.replace("bodypart-", "");
    if (selectedBodyParts.includes(part)) {
      icon.classList.add("selected");
    } else {
      icon.classList.remove("selected");
    }
  });
}

// 사용자의 bodypart 업데이트
function updateUserBodyParts() {
  const bodypartString = selectedBodyParts.join(",");

  var formdata = new FormData();
  formdata.append("bodypart", bodypartString);

  var requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${hardcodedToken}`,
    },
    body: formdata,
    redirect: "follow",
  };

  fetch("http://3.37.18.8:8000/users/survey/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Body parts updated successfully:", result);
      fetchAndDisplayBodyParts(); // 업데이트 후 다시 불러오기
    })
    .catch((error) => console.log("error", error));
}

// 사용자의 현재 bodypart를 저장할 변수
let userBodyParts = [];

// 사용자의 bodypart 정보를 가져와서 표시하는 함수
function fetchAndDisplayBodyParts() {
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
      userBodyParts = result.bodypart.map((part) => part.id);
      displayBodyParts();
      initializeSelectedBodyParts();
    })
    .catch((error) => console.log("error", error));
}

// bodypart를 화면에 표시하는 함수
function displayBodyParts() {
  const bodyPartContainer = document.querySelector(".bodyPartContainer");
  bodyPartContainer.innerHTML = "";

  userBodyParts.forEach((partId) => {
    const part = Object.keys(bodyPartMap).find(
      (key) => bodyPartMap[key].id === partId
    );
    if (part) {
      const bodyPartBlock = createBodyPartBlock(
        part,
        bodyPartMap[part].engName
      );
      bodyPartContainer.appendChild(bodyPartBlock);
    }
  });
}

// bodyPartBlock을 생성하는 함수
function createBodyPartBlock(partName, engName) {
  const bodyPartBlock = document.createElement("div");
  bodyPartBlock.className = "bodyPartBlock";

  const bodyPartName = document.createElement("div");
  bodyPartName.className = "bodyPartName";
  bodyPartName.textContent = partName;

  const bodyPartImage = document.createElement("img");
  bodyPartImage.className = "bodyPartImage";
  bodyPartImage.src = `../../assets/images/${engName}_img.png`;
  bodyPartImage.alt = partName;

  bodyPartBlock.appendChild(bodyPartName);
  bodyPartBlock.appendChild(bodyPartImage);

  return bodyPartBlock;
}

// 이벤트 리스너 추가
document.addEventListener("DOMContentLoaded", function () {
  fetchAlarmSettings();
  fetchAndDisplayRecentVideo();
  fetchUserInfo();
  fetchAndDisplayBodyParts();

  document
    .getElementById("notification_toggle")
    .addEventListener("change", updateAlarmSettings);
  document
    .getElementById("sound_toggle")
    .addEventListener("change", updateAlarmSettings);
  document
    .getElementById("notification_interval")
    .addEventListener("change", updateAlarmSettings);
});
