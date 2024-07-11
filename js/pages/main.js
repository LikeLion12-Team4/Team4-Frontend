window.addEventListener('load', function() {
    var allElements = this.document.getElementsByTagName('*');
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
    const slides = document.querySelectorAll(".video_container");
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function() {
            dot.firstChild.classList.remove("active");
            this.classList.add("active");

            slides.forEach((slide, slideIndex) => {
                slide.style.transform = 'translateX(-${index *100}%';
            });
        });
    });
    
    
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

    
});








