import { reloadResults } from './animation.js';
import { searchVideo } from './search.js';

const createHomePage = () => {
    let navBar = document.createElement('nav');
    
    let navShadow = document.createElement('div');
        navShadow.className = 'navShadow';
    
    let searchInput = document.createElement('input');
        searchInput.className = 'searchInput';
        searchInput.setAttribute('type', 'text');
    
    let searchButton = document.createElement('button');
        searchButton.className = 'searchButton';
    
    let searchIcon = document.createElement('img');
        searchIcon.setAttribute('src', 'src/icons/search.png')
    
    let pageBar = document.createElement('div');
        pageBar.className = 'pageNumberBox';
    
    let pageNumber = document.createElement('div');
        pageNumber.className = 'pageNumber';
        pageNumber.innerText = '1';
    
    let previousPage = document.createElement('button');
        previousPage.className = 'previousPage';
        previousPage.innerText = '<';
    
    let nextPage = document.createElement('button');
        nextPage.className = 'nextPage';
        nextPage.innerText = '>';
  
    let homePageLogo = document.createElement('img');
    let urlLogo = 'src/icons/logo.png';
        homePageLogo.className = 'homePageLogo';
        homePageLogo.setAttribute('src', urlLogo);
    
    let searchResults = document.createElement('div');
    searchResults.className = 'resultsBox';
    
    document.body.append( navBar, 
                          navShadow, 
                          searchResults, 
                          pageBar);
    pageBar.append( previousPage, 
                    pageNumber, 
                    nextPage);
    navBar.append(  homePageLogo, 
                    searchInput, 
                    searchButton);
    searchButton.append(searchIcon)
        
    document.querySelector('input').addEventListener('keydown', (key) => {
        key.code === 'Enter' || key.code === 'NumpadEnter' ? searchVideo() : null
    })

    document.querySelector('.searchButton').addEventListener('click', searchVideo);
    document.querySelector('.nextPage').addEventListener('click', reloadResults.bind(null, 1));
    document.querySelector('.previousPage').addEventListener('click', reloadResults.bind(null, 0));
}

export { createHomePage };
