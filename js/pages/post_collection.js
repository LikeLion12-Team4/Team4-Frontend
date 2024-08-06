const API_BASE_URL = 'https://stand-up-back.store';

const CATEGORIES = [
  { id: 3, name: "제품 추천" },
  { id: 2, name: "영상 후기" },
  { id: 1, name: "병원 후기" },
  { id: 4, name: "홍보" }
];

window.addEventListener("load", function() {
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    updateCategoryTitle();
    checkLoginStatus();
    setupEventListeners();
});

function updateCategoryTitle() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        const titleElement = document.getElementById('category_title');
        if (titleElement) {
            titleElement.textContent = category;
        }
    }
}

function checkLoginStatus() {
    const token = getToken();
    if (token) {
        getUserInfo();
        loadPosts();
    } else {
        displayLoginMessage();
    }
}

function displayLoginMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = '게시글을 보려면 로그인이 필요합니다.';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.marginTop = '20px';

    const loginButton = document.createElement('button');
    loginButton.textContent = '로그인';
    loginButton.onclick = function() {
        window.location.href = '../../components/login.html';
    };
    messageDiv.appendChild(document.createElement('br'));
    messageDiv.appendChild(loginButton);

    const mainContent = document.querySelector('main') || document.body;
    mainContent.innerHTML = '';
    mainContent.appendChild(messageDiv);
}

async function loadPosts() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    
    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/post/${categoryId}/`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('서버에서 받은 데이터:', data);

        displayPosts(data);
    } catch (error) {
        console.error('게시글 로드 중 오류 발생:', error);
        displayErrorMessage('게시글을 불러오는 데 실패했습니다. 나중에 다시 시도해 주세요.');
    }
}

function displayPosts(posts) {
    const tableBody = document.querySelector('.post_table tbody');
    if (!tableBody) {
        console.error('post_table tbody를 찾을 수 없습니다.');
        return;
    }
    tableBody.innerHTML = '';

    if (!posts || posts.length === 0) {
        const row = tableBody.insertRow();
        row.innerHTML = '<td colspan="5">게시글이 없습니다.</td>';
        return;
    }

    posts.forEach(post => {
        const row = tableBody.insertRow();
        const createdAt = new Date(post.created_at);
        const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;
        
        // 작성자 이름을 가져오는 로직 수정
        let authorName = 'Unknown';
        if (post.user && post.user.username) {
            authorName = post.user.username;
        } else if (post.user_name) {
            authorName = post.user_name;
        }

        row.innerHTML = `
            <td>${post.id}</td>
            <td><a href="/post_detail.html?id=${post.id}">${post.title}</a></td>
            <td>${authorName}</td>
            <td>${formattedDate}</td>
            <td>${post.num || 0}</td>
        `;
    });
}



function setupEventListeners() {
    const writeButton = document.querySelector('.post_button') || document.querySelector('button:contains("글쓰기")');
    if (writeButton) {
        writeButton.addEventListener('click', redirectToPostingPage);
    } else {
        console.log('글쓰기 버튼을 찾을 수 없습니다.');
    }
}

function redirectToPostingPage() {
    window.location.href = 'posting.html';
}

function getToken() {
    return getCookie("accessToken");
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function getUserInfo() {
    const token = getToken();
    if (!token) {
        console.error('토큰이 없습니다.');
        displayLoginMessage();
        return;
    }
    fetch(`${API_BASE_URL}/users/user/`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('인증 실패: 다시 로그인해주세요.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        const name = result.username;
        const userNameElement = document.querySelector(".user_name");
        if (userNameElement) {
            userNameElement.innerText = name;
        } else {
            console.error('user_name 요소를 찾을 수 없습니다.');
        }
        console.log('사용자 이름:', name);
    })
    .catch(error => {
        console.error("사용자 정보 가져오기 오류", error);
        displayErrorMessage(error.message);
    });
}

function displayErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    const postTable = document.querySelector('.post_table');
    if (postTable) {
        postTable.before(errorDiv);
    } else {
        document.body.prepend(errorDiv);
    }
}
