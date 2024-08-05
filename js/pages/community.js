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

  // 더보기 버튼 이벤트 리스너 추가
  const moreButtons = document.querySelectorAll('.more_btn');
  moreButtons.forEach(button => {
      button.addEventListener('click', function() {
          const category = this.getAttribute('data-category');
          window.location.href = `post_collection.html?category=${encodeURIComponent(category)}`;
      });
  });
});
