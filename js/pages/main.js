window.addEventListener('load', function() {
    var allElements = this.document.getElementsByTagName('*');
    // var isLogin = sessionStorage.getItem("isLogin");
  var isLogin = false;
  console.log(isLogin);
  if (isLogin) {
    this.document.querySelector(".category_container").style.visibility = "visible";
    this.document.querySelector(".login_btn").style.display = "none";
    this.document.querySelector('.signup_btn').style.display = "none";
    this.document.querySelector('.logout_btn').style.display = "flex";
    this.document.querySelector('.welcome_msg').style.visibility = "visible";
  }
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});

// like_btn
document.addEventListener('DOMContentLoaded', function() {
    // 하트 아이콘 클릭 이벤트 처리
    document.querySelectorAll('.fa-heart').forEach(function(heart) {
        heart.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.classList.remove('fa-regular');
                this.classList.add('fa-solid');
                this.style.color = "#6266ED";
            } else {
                this.classList.remove('fa-solid');
                this.classList.add('fa-regular');
                this.style.color = "";
            }
        });
    });

    // 비디오 슬라이드 기능 구현
    const sliders = document.querySelectorAll('.video_silder');
    const videoWidth = 243;

    sliders.forEach(function(slider) {
        const leftBtn = slider.querySelector('.left_btn');
        const rightBtn = slider.querySelector('.right_btn');
        const videoContainer = slider.querySelector('.video_container');
        let scrollAmount = 0;

        leftBtn.addEventListener('click', function() {
            scrollAmount = Math.max(scrollAmount - videoWidth, 0);
            videoContainer.scrollTo({
                top: 0,
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        rightBtn.addEventListener('click', function() {
            scrollAmount = Math.min(scrollAmount + videoWidth, videoContainer.scrollWidth - videoContainer.clientWidth);
            videoContainer.scrollTo({
                top: 0,
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    });

    //dot
    // const slides = document.querySelectorAll(".video_container");
    // const dots = document.querySelectorAll(".dot");

    // dots.forEach((dot, index) => {
    //     dot.addEventListener("click", function() {
    //         dot.firstChild.classList.remove("active");
    //         this.classList.add("active");

    //         slides.forEach((slide, slideIndex) => {
    //             slide.style.transform = 'translateX(-${index *100}%';
    //         });
    //     });
    // });
    
    
    const lastCategory = document.querySelector('.last_category');
    const bodypartChoices = lastCategory.querySelectorAll('.bodypart_choice span');
    const videoCards = lastCategory.querySelectorAll('.video_card');

    bodypartChoices.forEach(choice => {
        choice.addEventListener('click', function() {
            const selectedPart = this.getAttribute('data-bodypart');
            // 선택된 파트의 배경색 변경
            bodypartChoices.forEach(part => {
                if (part.getAttribute('data-bodypart') === selectedPart) {
                    part.style.backgroundColor = '#6266ED';
                    part.style.color = 'white';
                } else {
                    part.style.backgroundColor = '#EAEAEA';
                    part.style.color = 'black';
                }
            });

            videoCards.forEach(card => {
                const bodypart = card.querySelector('.bodypart').textContent;
                if (bodypart === selectedPart) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const searchForm = document.querySelector('.search_bar');
    const searchInput = document.querySelector('.search_txt');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchText = searchInput.value.toLowerCase();

        // 기존 메인 컨텐츠 숨기기
        document.querySelector('main').style.display = 'none';

        // 검색 결과 섹션 가져오기 또는 생성
        let searchResults = document.querySelector('.search_results');
        if (!searchResults) {
            searchResults = document.createElement('section');
            searchResults.classList.add('search_results');
            document.body.appendChild(searchResults);
        }
        searchResults.innerHTML = ''; // 기존 검색 결과 초기화

        // AJAX 요청을 사용하여 동영상 목록 가져오기
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://3.37.18.8:8000/videos/', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var videos = JSON.parse(xhr.responseText);

                Object.keys(videos).forEach(key => {
                    videos[key].forEach(video => {
                        const videoTitle = video.title.toLowerCase();
                        const bodypart = video.bodypart.bodyname.toLowerCase();

                        if (videoTitle.includes(searchText) || bodypart.includes(searchText)) {
                            const videoCard = document.createElement('div');
                            videoCard.classList.add('video_card');

                            videoCard.innerHTML = `
                                    <a href="${video.youtubelink}" target="_blank">
                                        <div class= "video_card">
                                        <img src="${video.thumbnail}" alt="${video.title}">
                                        <span class="bodypart">${video.bodypart.bodyname}분</span>
                                        <span class="video_comment">${video.title}</span>
                                        <i class="fa-solid fa-heart" data-video-id="${video.id}"></i>
                                    </a>
                                
                            `;

                            searchResults.appendChild(videoCard);
                        }
                    });
                });

                if (searchResults.children.length === 0) {
                    searchResults.innerHTML = '<p>No results found</p>';
                }
            }
        };
        xhr.send();
    });
});
