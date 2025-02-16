const galleryMasonry = (function() {
  let columnsCount = 4, gap = 15,
      colsHeight = new Array(columnsCount).fill(0),
      container = document.querySelector('.gallery-masonry'),
      galleryContent = container.querySelector('.gallery-content'),
      list = galleryContent.querySelector('.inner-content'),
      allImgs = Array.from(container.querySelectorAll('.gallery-content .gallery-img')),
      showBtn = container.querySelector('.show-btn'),
      popup = container.querySelector('.gallery-popup'),
      currList = null, picIndex = 0;

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

  galleryContent.addEventListener('click', (e) => {
    let pic = e.target.closest('.pic'),
        picContainer = popup.querySelector('.pic-box');
    if (pic) { // Open Popup lightbox
      let currImg = pic.querySelector('img');
      // Assign new gallery list
      currList = Array.from(galleryContent.querySelectorAll('.gallery-img'));
      // Assign img index
      picIndex = currList.indexOf(currImg);
      if (!picContainer.children[0]) {
        let newImg = document.createElement('img');
        newImg.className = 'gallery-img';
        newImg.src = currImg.src;
        picContainer.appendChild(newImg);
      } else {
        picContainer.children[0].src = currImg.src;
      }

      // Active Popup
      popup.classList.add('active');
      popup.classList.add('fadeIn2');
      let nextBtn = popup.querySelector('.next-btn'),
          prevBtn = popup.querySelector('.prev-btn');

      // Check Next Button
      if (!currList[picIndex + 1]) {
        nextBtn.classList.add('disabled');
      } else if (nextBtn.classList.contains('disabled')) {
        nextBtn.classList.remove('disabled');
      }

      // Check Previous Button
      if (!currList[picIndex - 1]) {
        prevBtn.classList.add('disabled');
      } else if (prevBtn.classList.contains('disabled')) {
        prevBtn.classList.remove('disabled');
      }
    }
  });

  popup.addEventListener('click', (e) => {
    if (e.target.closest('.arrow:not(.disabled)')) { // Arrow
      let nextBtn = e.target.closest('.next-btn') || e.target.closest('.arrows').querySelector('.next-btn'),
          prevBtn = e.target.closest('.prev-btn') || e.target.closest('.arrows').querySelector('.prev-btn');
      if (e.target.closest('.next-btn')) { // Next Button
        if (currList[picIndex + 1]) {
          picIndex += 1;
          popup.querySelector('.gallery-img').src = currList[picIndex].src;
          if (!currList[picIndex + 1]) {
            nextBtn.classList.add('disabled');
          }
        }
      } else { // Previous Button
        if (currList[picIndex - 1]) {
          picIndex -= 1;
          popup.querySelector('.gallery-img').src = currList[picIndex].src;
          // Check Prev button
          if (!currList[picIndex - 1]) {
            prevBtn.classList.add('disabled');
          }
        }
      }
    } else if (e.target.closest('.close-btn') || (popup.classList.contains('active') && !e.target.classList.contains('gallery-img'))) { // Close popup
      popup.classList.remove('fadeIn2');
      popup.classList.add('fadeOut2');
      setTimeout(() => {
        popup.classList.remove('active');
        popup.classList.remove('fadeOut2');
      }, 240);
    }
  })

  UI_init();
  window.onload = function() {
    // Sort Images by height
    allImgs.sort((a,b) => b.height - a.height);
    UI_gallery();
  }



})();