// 전역 변수
const API_BASE_URL = 'https://stand-up-back.store/';
const POSTS_PER_PAGE = 15;
let currentPage = 1;
let currentPageGroup = 1;
const PAGES_PER_GROUP = 5;
let totalPosts = 0;
let totalPages = 0;

console.log('스크립트 시작: ' + new Date().toLocaleTimeString());

window.addEventListener('load', function() {
    console.log('window load 이벤트 발생: ' + new Date().toLocaleTimeString());
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
    console.log('DOMContentLoaded 이벤트 발생: ' + new Date().toLocaleTimeString());
    setupPagination();
    loadPosts();
    setupEventListeners();
    getUserInfo();
    updateCategoryTitle();
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

function setupEventListeners() {
    console.log('setupEventListeners 실행: ' + new Date().toLocaleTimeString());
    const writeButton = document.querySelector('.post_button') || document.querySelector('button:contains("글쓰기")');
    if (writeButton) {
        writeButton.addEventListener('click', redirectToPostingPage);
    } else {
        console.log('글쓰기 버튼을 찾을 수 없습니다.');
    }
}

async function loadPosts() {
    console.log('loadPosts 시작: ' + new Date().toLocaleTimeString());
    try {
        const response = await fetch(`${API_BASE_URL}/post/?page=${currentPage}&page_size=${POSTS_PER_PAGE}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        totalPosts = data.total_count;
        totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

        displayPosts(data.posts);
        setupPagination();
        updatePaginationButtons();
        console.log('loadPosts 완료: ' + new Date().toLocaleTimeString());
    } catch (error) {
        console.error('게시글 로드 중 오류 발생:', error);
        displayErrorMessage('게시글을 불러오는 데 실패했습니다. 나중에 다시 시도해 주세요.');
    }
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

function displayPosts(posts) {
    const tableBody = document.querySelector('.post_table tbody');
    if (!tableBody) {
        console.error('post_table tbody를 찾을 수 없습니다.');
        return;
    }
    tableBody.innerHTML = '';

    if (posts.length === 0) {
        const row = tableBody.insertRow();
        row.innerHTML = '<td colspan="5">게시글이 없습니다.</td>';
        return;
    }

    posts.forEach(post => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.user.username}</td>
            <td>${new Date(post.created_at).toLocaleString()}</td>
            <td>${post.postlikes_num}</td>
        `;
    });
}

function setupPagination() {
    console.log('setupPagination 실행: ' + new Date().toLocaleTimeString());
    const paginationElement = document.querySelector('.pagination');
    if (!paginationElement) {
        console.error('pagination 요소를 찾을 수 없습니다.');
        return;
    }
    paginationElement.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = '이전';
    prevButton.addEventListener('click', () => {
        if (currentPageGroup > 1) {
            currentPageGroup--;
            currentPage = (currentPageGroup - 1) * PAGES_PER_GROUP + 1;
            loadPosts();
        }
    });
    paginationElement.appendChild(prevButton);

    const startPage = (currentPageGroup - 1) * PAGES_PER_GROUP + 1;
    const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.toggle('active', i === currentPage);
        button.addEventListener('click', () => {
            currentPage = i;
            loadPosts();
        });
        paginationElement.appendChild(button);
    }

    const nextButton = document.createElement('button');
    nextButton.innerText = '다음';
    nextButton.addEventListener('click', () => {
        if (currentPageGroup * PAGES_PER_GROUP < totalPages) {
            currentPageGroup++;
            currentPage = (currentPageGroup - 1) * PAGES_PER_GROUP + 1;
            loadPosts();
        }
    });
    paginationElement.appendChild(nextButton);
}

function updatePaginationButtons() {
    const buttons = document.querySelectorAll('.pagination button');
    const startPage = (currentPageGroup - 1) * PAGES_PER_GROUP + 1;

    buttons.forEach((button, index) => {
        if (index === 0) {
            button.disabled = currentPageGroup === 1;
        } else if (index === buttons.length - 1) {
            button.disabled = currentPageGroup * PAGES_PER_GROUP >= totalPages;
        } else {
            const pageNum = startPage + index - 1;
            button.innerText = pageNum;
            button.classList.toggle('active', pageNum === currentPage);
        }
    });
}

function redirectToPostingPage() {
    console.log('redirectToPostingPage 실행: ' + new Date().toLocaleTimeString());
    window.location.href = 'posting.html';
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function getToken() {
    const token = getCookie("accessToken");
    console.log('Current token:', token);
    return token || null;
}

function getUserInfo() {
    console.log('getUserInfo 시작: ' + new Date().toLocaleTimeString());
    const token = getToken();
    if (!token) {
        console.error('토큰이 없습니다.');
        displayErrorMessage('로그인이 필요합니다.');
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