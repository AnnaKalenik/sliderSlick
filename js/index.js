const sliderWrap = document.querySelector('.slider-wrapper');
const slider = document.querySelector('.slider');
let collectSlides = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

let numSlides;
let numMargins;
let widthSliderWrap;
let widthOneSlide;
let marginSize;

let flag = false;
let currFixedSl;

let count = 0;
let amount; // число слайдов до завершения прокрутки слайдера в конце при нажатия на кнопку next

// функция для определения ширины и установления значений количества слайдов, марджинов
function checkWidth() {
  let widthWindow = window.innerWidth;

  if (widthWindow < 481) {
    [numSlides, numMargins] = [1, 2];
    amount = 1;

  } else if (widthWindow < 601) {
    [numSlides, numMargins] = [2, 4];
    amount = 2;
  } else if (widthWindow < 1025) {
    [numSlides, numMargins] = [3, 6];
    amount = 3;
  } else {
    [numSlides, numMargins] = [5, 10];
    amount = 5;
  }
}

// адаптив слайдера
function init() {
  if (flag) {
    removeClassLocked();
  }

  checkWidth();

  widthSliderWrap = sliderWrap.offsetWidth;
  widthOneSlide = document.querySelector('.slide').offsetWidth;
  marginSize = (widthSliderWrap - (widthOneSlide * numSlides)) / numMargins;

  collectSlides.forEach(slide => {
    slide.style.margin =  `20px ${marginSize}px`;
  })

  moveSlide();  // вызывается для удержания текущих слайдов на месте при изменении размеров экрана
}

init();
window.addEventListener('resize', init); // слушатель изменения экрана

// добавление класса locked при клике на слайд
collectSlides.forEach(slide => slide.addEventListener('click', addClassLocked))

function addClassLocked(event) {
  if (window.innerWidth > 480) {
    event.target.classList.add('locked');
    flag = true;
    currFixedSl = event.target;
    toggleListeners();
  }
}

// удаление класса locked при клике на слайд
function removeClassLocked() {
  currFixedSl.classList.remove('locked');
  flag = false;
  toggleListeners();
}

//переключение слушателей при наличии или отсутсвии фиксации слайда
function toggleListeners() {
  if (flag === true) {
    collectSlides.forEach((slide) => slide.removeEventListener('click', addClassLocked));
    currFixedSl.addEventListener('click', removeClassLocked);  
  } else {
    collectSlides.forEach((slide) => slide.addEventListener('click', addClassLocked));
    currFixedSl.removeEventListener('click', removeClassLocked);    
  }
}

// кнопка prev
btnPrev.addEventListener('click', function() {
  let num = -2; // кол-во слайдов, через которое нужно переставлять зафиксированный слайд в зависимости от нажатия на кнопку prev или next
  count--;

  if (count < 0) {
    count = 0;
    return;
  }

  if (flag === true) {
    fixedSlide(num);
  }
  
  moveSlide();
})

//кнопка next
btnNext.addEventListener('click', function() {
  let num = 1; // кол-во слайдов, через которое нужно переставлять зафиксированный слайд в зависимости от нажатия на кнопку prev или next
  count++;

  checkWidth();

  if (count > collectSlides.length - amount) {
    count = collectSlides.length - amount;
    return;
  }

  if (flag === true) {
    fixedSlide(num);
  }
  
  moveSlide();
})

// функция фиксации слайда при листаниии слайда вперед
function fixedSlide(num) {
  for (let i = 0; i < collectSlides.length; i++) {
    if(collectSlides[i].classList.contains('locked')) {
      collectSlides[i + num].after(collectSlides[i]);
    }
  }

  collectSlides = document.querySelectorAll('.slide');
}

// функция передвижения слайдов
function moveSlide() {
  slider.style.transform = `translate(-${count * (widthOneSlide + marginSize * 2)}px)`; 
}