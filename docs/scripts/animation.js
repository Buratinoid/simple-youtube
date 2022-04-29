import { addSearchResults, pageNumber } from '/scripts/createResults.js'

const reduceNav = () => {
    let nav = document.querySelector('nav');
    let homePageLogo = document.querySelector('.homePageLogo');
    homePageLogo.style.opacity = '0';
    homePageLogo.style.height = '0';
    nav.classList.toggle('reduce');
}

const hidePreviousButton = () => {
    let previousButton = document.querySelector('.previousPage');
    pageNumber > 1 ? 
    previousButton.style.visibility = 'visible' :
    previousButton.style.visibility = 'hidden' ;
}

function reloadResults (direction) {
    disableButtons();
    hideResults().then(() => {
        addSearchResults(direction)
        .then(() => {
            hidePreviousButton();
            showResults()
                .then(() => {
                    enableButtons();
            })
        })
    })
}

const disableButtons = () => {
  let buttons = document.querySelectorAll('button')
    for(let item of buttons) {
      item.setAttribute('disabled', true);
    }
}

const enableButtons = () => {
  let buttons = document.querySelectorAll('button')
  for(let item of buttons) {
    item.removeAttribute('disabled');
  }
}

const hideResults = () => {
  let results = document.querySelector('.resultsBox');
  return new Promise (resolve => {
    results.style.opacity = '0';
    results.addEventListener('transitionend', () => {
      resolve();
    })
  })
}

const showResults = () => {
  let results = document.querySelector('.resultsBox');
  return new Promise (resolve => {
    results.style.opacity = '1';
    results.addEventListener('transitionend', () => {
      resolve();
    })
  })
}

const showNumberBar = () => {
  let numberBar = document.querySelector('.pageNumberBox');
      numberBar.style.visibility = 'visible';
      numberBar.style.opacity = '1';
}

export {
        reduceNav,
        hidePreviousButton,
        reloadResults,
        disableButtons,
        enableButtons,
        hideResults,
        showResults,
        showNumberBar
        }
