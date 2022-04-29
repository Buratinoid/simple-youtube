import {
        reduceNav,
        hidePreviousButton,
        disableButtons,
        enableButtons,
        hideResults,
        showResults,
        showNumberBar 
                      } from 'scripts/animation.js';
import { requestSend } from 'scripts/request.js';
import { deleteResults } from 'scripts/createResults.js';
import { youtubeDataArray } from 'scripts/data.js';

function searchVideo () {
// Параметры requestSend(): 
// 1 - тестовый массив из test.js
// 2 - продолжение поиска через API
// 3 - новый поиск через API

  let navHeight = document.querySelector('nav')
  if (navHeight.clientHeight > window.innerHeight/5) {
    reduceNav();
    disableButtons();
    requestSend(3)  // 1 или 3
    .then(() => showNumberBar()) 
    .then(() => showResults())
    .then(() => enableButtons());
  } else {
    youtubeDataArray.length = 0;
    disableButtons();
    hideResults()
    .then(() => deleteResults())
    .then(() => requestSend(3)) // 1 или 3
    .then(() => showResults())
    .then(() => hidePreviousButton())
    .then(() => enableButtons());
  } 
}

export { searchVideo };