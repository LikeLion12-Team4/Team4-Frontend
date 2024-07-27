var naverLogin = new naver.LoginWithNaverId({
  clientId: "zYwQyJbcQEHaGmhJn_cv", //내 애플리케이션 정보에 cliendId를 입력해줍니다.
  callbackUrl: "http://127.0.0.1:8000/html/pages/naver-signUp.html", // 내 애플리케이션 API설정의 Callback URL 을 입력해줍니다.
  isPopup: false,
  loginButton: { color: "green", type: 1, height: 43 },
});

naverLogin.init();
