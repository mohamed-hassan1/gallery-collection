const galleryMasonry = (function() {
  let columnsCount = 4, gap = 15,
      colsHeight = new Array(columnsCount).fill(0),
      container = document.querySelector('.gallery-masonry'),
      list = container.querySelector('.inner-content'),
      allImgs = Array.from(container.querySelectorAll('.gallery-img'));

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

  UI_init();
  window.onload = function() {
    // Sort Images by height
    allImgs.sort((a,b) => b.height - a.height);
    UI_gallery()
  }

})();