const hardcodedToken = window.APP_CONFIG.hardcodedToken;
document.addEventListener('DOMContentLoaded', function() {
    function checkLoginStatus() {
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
              const nicknameElements = document.querySelectorAll(".user_name");
              nicknameElements.forEach((element) => {
                element.textContent = result.username;
              });
        });
    }

    function loadVideoContent() {
        fetch('http://3.37.18.8:8000/videos/')
            .then(response => response.json())
            .then(data => {
                const videoContainer = document.getElementById('video-content');
                videoContainer.innerHTML = '';  // 기존 콘텐츠를 비웁니다.

                for (const [bodyPart, videos] of Object.entries(data)) {
                    const section = document.createElement('section');
                    const heading = document.createElement('h2');
                    heading.innerText = bodyPart;
                    section.appendChild(heading);

                    videos.forEach(video => {
                        const videoCard = document.createElement('div');
                        videoCard.classList.add('video-card');

                        const thumbnail = document.createElement('img');
                        thumbnail.src = video.thumbnail;
                        videoCard.appendChild(thumbnail);

                        const title = document.createElement('h3');
                        title.innerText = video.title;
                        videoCard.appendChild(title);

                        const length = document.createElement('p');
                        length.innerText = `Length: ${video.length} min`;
                        videoCard.appendChild(length);

                        const link = document.createElement('a');
                        link.href = video.youtubelink;
                        link.innerText = 'Watch Video';
                        link.target = '_blank';
                        videoCard.appendChild(link);

                        section.appendChild(videoCard);
                    });

                    videoContainer.appendChild(section);
                }
            })
            .catch(error => {
                console.error('Error fetching video data:', error);
            });
        };
});
