import { addSearchResults } from '/scripts/createResults.js';
import { hidePreviousButton } from '/scripts/animation.js';

const resizePage = () => {
  let checkHome = document.querySelector('.numInYoutubeDataArray');
  if (checkHome !== null) { 
    addSearchResults(2)
    .then(() => hidePreviousButton());
  }

  window.addEventListener('resize', resizePage);
}

export { resizePage };
