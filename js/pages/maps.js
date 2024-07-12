//마커 클릭해야 보이도록 숨기기
$("#modal").hide();
//보이게 하는 함수
function out() {
  document.getElementById("modal").style.display = "none";
}
//마커 기본 설정
var imageSize = new kakao.maps.Size(30, 30), // 마커이미지의 크기입니다
  imageOption = { offset: new kakao.maps.Point(27, 69) };
//현재 위치 주소
var loc_dong = "";
//마커 배열
var yogaMarkers = [];
var healthMarkers = [];
var pilatesMarkers = [];
var orthopedicsMarkers = [];
//오버레이 배열
var overlays = [];
//검색어
var search_yoga = "요가",
  search_health = "헬스",
  search_fila = "필라테스",
  search_orth = "정형외과";
//마커 이미지 설정
var yoga_image = "../../assets/icons/yoga.svg",
  health_image = "../../assets/icons/health.svg",
  fila_image = "../../assets/icons/fila.svg",
  orth_image = "../../assets/icons/orth.svg";

/****************************지도 생성******************************/
var mapContainer = document.getElementById("map_container"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.56645, 126.97796), // 지도의 중심좌표 내 현위치로 바꾸기
    level: 3, // 지도의 확대 레벨
  };
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
/****************************현재 위치 + 법정동 가져오기 ******************************/
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude; // 위도
    var lon = position.coords.longitude; // 경도
    var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

    // 마커와 인포윈도우를 표시합니다
    displayMarker(locPosition);

    // 현재 위치의 현재 위치 주소를 얻어옵니다
    getLegalDongAddressFromLocPosition(locPosition, function (loc_dong) {
      if (loc_dong) {
        console.log("현재 위치 주소:", loc_dong);

        searchPlacesAndDisplayMarkers(search_yoga, yogaMarkers);
        searchPlacesAndDisplayMarkers(search_health, healthMarkers);
        searchPlacesAndDisplayMarkers(search_fila, pilatesMarkers);
        searchPlacesAndDisplayMarkers(search_orth, orthopedicsMarkers);
      } else {
        console.log("현재 위치 주소를 가져오지 못했습니다.");
      }
    });
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);

  displayMarker(locPosition);
  // 현재 위치의 현재 위치 주소를 얻어옵니다
  getLegalDongAddressFromLocPosition(locPosition, function (loc_dong) {
    if (loc_dong) {
      console.log("현재 위치 주소:", loc_dong);
      searchPlacesAndDisplayMarkers(search_yoga, yogaMarkers);
      searchPlacesAndDisplayMarkers(search_health, healthMarkers);
      searchPlacesAndDisplayMarkers(search_fila, pilatesMarkers);
      searchPlacesAndDisplayMarkers(search_orth, orthopedicsMarkers);
    } else {
      console.log("현재 위치 주소를 가져오지 못했습니다.");
    }
  });
}

//현재 위치 표현 함수
function displayMarker(locPosition) {
  var image = "../../assets/icons/marker_loc.svg";
  var markerImage = new kakao.maps.MarkerImage(image, imageSize, imageOption);
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: locPosition,
    image: markerImage,
  });

  // 지도 중심좌표를 접속위치로 변경합니다
  map.setCenter(locPosition);
}

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소를 받아오는 함수
function getLegalDongAddressFromLocPosition(locPosition, callback) {
  geocoder.coord2Address(
    locPosition.getLng(),
    locPosition.getLat(),
    function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var fullAddress = result[0].address.address_name; // "시도 시군구 동 번지" 형태의 주소
        var splitAddress = fullAddress.split(" "); // 공백을 기준으로 주소를 분리

        // 시군구까지의 주소는 시도부터 시군구까지의 문자열입니다
        var loc_dong = splitAddress.slice(2, 3).join(" "); //구만
        (search_yoga = loc_dong + " 요가"),
          (search_health = loc_dong + " 헬스"),
          (search_fila = loc_dong + " 필라테스"),
          (search_orth = loc_dong + " 정형외과");
        callback(loc_dong);
        console.log(loc_dong);
      } else {
        console.error("시군구까지의 주소를 가져오지 못했습니다.");
        callback(null);
      }
    }
  );
}
/****************************받아온 주소로 장소 검색하기 ******************************/
//장소 검색 객체
var ps = new kakao.maps.services.Places();

// 키워드로 장소를 검색하여 마커를 생성하는 함수
function searchPlacesAndDisplayMarkers(keyword, markerArray) {
  ps.keywordSearch(keyword, function (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      var markerImage = getImageForKeyword(keyword);
      for (var i = 0; i < data.length; i++) {
        var place = data[i];
        displayMarker2(place, markerImage, markerArray);
      }
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      console.log("검색 결과가 없습니다.");
    } else if (status === kakao.maps.services.Status.ERROR) {
      console.log("검색 중 오류가 발생했습니다.");
    }
  });
}

var overlay = null;
function openCustomOverlay(place) {
  console.log(place);
  var content = `
    <div class="customoverlay">
        <div class="desc">
            <div class="title">${place.place_name}</div>
            <div class="content">주소 : ${place.address_name}</div>
            <div class="content">전화번호 : ${
              place.phone ? place.phone : "전화번호 정보 없음"
            }</div>
            <div class="content"><a href="${
              place.place_url
            }" target="_blank" class="link">더 자세한 정보 보러가기</a></div>
        </div>
    </div>
    `;
  //존재할시 위치 바꾸기
  if (overlay) {
    overlay.setContent(content);
    overlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
    overlay.setMap(map);
    overlays.push(overlay);
  } else {
    // 새로 생성
    overlay = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
      xAnchor: 0.5,
      yAnchor: 1.3,
    });
    overlays.push(overlay);
  }
}

// Function to close the custom overlay
function closeOverlay() {
  if (overlay) {
    overlay.setMap(null);
    overlay = null;
  }
}

// 마커를 지도에 표시하고 생성된 마커 객체를 반환하는 함수
function displayMarker2(place, image, markerArray) {
  // 마커를 생성하고 지도에 표시합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x),
    image: image,
  });
  //클릭하면 모달 띄우기
  kakao.maps.event.addListener(marker, "click", function () {
    openCustomOverlay(place);
  });
  //마커랑 같은 배열 넣어서 연결 시켜주기
  markerArray.push(marker);

  return marker; // 생성된 마커 객체 반환
}

// 키워드에 따른 이미지를 반환하는 함수
function getImageForKeyword(keyword) {
  var image = "";
  switch (keyword) {
    case "요가":
      image = yoga_image;
      break;
    case "헬스":
      image = health_image;
      break;
    case "필라테스":
      image = fila_image;
      break;
    case "정형외과":
      image = orth_image;

      break;
  }
  var markerImage = new kakao.maps.MarkerImage(image, imageSize, imageOption);
  return markerImage;
}
/****************************카테고리별 마커 띄우기 ******************************/
// 모든 마커를 숨기는 함수
function hideAllMarkers() {
  var allMarkers = [
    yogaMarkers,
    healthMarkers,
    pilatesMarkers,
    orthopedicsMarkers,
  ];
  for (var i = 0; i < allMarkers.length; i++) {
    for (var j = 0; j < allMarkers[i].length; j++) {
      allMarkers[i][j].setMap(null);
    }
  }
}

function hideAllOverlays() {
  for (var i = 0; i < overlays.length; i++) {
    overlays[i].setMap(null);
  }
  overlays = [];
}

// 특정 마커 배열의 마커들만 지도에 표시하는 함수 +오버레이
function showMarkers(markerArray) {
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(map);
  }
}

// 버튼 클릭 이벤트 리스너 등록
document.getElementById("btn1").addEventListener("click", function () {
  hideAllMarkers();
  hideAllOverlays();
  showMarkers(orthopedicsMarkers);
});

document.getElementById("btn2").addEventListener("click", function () {
  hideAllMarkers();
  hideAllOverlays();
  showMarkers(healthMarkers);
});

document.getElementById("btn3").addEventListener("click", function () {
  hideAllMarkers();
  hideAllOverlays();
  showMarkers(pilatesMarkers);
});

document.getElementById("btn4").addEventListener("click", function () {
  hideAllMarkers();
  hideAllOverlays();
  showMarkers(yogaMarkers);
});

//버튼 변하게
document.getElementById("btn1").addEventListener("click", function () {
  // 모든 버튼의 active 클래스 제거
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.classList.remove("active");
  });
  // 현재 클릭된 버튼에 active 클래스 추가
  this.classList.add("active");

  // 마커 숨기고 필요한 마커 그룹 보이기
  hideAllMarkers();
  showMarkers(orthopedicsMarkers);
});

document.getElementById("btn2").addEventListener("click", function () {
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.classList.remove("active");
  });
  this.classList.add("active");

  hideAllMarkers();
  showMarkers(healthMarkers);
});

document.getElementById("btn3").addEventListener("click", function () {
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.classList.remove("active");
  });
  this.classList.add("active");

  hideAllMarkers();
  showMarkers(pilatesMarkers);
});

document.getElementById("btn4").addEventListener("click", function () {
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.classList.remove("active");
  });
  this.classList.add("active");

  hideAllMarkers();
  showMarkers(yogaMarkers);
});
