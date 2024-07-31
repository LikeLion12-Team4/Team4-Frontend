document.addEventListener("DOMContentLoaded", function () {
  const suggestions = document.querySelectorAll(".suggestions li");
  const mainScreen = document.querySelector(".main-screen");
  const chatBox = document.querySelector(".chat-box");
  const suggestionsField = document.querySelector(".suggestions-field");
  const inputField = document.querySelector(".input-field");
  const inputChat = document.querySelector(".input-chat");
  const chatScreen = document.querySelector(".chat-screen");
  const sections = document.querySelectorAll(".content-section");

  function addChat(content, sender = "user") {
    const itemContainer = document.createElement("div");
    const chatItem = document.createElement("div");

    if (sender === "AI") {
      const img = document.createElement("img");
      img.src = "../../assets/images/AI-chatbot.svg"; // 원숭이 이미지 경로
      img.alt = "AI";
      img.classList.add("chat-icon");
      itemContainer.appendChild(img);
    }

    const textContainer = document.createElement("div");
    const text = document.createElement("span");
    text.textContent = content;

    chatItem.classList.add("chat-item", sender);
    textContainer.appendChild(text);
    chatItem.appendChild(textContainer);
    itemContainer.appendChild(chatItem);
    chatBox.appendChild(itemContainer);

    itemContainer.classList.add("item-container", sender);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  suggestions.forEach((suggestion, index) => {
    suggestion.addEventListener("click", function () {
      chatBox.classList.remove("active"); // .active 클래스 제거
      suggestionsField.style.display = "none"; // suggestions-field 숨기기
      mainScreen.style.display = "none"; // main-screen 숨기기

      sections.forEach((section) => {
        section.style.display = "none";
      });

      switch (index) {
        case 0:
          addChat("나의 자세 데이터를 기반으로 내 자세 피드백 부탁해", "user");
          addChat(
            "웹캠 데이터를 기반으로 수집된 결과를 알려드릴게요! 요즘 아기 사자님의 자세는 대체로 구부정하며, 약간의 거북목 증상이 있는 것 같아요! 조금 더 주기적인 스트레칭이 필요할 것 같아요. 자세차렷의 푸시 알림 간격을 더 자주 받아보는 건 어떨까요?",
            "AI"
          );
          addChat("거북목 증상이 있다고? 조심해야겠다:( 답변 고마워!", "user");
          break;
        case 1:
          addChat(
            "사무실에서 간단히 스트레칭 할 수 있는 운동 영상 추천해줘",
            "user"
          );
          addChat(
            "사무실에서 간단히 스트레칭 할 수 있는 운동 영상을 추천드릴게요! {영상 제목} : {링크}",
            "AI"
          );
          addChat("나에게 딱 맞는 영상이네! 추천 고마워:)", "user");
          break;
        case 2:
          addChat("자세차렷 이용 방법이 궁금해", "user");
          addChat(
            "자세차렷은 웹캠을 통해 사용자의 자세를 분석하고 피드백을 제공합니다. 자세한 이용 방법은 [링크]를 참고해주세요.",
            "AI"
          );

          break;
        case 3:
          addChat("거북목 증후군이 뭐야?", "user");
          addChat(
            "거북목 증후군은 장시간 잘못된 자세로 인해 목이 앞으로 나오게 되는 현상입니다. 자세한 설명은 [링크]를 참고해주세요.",
            "AI"
          );
          break;
      }
    });
  });

  inputChat.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addChat(inputChat.value.trim(), "user");
      inputChat.value = "";
    }
  });
});

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
