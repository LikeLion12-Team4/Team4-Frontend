const API_BASE_URL = 'https://stand-up-back.store';

const CATEGORIES = [
  { id: 3, name: "제품 추천 게시판" },
  { id: 2, name: "영상 후기 게시판" },
  { id: 1, name: "병원 후기 게시판" },
  { id: 4, name: "홍보 게시판" },
  { id: 5, name: "자유 게시판"}
];

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");
  loadHeaders();
  setupMoreButtons();
  loadAllCategoryPosts();
});

function loadHeaders() {
  console.log("Loading headers");
  var allElements = document.getElementsByTagName("*");
  Array.prototype.forEach.call(allElements, function (el) {
    var includePath = el.dataset.includePath;
    if (includePath) {
      console.log("Loading header from:", includePath);
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
}

function setupMoreButtons() {
  const moreButtons = document.querySelectorAll('.post_category_header');
  moreButtons.forEach((header, index) => {
    const moreButton = header.querySelector('button') || document.createElement('button');
    moreButton.textContent = '더보기 +';
    moreButton.addEventListener('click', () => {
      const categoryId = CATEGORIES[index].id;
      window.location.href = `post_collection.html?category=${encodeURIComponent(CATEGORIES[index].name)}&id=${categoryId}`;
    });
    if (!header.querySelector('button')) {
      header.appendChild(moreButton);
    }
  });
}

function loadAllCategoryPosts() {
  CATEGORIES.forEach(category => {
    loadPostsForCategory(category.id);
  });
}


async function loadPostsForCategory(categoryId) {
  console.log(`Loading posts for category ID: ${categoryId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/forums/${categoryId}/`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received data for category ${categoryId}:`, data);
    
    // 여기서 실제 게시글 데이터를 가져오는 추가 요청을 보냅니다.
    const postsResponse = await fetch(`${API_BASE_URL}/post/${categoryId}/`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!postsResponse.ok) {
      throw new Error(`HTTP error! status: ${postsResponse.status}`);
    }

    const postsData = await postsResponse.json();
    console.log(`Received posts for category ${categoryId}:`, postsData);
    
    displayPosts(categoryId, postsData);
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error);
    displayErrorMessage(categoryId, '게시글을 불러오는데 실패했습니다.');
  }
}

function displayPosts(categoryId, posts) {
  console.log(`Displaying posts for category ${categoryId}`);
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  const postContainer = document.querySelector(`.post_category:nth-child(${CATEGORIES.indexOf(category) + 1}) .category_post_contents`);
  
  if (!postContainer) {
    console.error(`Post container for category ${categoryId} not found`);
    return;
  }

  postContainer.innerHTML = ''; // 기존 내용을 지움

  if (!posts || posts.length === 0) {
    postContainer.innerHTML = '<p>이 카테고리에 게시글이 없습니다.</p>';
    return;
  }

  const postList = document.createElement('ul');
  postList.className = 'post-list';

  posts.slice(0, 5).forEach(post => {
    const listItem = document.createElement('li');
    listItem.className = 'post-item';
    
    const createdAt = new Date(post.created_at);
    const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

    listItem.innerHTML = `
      <a href="post.html?id=${post.id}" class="post-link">
        <span class="post-title">${post.title}</span>
        <span class="post-author">${post.user.username}</span>
        <span class="post-date">${formattedDate}</span>
      </a>
  
    `;
    postList.appendChild(listItem);
  });

  postContainer.appendChild(postList);
  console.log(`Posts displayed for category ${categoryId}`);
}

function displayErrorMessage(categoryId, message) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const postContainer = document.querySelector(`.post_category:nth-child(${CATEGORIES.indexOf(category) + 1}) .category_post_contents`);
  
  if (postContainer) {
    postContainer.innerHTML = `<p>Error: ${message}</p>`;
  }
}

function getToken() {
  return getCookie("accessToken");
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}



