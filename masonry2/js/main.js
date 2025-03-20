const galleryMasonry = (function() {
  if (document.querySelector('.gallery-masonry')) {
    let container = document.querySelector('.gallery-masonry'),
        galleryContent = container.querySelector('.gallery-content'),
        list = container.querySelector('.gallery-content .inner-content'),
        showBtn = container.querySelector('.show-btn'),
        tourBtn = document.querySelectorAll('.schedule-tour'),
        popup = container.querySelector('.gallery-popup'),
        schedulePopup = container.querySelector('.schedule-popup'),
        scheduleListing = container.querySelector('.schedule-popup .gallery-content'),
        noteBtn = container.querySelector('.form-note'),
        selectBox = container.querySelector('.select-input select'),
        floatingInputs = container.querySelectorAll('.floating-input input'),
        dateContainer = container.querySelector('.tab-input-container'),
        dateArrow = container.querySelector('.tab-input-container .slider-arrow'),
        dateSlidesContainer = container.querySelector('.tab-input-container .tab-input'),
        requestBtn = container.querySelector('.request-btn'),
        currList = null, columnsCount = null, colsHeight = null, allImgs = null, dateArr = [],
        picIndex = 0, gap = 15, gBtnTitle = null, dsRowMax = 0, dsItemsMax = 4, dsCounter = 0;

    // Responsive Gallery Content Height
    function getGallHeight() {
      let num = null;
      if (window.innerWidth > 1211) {
        num = 1200;
      } else if (window.innerWidth <= 1211 && window.innerWidth > 916) {
        num = 780;
      } else if (window.innerWidth <= 916 && window.innerWidth > 500) {
        num = 700;
      } else {
        num = 600;
      }
      return num;
    }

    // Create Gallery Columns
    function UI_cols(ele) {
      for (let i = 0; i < columnsCount; i++) {
        let div = document.createElement('div');
        div.className = 'gallery-column';
        ele.appendChild(div);
      }
      // Sort Images by height
      allImgs.sort((a,b) => b.height - a.height);
      // Add Gallery
      UI_gallery(ele);
    }

    // Detect Gallery Height Responsive
    function UI_galleryHeight(num) {
      let gheight = getGallHeight();
      if (num <= gheight) {
        container.classList.add('small-gallery');
      } else if (num > gheight && container.classList.contains('small-gallery')) {
        container.classList.remove('small-gallery');
      }
    }

    // Add Images to the columns
    function UI_gallery(ele) {
      let cols = ele.querySelectorAll('.gallery-column');    
      for (let i = 0; i < allImgs.length; i++) {
        let div = document.createElement('div'),
            colMin = Math.min(...colsHeight),
            colIndex = colsHeight.indexOf(colMin);
        div.className = 'pic';
        div.appendChild(allImgs[i].cloneNode(true));
        cols[colIndex].appendChild(div);
        colsHeight[colIndex] += div.offsetHeight + gap;
      }
      // Calculate Gallery Height
      UI_galleryHeight(Math.max(...colsHeight));
      container.classList.add('ready');
      getCurrList(ele);
    }

    // Gallery Container animation
    if (showBtn) {
      showBtn.addEventListener('click', function() {
        let content = container.querySelector('.gallery-content'),
            contentHeight = content.children[0].offsetHeight,
            speed = 5, smooth = 40, max = getGallHeight();

        if (gBtnTitle == null) {
          gBtnTitle = this.textContent;
        }

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
          this.textContent = gBtnTitle;
          let slideDown = setInterval(frame, speed),
          counter = contentHeight - smooth;

          // Animation Function
          function frame() {
            content.style.height = counter + 'px';
            counter -= smooth;
            if (counter <= max) { // Stop Animation
              content.style.height = max + 'px';
              clearInterval(slideDown);
              // Scroll to the bottom of the Gallery
              container.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }
        }
      });
    }

    container.addEventListener('click', (e) => {
      let pic = e.target.closest('.pic'),
          picContainer = popup.querySelector('.pic-box');
      if (pic) { // Open Popup lightbox
        let currImg = pic.querySelector('img');
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
            } else if (prevBtn.classList.contains('disabled')) {
              prevBtn.classList.remove('disabled');
            }
          }
        } else { // Previous Button
          if (currList[picIndex - 1]) {
            picIndex -= 1;
            popup.querySelector('.gallery-img').src = currList[picIndex].src;
            // Check Prev button
            if (!currList[picIndex - 1]) {
              prevBtn.classList.add('disabled');
            } else if (nextBtn.classList.contains('disabled')) {
              nextBtn.classList.remove('disabled');
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
    });

    // Get Current Gallery List
    function getCurrList(ele) {
      let cols = ele.querySelectorAll('.gallery-column'),
          counter = 0, rows = 0, arr = [];
      
      for (let i = 0; i < allImgs.length; i++) {
        if (cols[counter].children[rows]) {
          arr.push(cols[counter].children[rows].children[0]);
          counter++
          if (counter > columnsCount - 1) {
            counter = 0;
            rows++;
          }
        }
      }
      currList = arr;
      return arr;
    }

    // Init Gallery
    function UI_init(status) {
      let breakPoints = {
        1181: {
          cols: 3,
          colsHeight: new Array(3).fill(0)
        },
        886: {
          cols: 2,
          colsHeight: new Array(2).fill(0)
        },
        591: {
          cols: 1,
          colsHeight: new Array(1).fill(0)
        }
      };

      // Default
      columnsCount = 4;
      colsHeight = new Array(columnsCount).fill(0);
      if (!allImgs) {
        allImgs = Array.from(galleryContent.querySelectorAll('.gallery-img'));
      }

      // Assign small screen
      let keysNum = Object.keys(breakPoints).map(Number).sort((a,b) => b-a);
      for (let i = 0; i < keysNum.length; i++) {
        let currKey = keysNum[i],
            nxtKey = keysNum[i + 1] || 0;
        if (window.innerWidth <= currKey && window.innerWidth > nxtKey) {
          columnsCount = breakPoints[currKey].cols;
          colsHeight = new Array(columnsCount).fill(0);
        }
      }

      let cols = container.querySelectorAll('.gallery-column');
      if (cols[0]) {
        cols.forEach(item => item.remove());
        let gHeight = getGallHeight();

        container.querySelectorAll('.gallery-content').forEach(item => {
          item.style.height = gHeight + 'px';
          item.classList.remove('active');
        });

        // Change Button text
        if (showBtn) {
          let btnTitle =  gBtnTitle || showBtn.textContent;
          showBtn.textContent = btnTitle;
        }
      }
      // Add Columns
      if (list) {
        UI_cols(list);
      }
      if (scheduleListing && status === 'resize') {
        UI_cols(scheduleListing);
      }
    }

    // Schedule Tour Button
    if (tourBtn[0] && schedulePopup) {
      tourBtn.forEach(item => {
        item.addEventListener('click', function() {
        // Active Popup
        schedulePopup.classList.add('active');
        schedulePopup.classList.add('fadeIn2');
        // Check for listing
        if (!scheduleListing.children.length) {
          UI_cols(scheduleListing);
        }
        });
      });

      // Popup
      schedulePopup.addEventListener('click', function(e) {
        if ((e.target.closest('.close-btn') || (this.classList.contains('active') && !e.target.closest('.popup-content'))) || (schedulePopup.querySelector('.schedule-form.active') && (!e.target.closest('.btn') && !e.target.closest('.inner-schedule')))) { // Close popup
          this.classList.remove('fadeIn2');
          this.classList.add('fadeOut2');
          UI_init('static');
          setTimeout(() => {
            this.classList.remove('active');
            this.classList.remove('fadeOut2');
            scheduleListing.innerHTML = '';
            if (schedulePopup.querySelector('.schedule-form.active')) {
              schedulePopup.querySelector('.schedule-form.active').classList.remove('active');
            }
          }, 240);
        }
      });

      // Request Info
      requestBtn.addEventListener('click', function() {
        let formEle = schedulePopup.querySelector('.schedule-form');
        formEle.classList.add('active');
        formEle.classList.add('fadeIn2');
      });

      // Form note button
      noteBtn.addEventListener('mousemove', function(e) {
        if ((e.target.closest('.form-note-btn') || e.target.closest('.note'))) {
          this.querySelector('.note').classList.add('active');
        } else if (!(e.target.closest('.form-note-btn') || e.target.closest('.note')) && this.querySelector('.note.active')) {
          this.querySelector('.note.active').classList.remove('active');
        }
      });
      noteBtn.addEventListener('mouseleave', function(e) {
        this.querySelector('.note').classList.remove('active');
      });

      //SelectBox
      selectBox.addEventListener('blur', function() {
        this.parentElement.classList.remove('active');
      });
      selectBox.addEventListener('click', function() {
        if (this.parentElement.classList.contains('active')) {
          this.parentElement.classList.remove('active');
        } else {
          this.parentElement.classList.add('active');
        }
      });

      // Floating Inputs
      floatingInputs.forEach(item => {
        item.addEventListener('input', function() {
          if (this.parentElement.classList.contains('active') && this.value.trim() === '') {
            this.parentElement.classList.remove('active');
          } else if (!this.parentElement.classList.contains('active') && this.value.trim() !== '') {
            this.parentElement.classList.add('active');
          }
        });
      });

      // Date Slider
      dateArrow.addEventListener('click', function(e) {
        let prevBtn = e.target.closest('.prev-btn'),
            nextBtn = e.target.closest('.next-btn');

        if (nextBtn && (dsCounter + 1) < dsRowMax) { // Next Slides
          dsCounter++;
          dateSlidesContainer.style.transform = 'translateX(-' + ((dateContainer.offsetWidth + 10) * dsCounter) + 'px)';
          if ((dsCounter + 1) === dsRowMax) {
            nextBtn.classList.remove('active');
            this.querySelector('.prev-btn').classList.add('active');
          } else if ((dsCounter + 1) < dsRowMax) {
            this.querySelector('.prev-btn').classList.add('active');
          }
        } else if (prevBtn && dsCounter > 0) { // Previous Slides
          dsCounter--;
          dateSlidesContainer.style.transform = 'translateX(-' + ((dateContainer.offsetWidth + 10) * dsCounter) + 'px)';
          if (dsCounter === 0) {
            prevBtn.classList.remove('active');
            this.querySelector('.next-btn').classList.add('active');
          } else if (dsCounter > 0) {
            this.querySelector('.next-btn').classList.add('active');
          }
        }
      });

      // Create Days
      getNextDays();

      // Check for slides length
      if (dateArr.length > dsItemsMax) {
        dateArrow.querySelector('.next-btn').classList.add('active');
        // Calculate Date Slides Row
        dsRowMax = Math.ceil(dateArr.length / dsItemsMax);
      }

    }

    // Create Date
    function getNextDays() {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let btn = dateSlidesContainer.querySelector('input[type="radio"]'),
          days = Number(btn.getAttribute('data-days'));

      for (let i = 1; i <= days; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
    
        let day = weekDays[date.getDay()]; // Get weekday name
        let dateNum = date.getDate().toString().padStart(2, "0"); // Ensure two digits
        let month = monthNames[date.getMonth()]; // Get month name

        let ui_li = document.createElement('li');
        ui_li.className = 'tab';

        ui_li.innerHTML = `
        <div class="inner-tab position-relative">
          <div class="content">
            <div class="day">${day}</div>
            <div class="daynum">${dateNum}</div>
            <div class="month">${month}</div>
          </div>

          <span class="outline-line"></span>
        </div>`;

        dateArr.push(`${day}, ${dateNum} ${month}`);
        dateSlidesContainer.appendChild(ui_li);
      }

      // Add Input button
      for (let i = 0; i < days; i++) {
        let btnCopy = btn.cloneNode(true),
            item = dateSlidesContainer.querySelectorAll('.tab')[i].children[0],
            line = item.querySelector('.outline-line');
        // Set Input Value
        btnCopy.value = dateArr[i];
        if (i === 0) {
          btnCopy.checked = true;
        }
        item.insertBefore(btnCopy, line);
      }
      btn.remove();
    }

    // On load
    window.onload = function() {
      UI_init('static');
    }
    // On resize
    window.onresize = function() {
      UI_init('resize');
    }
  }

})();
