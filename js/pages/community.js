const API_BASE_URL = 'https://stand-up-back.store';

const CATEGORIES = [
  { id: 3, name: "제품 추천" },
  { id: 2, name: "영상 후기" },
  { id: 1, name: "병원 후기" },
  { id: 4, name: "홍보" }
];

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");
  loadHeaders();
  loadCategoryPosts();
  setupMoreButtons();
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
  console.log("Setting up more buttons");
  const moreButtons = document.querySelectorAll('.post_category_header .more_btn');
  moreButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.dataset.category;
      const categoryObj = CATEGORIES.find(c => c.name === category);
      if (categoryObj) {
        window.location.href = `post_collection.html?category=${encodeURIComponent(category)}&id=${categoryObj.id}`;
      }
    });
  });
}

function loadCategoryPosts() {
  console.log("Loading category posts");
  CATEGORIES.forEach(category => {
    console.log(`Fetching posts for category: ${category.name}`);
    fetch(`${API_BASE_URL}/forums/${category.id}/`)  // 헤더 부분 제거
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Received data for ${category.name}:`, data);
        displayCategoryPosts(category.name, data);
      })
      .catch(error => {
        console.error('Error fetching posts for category:', category.name, error);
        displayErrorMessage(category.name, error.message);
      });
  });
}

function displayCategoryPosts(categoryName, data) {
  console.log(`Displaying posts for category: ${categoryName}`);
  
  // categoryName을 가지고 있는 <p> 요소를 찾기
  const categoryHeader = Array.from(document.querySelectorAll('.post_category_header p'))
    .find(header => header.textContent.trim() === categoryName);
  
  if (!categoryHeader) {
    console.error(`Category header element not found for: ${categoryName}`);
    return;
  }

  // 가장 가까운 .post_category 요소를 찾고 그 안의 .category_post_contents 요소를 찾음
  const categoryContent = categoryHeader.closest('.post_category').querySelector('.category_post_contents');

  if (!categoryContent) {
    console.error(`Category content element not found for: ${categoryName}`);
    return;
  }

  categoryContent.innerHTML = ''; // 기존 내용을 지움

  if (!data || !data.results || data.results.length === 0) {
    categoryContent.innerHTML = '<p>이 카테고리에 게시글이 없습니다.</p>';
    return;
  }

  const postList = document.createElement('ul');
  postList.className = 'post-list';

  data.results.slice(0, 5).forEach(post => {
    const listItem = document.createElement('li');
    listItem.className = 'post-item';
    listItem.innerHTML = `
      <a href="/post_detail.html?id=${post.id}" class="post-link">
        ${post.title}
      </a>
    `;
    postList.appendChild(listItem);
  });

  categoryContent.appendChild(postList);
  console.log(`Posts displayed for category: ${categoryName}`);
}

function displayErrorMessage(categoryName, message) {
  const categoryHeader = Array.from(document.querySelectorAll('.post_category_header p'))
    .find(header => header.textContent.trim() === categoryName);
  
  if (!categoryHeader) {
    console.error(`Category header element not found for: ${categoryName}`);
    return;
  }

  const categoryContent = categoryHeader.closest('.post_category').querySelector('.category_post_contents');

  if (categoryContent) {
    categoryContent.innerHTML = `<p>Error loading posts: ${message}</p>`;
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

