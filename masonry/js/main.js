const galleryMasonry = (function() {
  let columnsCount = 4, gap = 15,
      colsHeight = new Array(columnsCount).fill(0),
      container = document.querySelector('.gallery-masonry'),
      list = container.querySelector('.gallery-content .inner-content'),
      allImgs = Array.from(container.querySelectorAll('.gallery-content .gallery-img')),
      showBtn = container.querySelector('.show-btn');

  // Create Gallery Columns
  function UI_init() {
    for (let i = 0; i < columnsCount; i++) {
      let div = document.createElement('div');
      div.className = 'gallery-column';
      list.appendChild(div);
    }
  }

  // Add Images to the columns
  function UI_gallery() {
    let cols = container.querySelectorAll('.gallery-column');
    for (let i = 0; i < allImgs.length; i++) {
      let div = document.createElement('div'),
          colMin = Math.min(...colsHeight),
          colIndex = colsHeight.indexOf(colMin);
      div.className = 'pic';
      div.appendChild(allImgs[i]);
      cols[colIndex].appendChild(div);
      colsHeight[colIndex] += allImgs[i].height + gap;
    }
    container.classList.add('ready');
  }

  // Gallery Container animation
  showBtn.addEventListener('click', function() {
    let content = container.querySelector('.gallery-content'),
        contentHeight = content.children[0].offsetHeight,
        speed = 5, smooth = 40, max = Number(window.getComputedStyle(content).minHeight.replace('px',''));

    if (!content.classList.contains('active')) { // Slide Down
      content.classList.add('active');
      // Change Button text
      this.textContent= 'Show Less';
      let slideDown = setInterval(frame, speed),
          counter = content.offsetHeight + smooth;

      // Animation Function
      function frame() {
        content.style.height = counter + 'px';
        counter += smooth;
        if (counter >= contentHeight) { // Stop Animation
          content.style.height = contentHeight + 'px';
          clearInterval(slideDown);
        }
      }

    } else { // Slide Up
      content.classList.remove('active');
      // Change Button text
      this.textContent = 'Show More';
      let slideDown = setInterval(frame, speed),
      counter = contentHeight - smooth;

      // Animation Function
      function frame() {
        content.style.height = counter + 'px';
        counter -= smooth;
        if (counter <= max) { // Stop Animation
          content.style.height = max + 'px';
          clearInterval(slideDown);
        }
      }
    }
  });

  UI_init();
  window.onload = function() {
    // Sort Images by height
    allImgs.sort((a,b) => b.height - a.height);
    UI_gallery();
  }



})();