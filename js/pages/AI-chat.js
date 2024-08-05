var stand_up="";
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
document.addEventListener("DOMContentLoaded", function () {
  const chatBox = document.querySelector(".chat-box");
  const inputChat = document.querySelector(".input-chat");

  //chatbot 
  var Options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    // body: formdata,
    redirect: "follow",
  };

  checkAndFetch("https://stand-up-back.store/chatbot/", Options)
    .then((response) => response.json())
    .then((result) => {
      console.log("불러오기 성공");
      stand_up = result.find(item=>item.id===1).value;
    })
    .catch((error) => alert("로그인이 필요한 서비스입니다.")
    
    );
  //사용자 데이터 불러오기
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    redirect: "follow",
  };
  var message = "";
  var name = "";
  checkAndFetch("https://stand-up-back.store/posedata/", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const right_num = result.right_num;
      const left_num = result.left_num;
      const turtle_num = result.turtle_num;
      checkAndFetch("https://stand-up-back.store/users/user", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          name = result.fullname;
          message += `웹캠 데이터를 기반으로 수집된 결과를 알려드릴게요! 요즘 ${name}님의 자세는`;
          //증상별 메세지
          var shoulder_check = false;
          var turtle_check = false;
          //어깨 기울어질 때
          if ((right_num > 500) | (left_num > 500)) {
            if (right_num > left_num) {
              message += "오른쪽으로 기울어진 자세를 유지하는 경향이 있어요.";
              shoulder_check = true;
            } else {
              message += "왼쪽으로 기울어진 자세를 유지하는 경향이 있어요.";
              shoulder_check = true;
            }
          }
          if (shoulder_check) {
            message += "또한, ";
          }
          //거북목일 때
          if (turtle_num > 500) {
            message += "약간의 거북목 증상이 있어요.";
            turtle_check = true;
          } else if (turtle_num > 1000) {
            message += "거북목 증상이 심합니다.";
            turtle_check = true;
          }

          if (shoulder_check | turtle_check) {
            message +=
              "조금 더 주기적인 스트레칭이 필요할 것 같아요. 자세차렷의 푸시 알림 간격을 자주 받아보는 건 어떨까요?";
            //알림 설정 링크 보내는 채팅
          }
          //멀쩡하면
          else {
            message +=
              "아주 좋은 자세를 유지하고 계세요! 앞으로도 바른 자세 유지하시면 될 것 같습니다.";
          }

          //자세데이터 없을때
          if(right_num===null){
            message=`현재 저장된 ${name}님의 자세데이터가 없습니다. "현재 나의 자세보기" 페이지에서 실시간 자세 추적을 시작해보세요!`
          }
        });
    })
    .catch((error) => console.log("error", error));

  //메세지 보내는 함수
  function addChat(content, sender) {
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

    //   chatBox.scrollTop = chatBox.scrollHeight;
  }
  //채팅 보내기
  $(".send-chat-btn").on("click", function (e) {
    $(".main-screen").hide();
    const msg = inputChat.value.trim();
    //메세지 비어있으면 반환
    if (msg.length === 0) return;
    inputChat.value = "";
    addChat(msg, "user");
    //정해진 답변들 목록
    if (
      msg.includes("나의 자세 데이터") |
      msg.includes("자세데이터") |
      msg.includes("자세 데이터")
    ) {
      return addChat(message, "AI");
    }
    // if (msg.includes("영상 추천")) {
    //   if (msg.includes("사무실") | msg.includes("간단")) {
    //     //영상가져오기
    //   }
    //   return addChat(message, "AI");
    // }
    if (
      msg.includes("자세차렷 이용방법") | msg.includes("자세차렷이용방법") ||
      msg.includes("자세차렷 이용 방법")
    ) {
      message = "어쩌구 저쩌구해서 사용하면 돼 ~~";
      return addChat(message, "AI");
    }
    if (msg.includes("안녕")) {
      message = `안녕하세요. ${name}님만의 AI자세코치입니다. 궁금한 점을 물어보세요!`;
      return addChat(message, "AI");
    }
    if (msg.includes("감사") | msg.includes("고마워")) {
      message = `아닙니다. ${name}님만의 AI자세코치이니 언제든 편하게 질문하세요!`;
      return addChat(message, "AI");
    }

    //ChatGPT API 사용할 경우
    (async () => {
      try {
        console.log(msg);
        const aiResponse = await fetchAIResponse(msg);
        // inputChat.value = "";
        addChat(aiResponse, "AI");
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  });

  inputChat.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      $(".send-chat-btn").click();
    }
  });
  //예시 버튼 클릭시
  $("#feedback").on("click", function (e) {
    $(".main-screen").hide();
    const text = $("#feedback").text();
    addChat(text, "user");
    addChat(message, "AI");
  });
  $("#video").on("click", function (e) {
    $(".main-screen").hide();
    const text = $("#video").text();
    addChat(text, "user");
  });
  $("#method").on("click", function (e) {
    $(".main-screen").hide();
    const text = $("#method").text();
    addChat(text, "user");
    addChat("어쩌고 저쩌고 하면 돼", "AI");
  });
  $("#turtle").on("click", function (e) {
    $(".main-screen").hide();
    const text = $("#turtle").text();
    const msg2 =
      "거북목 증후군이란 아랫목은 굴곡, 윗목은 신전하여 전체적으로 목의 전만이 소실되어 고개가 앞으로 빠진 자세가 일으키는 증상들을 말하며 거북목 증후군의 가장 큰 원인은 눈높이보다 낮은 컴퓨터 모니터를 장시간 같은 자세로 내려다보는 것입니다. 처음에는 모니터를 똑바로 쳐다보다가도 점차 고개가 숙여지면서 목이 길어집니다. 이렇게 머리가 앞으로, 또 아래로 향하는 자세가 계속되면, 목과 어깨의 근육뿐만 아니라 척추에도 무리가 생겨 통증이 발생합니다. 그리고 허리가 구부러지고 눈은 위로 치켜뜬 상태가 됩니다. 이런 자세가 반복되면 근육이나 뼈가 자동으로 굳어지고 통증이 생깁니다. 책을 보는 자세에서도 유발될 수 있으니 유의해야 합니다. 출처: 서울대학병원, 서울아산병원";
    addChat(text, "user");
    addChat(msg2, "AI");
  });
});

// ChatGPT API 요청 함수
async function fetchAIResponse(prompt) {
  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const requestOptions = {
    method: "POST",
    // API 요청의 헤더를 설정
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${stand_up}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // 사용할 AI 모델
      messages: [
        {
          role: "system",
          content:
            "너의 이름은 AI자세코치야. 정형외과 지식을 풍부하게 가지고 있어",
        },
        { role: "user", content: prompt },
        // {role: "user", content: "거북목증후군이란 뭐야?" },
        // {role: "assistant", content: "거북이야" },
      ],
      temperature: 0.6, // 모델의 출력 다양성
      max_tokens: 300, // 응답받을 메시지 최대 토큰(단어) 수 설정
      top_p: 1, // 토큰 샘플링 확률을 설정
      frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
      presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
      stop: ["Human"], // 생성된 텍스트에서 종료 구문을 설정
    }),
  };
  // API 요청후 응답 처리
  try {
    const response = await fetch(apiEndpoint, requestOptions);

    if (!response.ok) {
      // 응답 상태가 OK가 아닐 때 오류 처리
      if (response.status === 429) {
        console.error("API 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        return "API 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
      }
      console.error(
        "OpenAI API 호출 중 오류 발생:",
        response.status,
        response.statusText
      );
      return `OpenAI API 호출 중 오류 발생: ${response.status} ${response.statusText}`;
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error("OpenAI API 응답에서 데이터가 없습니다.");
      return "OpenAI API 응답에서 데이터가 없습니다.";
    }

    const aiResponse = data.choices[0].message.content;
    return aiResponse;
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    return "OpenAI API 호출 중 오류 발생";
  }
}
