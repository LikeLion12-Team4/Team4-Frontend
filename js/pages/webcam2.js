const videoElement = document.getElementById("webcam");
const canvasElement = document.getElementById("outputCanvas");
const canvasCtx = canvasElement.getContext("2d");
const cameraContainer = document.getElementsByClassName("camera");
const msg1 = $("#alert-msg1");
const msg2 = $("#alert-msg2");
//쿠키 가져오기
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
//토큰 가져오기
function getToken() {
  return getCookie("accessToken") || null;
}

// 토큰 존재하는지 확인 후 fetch하는 로직
function checkAndFetch(url, options) {
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

//저장할 데이터 값
var distance = 0,
  right_num = 0,
  left_num = 0,
  turtle_num = 0;

// Initialize MediaPipe Pose
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
pose.onResults(onPoseResults);

// Initialize MediaPipe Face Mesh
const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
faceMesh.onResults(onFaceMeshResults);

// Initialize Camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
    await faceMesh.send({ image: videoElement });
  },
  width: 832,
  height: 624,
});
camera.start();

let shoulderMidpoint = null;
let chinLandmark = null;
let color;

function onFaceMeshResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  color = "#00FF00";

  canvasCtx.save();
  canvasCtx.font = "20px Arial"; // 글자 크기 30px, 글꼴 Arial
  chinLandmark = landmarks[152];

  // distance
  distance = Math.sqrt(
    Math.pow((chinLandmark.x - shoulderMidpoint.x) * canvasElement.width, 2) +
      Math.pow((chinLandmark.y - shoulderMidpoint.y) * canvasElement.height, 2)
  );

  var set_dis = 0;
  setTimeout(function () {
    var requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        distance: distance,
      }),
      redirect: "follow",
    };

    checkAndFetch("https://stand-up-back.store/posedata/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("좋은 자세 추출 완료:", result);
        set_dis = result.distance;
      })
      .catch((error) => console.log("error", error));
  }, 7000);
  //좋은 자세 추출

  canvasCtx.beginPath();
  canvasCtx.arc(
    chinLandmark.x * canvasElement.width,
    chinLandmark.y * canvasElement.height,
    5,
    0,
    2 * Math.PI
  );
  canvasCtx.fillStyle = "red";
  canvasCtx.fill();
  // canvasCtx.fillText(`Chin: (${chinLandmark.x.toFixed(2)}, ${chinLandmark.y.toFixed(2)})`, 10, 80);
  //canvasCtx.fillText(`Distance: (${distance})`, 10, 100);

  // 자세 추출 전
  // setTimeout(function () {
  //   if (distance < 70) {
  //     // canvasCtx.fillText(`거북목 자세입니다 !`, 10, 25);
  //     color = "#FF0000";
  //     $(".camera-container").css("border", "6px solid #FF0000");
  //     msg1.text("현재 나쁜 자세입니다.");
  //     msg2.text("자세를 바르게 해주세요.");
  //     //1분당 약 1000씩 카운트 된다.
  //     turtle_num += 1;
  //   } else if (distance >= 70) {
  //     msg1.text("현재 좋은 자세입니다.");
  //     msg2.text("이렇게 계속 유지해주세요!");
  //     $(".camera-container").css("border", "6px solid rgb(81, 81, 224)");
  //   }

  //   canvasCtx.restore();
  // }, 11000);

  //시간지연 0 ver
  // setTimeout(function () {
  //   if (distance<(set_dis-15)) {
  //     // canvasCtx.fillText(`거북목 자세입니다 !`, 10, 25);
  //     color = "#FF0000";
  //     $(".camera-container").css("border", "6px solid #FF0000");
  //     msg1.text("현재 나쁜 자세입니다.");
  //     msg2.text("자세를 바르게 해주세요.");
  //     //1분당 약 1000씩 카운트 된다.
  //     turtle_num += 1;
  //   } else if (distance >= set_dis) {
  //     msg1.text("현재 좋은 자세입니다.");
  //     msg2.text("이렇게 계속 유지해주세요!");
  //     $(".camera-container").css("border", "6px solid rgb(81, 81, 224)");
  //   }

  //   canvasCtx.restore();
  // }, 11000);
  //시간 지연 x
  if (distance < set_dis - 15) {
    // canvasCtx.fillText(`거북목 자세입니다 !`, 10, 25);
    color = "#FF0000";
    $(".camera-container").css("border", "6px solid #FF0000");
    msg1.text("현재 나쁜 자세입니다.");
    msg2.text("자세를 바르게 해주세요.");
    //1분당 약 1000씩 카운트 된다.
    turtle_num += 1;

    var requestOptions3 = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   distance: distance,
      // }),
      redirect: "follow",
    };

    checkAndFetch("https://stand-up-back.store/pushlive/", requestOptions3)
      .then((response) => response.json())
      .then((result) => {
        console.log("실시간 푸시알림:", result);
        // set_dis = result.distance;
      })
      .catch((error) => console.log("error", error));
  } else if (distance >= set_dis) {
    msg1.text("현재 좋은 자세입니다.");
    msg2.text("이렇게 계속 유지해주세요!");
    $(".camera-container").css("border", "6px solid rgb(81, 81, 224)");
  }

  canvasCtx.restore();
}

function onPoseResults(results) {
  if (!results.poseLandmarks) {
    return;
  }

  const landmarks = results.poseLandmarks;
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  shoulderMidpoint = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  // Clear the canvas
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.fillStyle = "yellow";
  // canvasCtx.font = "20px Arial";
  if (leftShoulder.y - rightShoulder.y > 0.065) {
    // canvasCtx.fillText(`자세가 왼쪽으로 삐뚤어져 있습니다 !`, 10, 55);
    color = "#FFFF00";
    left_num += 1;
    msg1.text("현재 나쁜 자세입니다.");
    msg2.text("자세를 바르게 해주세요.");
    $(".camera-container").css("border", "6px solid #FF0000");
  } else if (rightShoulder.y - leftShoulder.y > 0.065) {
    // canvasCtx.fillText(`자세가 오른쪽으로 삐뚤어져 있습니다 !`, 10, 55);
    color = "#FFFF00";
    right_num += 1;
    msg1.text("현재 나쁜 자세입니다.");
    msg2.text("자세를 바르게 해주세요.");
    $(".camera-container").css("border", "6px solid #FF0000");
  } else {
    msg1.text("현재 좋은 자세입니다.");
    msg2.text("이렇게 계속 유지해주세요!");
    $(".camera-container").css("border", "6px solid rgb(81, 81, 224)");
  }
  canvasCtx.fillStyle = "red";
  // Draw the pose landmarks
  drawConnectors(canvasCtx, [leftShoulder, rightShoulder], POSE_CONNECTIONS, {
    color: color,
    lineWidth: 4,
  });
  drawLandmarks(canvasCtx, [leftShoulder, rightShoulder], {
    color: "#FF0000",
    lineWidth: 2,
  });

  // 왼쪽, 오른쪽 어깨 좌표
  //canvasCtx.fillText(`Left Shoulder: (${leftShoulder.x.toFixed(2)}, ${leftShoulder.y.toFixed(2)})`, 10, 20);
  //canvasCtx.fillText(`Right Shoulder: (${rightShoulder.x.toFixed(2)}, ${rightShoulder.y.toFixed(2)})`, 10, 40);

  canvasCtx.beginPath();
  canvasCtx.arc(
    shoulderMidpoint.x * canvasElement.width,
    shoulderMidpoint.y * canvasElement.height,
    5,
    0,
    2 * Math.PI
  );
  canvasCtx.fill();
  // 가운데 어깨 좌표
  //canvasCtx.fillText(`Shoulder MidPoint: (${shoulderMidpoint.x.toFixed(2)}, ${shoulderMidpoint.y.toFixed(2)})`, 10, 60);
  canvasCtx.restore();
}

// Ensure video element is visible and has dimensions set
videoElement.style.display = "block";
videoElement.style.width = "100%";
videoElement.style.height = "100%";

// Check for permissions
navigator.mediaDevices
  .getUserMedia({
    video: {
      width: { ideal: 832 },
      height: { ideal: 624 },
    },
  })
  .then((stream) => {
    videoElement.srcObject = stream;
    videoElement.play();
  })
  .catch((err) => {
    console.error("Error accessing webcam: " + err);
  });

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
//통신
$(document).ready(function () {
  setTimeout(function () {
    msg1.text("좋은 자세 추출이 완료되었습니다.");
    msg2.text("실시간 자세추적을 시작합니다!");
    setTimeout(function () {
      msg1.text("좋은 자세입니다.");
      msg2.text("이렇게 계속 유지해주세요!");
    }, 1500);
  }, 10000);
  $("button[type='submit']").on("click", function (e) {
    var requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        right_num: right_num,
        left_num: left_num,
        turtle_num: turtle_num,
      }),
      redirect: "follow",
    };

    checkAndFetch("https://stand-up-back.store/posedata/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("자세데이터 저장 완료:", result);
      })
      .catch((error) => console.log("error", error));

    //현재 자세 보기 페이지로 돌아가기
    window.location.href = "../../html/pages/webcam.html";
  });
});
