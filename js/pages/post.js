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

let API_SERVER_DOMAIN = "https://stand-up-back.store";
let isLiked = false;

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
  const token = getToken();
  if (!token) {
    window.location.href = "../../html/pages/login.html";
    return Promise.reject("No token found");
  }
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, options);
}

function fetchPostDetails(forumId, postId) {
  return checkAndFetch(`${API_SERVER_DOMAIN}/post/${forumId}/`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((posts) => {
      const post = posts.find((p) => p.id === parseInt(postId));
      if (!post) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }
      return post;
    })
    .then((post) => {
      console.log("서버에서 받은 게시글 데이터:", post);
      displayPostDetails(post);
      return post;
    })
    .then((post) => {
      return fetchComments(post.id);
    })
    .catch((error) => {
      console.error("게시글 상세 정보 가져오기 실패:", error);
      alert("게시글을 찾을 수 없거나 오류가 발생했습니다. ID를 확인해주세요.");
    });
}

function displayPostDetails(post) {
  try {
    const postContainer = document.querySelector(".postingContainer");
    if (postContainer) postContainer.style.display = "block";

    document.querySelector("#category").textContent = post.forum.name;
    document.querySelector("#title").textContent = post.title;
    document.querySelector("#writer_nickname").textContent = post.user.username;

    const createdDate = new Date(post.created_at);
    document.querySelector("#posted_day").textContent =
      createdDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    document.querySelector("#posted_time").textContent =
      createdDate.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

    document.querySelector("#post_content").textContent = post.content;
    document.querySelector("#like_count").textContent = post.postlikes_num;
    document.querySelector("#comment_count").textContent = post.comments_num;

    // 좋아요 버튼 설정
    const likeButton = document.querySelector("#row5 i");
    if (likeButton) {
      isLiked = post.is_liked; // 서버에서 해당 사용자의 좋아요 여부를 반환한다고 가정
      updateLikeButton();
      likeButton.parentElement.onclick = () => toggleLike(post.id);
    }

    // 삭제 버튼 처리
    const deleteButton = document.querySelector("#delete_post");
    if (deleteButton) {
      getCurrentUserId()
        .then((currentUserId) => {
          if (post.user.id === currentUserId) {
            deleteButton.style.display = "inline-block";
            deleteButton.onclick = () => deletePost(post.forum.id, post.id);
          } else {
            deleteButton.style.display = "none";
          }
        })
        .catch((error) =>
          console.error("Error getting current user ID:", error)
        );
    }
  } catch (error) {
    console.error("Error displaying post details:", error);
  }
}

function getCurrentUserId() {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) {
      reject(new Error("No token found"));
      return;
    }

    checkAndFetch(`${API_SERVER_DOMAIN}/users/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          resolve(data.id);
        } else {
          reject(new Error("User ID not found in response"));
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        reject(error);
      });
  });
}

function fetchComments(postId) {
  return checkAndFetch(`${API_SERVER_DOMAIN}/comment/${postId}/`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((comments) => {
      displayComments(comments);
    })
    .catch((error) => console.error("댓글 목록 가져오기 실패:", error));
}

function displayComments(comments) {
  const commentContainer = document.getElementById("commentsContainer");
  if (!commentContainer) {
    console.error("Comments container not found");
    return;
  }

  commentContainer.innerHTML = ""; // 기존 댓글 제거

  if (comments.length === 0) {
    const noCommentDiv = document.createElement("div");
    noCommentDiv.textContent = "댓글이 없습니다.";
    commentContainer.appendChild(noCommentDiv);
  } else {
    comments.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      commentContainer.appendChild(commentElement);
    });
  }
}

function createCommentElement(comment) {
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment";
  commentDiv.innerHTML = `
    <div class="commentPic"></div>
    <div class="commentContainer">
      <div class="commentWriter">${comment.user.username}</div>
      <div class="commentContent">${comment.content}</div>
      <div style="display: flex; flex-direction: row; margin-top: 5px">
        <div class="commentTime">${new Date(comment.created_at).toLocaleString(
          "ko-KR"
        )}</div>
      </div>
    </div>
  `;
  return commentDiv;
}

function deletePost(forumId, postId) {
  if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
    return checkAndFetch(`${API_SERVER_DOMAIN}/post/${forumId}/${postId}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("게시글이 성공적으로 삭제되었습니다.");
          window.location.href = "게시글 목록 페이지 URL"; // 적절한 URL로 변경해주세요
        } else {
          throw new Error("게시글 삭제에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      });
  }
}

function updateLikeButton() {
  const likeButton = document.querySelector("#row5 i");
  if (likeButton) {
    if (isLiked) {
      likeButton.className = "fa-solid fa-heart";
    } else {
      likeButton.className = "fa-regular fa-heart";
    }
  }
}

function toggleLike(postId) {
  if (isLiked) {
    unlikePost(postId);
  } else {
    likePost(postId);
  }
}

function likePost(postId) {
  checkAndFetch(`${API_SERVER_DOMAIN}/postlike/create/${postId}/`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }
      isLiked = true;
      updateLikeButton();
      const likeCountElement = document.querySelector("#like_count");
      likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
    })
    .catch((error) => {
      console.error("Error liking post:", error);
      if (error.message === "이미 좋아요를 눌렀습니다.") {
        alert("이미 좋아요를 누르셨습니다.");
      } else {
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
    });
}

function unlikePost(postId) {
  checkAndFetch(`${API_SERVER_DOMAIN}/postlike/${postId}/`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        isLiked = false;
        updateLikeButton();
        const likeCountElement = document.querySelector("#like_count");
        likeCountElement.textContent =
          parseInt(likeCountElement.textContent) - 1;
      } else {
        throw new Error("Failed to unlike post");
      }
    })
    .catch((error) => {
      console.error("Error unliking post:", error);
      alert("좋아요 해제 중 오류가 발생했습니다.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const postLookupForm = document.getElementById("postLookupForm");
  if (postLookupForm) {
    postLookupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const forumId = document.getElementById("forumIdInput").value;
      const postId = document.getElementById("postIdInput").value;
      if (forumId && postId) {
        fetchPostDetails(forumId, postId);
      } else {
        alert("게시판 ID와 게시글 ID를 모두 입력해주세요.");
      }
    });
  }
});
