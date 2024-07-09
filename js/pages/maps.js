// maps.js
document.addEventListener("DOMContentLoaded", function () {
  var mapContainer = document.getElementById("map_container");
  var mapOption = {
    center: new kakao.maps.LatLng(37.603137093485785, 126.9563494979624),
    level: 2,
  };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성

  // 정형외과 마커가 표시될 좌표 배열입니다
  var orthopedicsPositions = [
    new kakao.maps.LatLng(37.603137093485785, 126.9563494979624),
  ];

  // 필라테스 마커가 표시될 좌표 배열입니다
  var pilatesPositions = [new kakao.maps.LatLng(37.602966, 126.954956)];

  // 헬스장 마커가 표시될 좌표 배열입니다
  var fitnessPositions = [new kakao.maps.LatLng(37.600827, 126.956377)];

  // 요가 마커가 표시될 좌표 배열입니다
  var yogaPositions = [new kakao.maps.LatLng(37.6015, 126.9555)];

  var markerImageSrc = "https://ifh.cc/g/ZpfNFH.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
  (orthopedicsMarkers = []), // 정형외과 마커 객체를 가지고 있을 배열입니다
    (pilatesMarkers = []), // 필라테스 마커 객체를 가지고 있을 배열입니다
    (fitnessMarkers = []), // 헬스장 마커 객체를 가지고 있을 배열입니다
    (yogaMarkers = []); // 요가 마커 객체를 가지고 있을 배열입니다

  createOrthopedicsMarkers(); // 정형외과 마커를 생성하고 정형외과 마커 배열에 추가합니다
  createPilatesMarkers(); // 필라테스 마커를 생성하고 필라테스 마커 배열에 추가합니다
  createFitnessMarkers(); // 헬스장 마커를 생성하고 헬스장 마커 배열에 추가합니다
  createYogaMarkers(); // 요가 마커를 생성하고 요가 마커 배열에 추가합니다

  changeMarker("orthopedics"); // 지도에 정형외과 마커가 보이도록 설정합니다

  // 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
  function createMarkerImage(src, size, options) {
    var markerImage = new kakao.maps.MarkerImage(src, size, options);
    return markerImage;
  }

  // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
  function createMarker(position, image) {
    var marker = new kakao.maps.Marker({
      position: position,
      image: image,
    });

    return marker;
  }

  // 정형외과 마커를 생성하고 정형외과 마커 배열에 추가하는 함수입니다
  function createOrthopedicsMarkers() {
    for (var i = 0; i < orthopedicsPositions.length; i++) {
      var imageSize = new kakao.maps.Size(83, 83),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(0, 0),
          spriteSize: new kakao.maps.Size(83, 332),
        };

      // 마커이미지와 마커를 생성합니다
      var markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(orthopedicsPositions[i], markerImage);

      // 생성된 마커를 정형외과 마커 배열에 추가합니다
      orthopedicsMarkers.push(marker);
    }
  }

  // 정형외과 마커들의 지도 표시 여부를 설정하는 함수입니다
  function setOrthopedicsMarkers(map) {
    for (var i = 0; i < orthopedicsMarkers.length; i++) {
      orthopedicsMarkers[i].setMap(map);
    }
  }

  // 필라테스 마커를 생성하고 필라테스 마커 배열에 추가하는 함수입니다
  function createPilatesMarkers() {
    for (var i = 0; i < pilatesPositions.length; i++) {
      var imageSize = new kakao.maps.Size(83, 83),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(0, 83),
          spriteSize: new kakao.maps.Size(83, 332),
        };

      // 마커이미지와 마커를 생성합니다
      var markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(pilatesPositions[i], markerImage);

      // 생성된 마커를 필라테스 마커 배열에 추가합니다
      pilatesMarkers.push(marker);
    }
  }

  // 필라테스 마커들의 지도 표시 여부를 설정하는 함수입니다
  function setPilatesMarkers(map) {
    for (var i = 0; i < pilatesMarkers.length; i++) {
      pilatesMarkers[i].setMap(map);
    }
  }

  // 헬스장 마커를 생성하고 헬스장 마커 배열에 추가하는 함수입니다
  function createFitnessMarkers() {
    for (var i = 0; i < fitnessPositions.length; i++) {
      var imageSize = new kakao.maps.Size(83, 83),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(0, 166),
          spriteSize: new kakao.maps.Size(83, 332),
        };

      // 마커이미지와 마커를 생성합니다
      var markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(fitnessPositions[i], markerImage);

      // 생성된 마커를 헬스장 마커 배열에 추가합니다
      fitnessMarkers.push(marker);
    }
  }

  // 헬스장 마커들의 지도 표시 여부를 설정하는 함수입니다
  function setFitnessMarkers(map) {
    for (var i = 0; i < fitnessMarkers.length; i++) {
      fitnessMarkers[i].setMap(map);
    }
  }

  // 요가 마커를 생성하고 요가 마커 배열에 추가하는 함수입니다
  function createYogaMarkers() {
    for (var i = 0; i < yogaPositions.length; i++) {
      var imageSize = new kakao.maps.Size(83, 83),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(0, 249),
          spriteSize: new kakao.maps.Size(83, 332),
        };

      // 마커이미지와 마커를 생성합니다
      var markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(yogaPositions[i], markerImage);

      // 생성된 마커를 요가 마커 배열에 추가합니다
      yogaMarkers.push(marker);
    }
  }

  // 요가 마커들의 지도 표시 여부를 설정하는 함수입니다
  function setYogaMarkers(map) {
    for (var i = 0; i < yogaMarkers.length; i++) {
      yogaMarkers[i].setMap(map);
    }
  }

  // 카테고리 클릭 이벤트 리스너를 설정합니다.
  document
    .getElementById("orthopedicsMenu")
    .addEventListener("click", function () {
      changeMarker("orthopedics", map);
    });
  document.getElementById("pilatesMenu").addEventListener("click", function () {
    changeMarker("pilates", map);
  });
  document.getElementById("fitnessMenu").addEventListener("click", function () {
    changeMarker("fitness", map);
  });
  document.getElementById("yogaMenu").addEventListener("click", function () {
    changeMarker("yoga", map);
  });

  // 카테고리를 클릭했을 때 type에 따라 카테고리의 스타일과 지도에 표시되는 마커를 변경합니다
  function changeMarker(type, map) {
    var orthopedicsMenu = document.getElementById("orthopedicsMenu");
    var pilatesMenu = document.getElementById("pilatesMenu");
    var fitnessMenu = document.getElementById("fitnessMenu");
    var yogaMenu = document.getElementById("yogaMenu");

    // 정형외과 카테고리가 클릭됐을 때
    if (type === "orthopedics") {
      orthopedicsMenu.className = "menu_selected";
      pilatesMenu.className = "";
      fitnessMenu.className = "";
      yogaMenu.className = "";

      setOrthopedicsMarkers(map);
      setPilatesMarkers(null);
      setFitnessMarkers(null);
      setYogaMarkers(null);
    } else if (type === "pilates") {
      orthopedicsMenu.className = "";
      pilatesMenu.className = "menu_selected";
      fitnessMenu.className = "";
      yogaMenu.className = "";

      setOrthopedicsMarkers(null);
      setPilatesMarkers(map);
      setFitnessMarkers(null);
      setYogaMarkers(null);
    } else if (type === "fitness") {
      orthopedicsMenu.className = "";
      pilatesMenu.className = "";
      fitnessMenu.className = "menu_selected";
      yogaMenu.className = "";

      setOrthopedicsMarkers(null);
      setPilatesMarkers(null);
      setFitnessMarkers(map);
      setYogaMarkers(null);
    } else if (type === "yoga") {
      orthopedicsMenu.className = "";
      pilatesMenu.className = "";
      fitnessMenu.className = "";
      yogaMenu.className = "menu_selected";

      setOrthopedicsMarkers(null);
      setPilatesMarkers(null);
      setFitnessMarkers(null);
      setYogaMarkers(map);
    }
  }
});
