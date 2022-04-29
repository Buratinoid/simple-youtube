import {youtubeDataArray} from 'scripts/data.js';
import {requestSend} from 'scripts/request.js';

let pageNumber = 1;

async function addSearchResults (direction) {
    
   let resultsBox = document.querySelector('.resultsBox');
   const videoUrl = 'https://www.youtube.com/watch?v=';
   const channelUrl = 'https://www.youtube.com/channel/';
   let numPage = setPageNumber(direction);
   let numClips = setClipsOnPage();
   
   let end = numPage * (numClips - 1) + (numPage - 1) // Начальное значение для поиска в массиве с результатами
   let start = end - (numClips - 1)                   // Конечное значение для поиска в массиве с результатами
 
   youtubeDataArray[end + 5] === undefined ? await requestSend(2) : null
 
   deleteResults()
   
   for (start; start <= end; start++) {
     let { 
       id, 
       publishedAt, 
       channelTitle, 
       channelId, 
       title, 
       description, 
       viewCount
      } = youtubeDataArray[start];
 
     [ 
       publishedAt, 
       viewCount, 
       description
     ] = convertYouTubeData(publishedAt, viewCount, description)
 
     let url = setThumbsResolution(start);
     
     let searchResult = document.createElement('div');
     let thumbnailBox = document.createElement('div');
     let channelSector = document.createElement('div');
     let dateSector = document.createElement('div');
     let viewsSector = document.createElement('div');
 
     let thumbnail = document.createElement('img');
     let anchorVideo = document.createElement('a');
     let anchorChannel = document.createElement('a');
     let publishedDate = document.createElement('p');
     let viewQuantity = document.createElement('p');
     let videoDescription = document.createElement('p');
     let numInYoutubeDataArray = document.createElement('p');
 
     searchResult.className = "resultVideo";

     thumbnailBox.className = 'thumbnailBox'

     thumbnail.setAttribute('src', url);
     thumbnail.className = 'thumbnail';

     anchorVideo.setAttribute('href', videoUrl + id);
     anchorVideo.setAttribute('target', '_blank');
     anchorVideo.innerHTML = title;
     anchorVideo.className = 'videoTitle';
 
     channelSector.className = 'sector';
     anchorChannel.setAttribute('href', channelUrl + channelId);
     anchorChannel.setAttribute('target', '_blank');
     anchorChannel.innerHTML = channelTitle;
 
     dateSector.className = 'sector';
     publishedDate.innerHTML = publishedAt;
 
     viewsSector.className = 'sector';
     viewQuantity.innerHTML = viewCount;
 
     videoDescription.className = 'videoDescription';
     videoDescription.innerHTML = description;
     
     numInYoutubeDataArray.className = 'numInYoutubeDataArray';
     numInYoutubeDataArray.innerText = `${start + 1}`;
 
     let channelIcon = document.createElement('img')
     channelIcon.setAttribute('src', 'src/icons/channel.png');

     let dateIcon = document.createElement('img')
     dateIcon.setAttribute('src', 'src/icons/date.png');

     let viewsIcon = document.createElement('img')
     viewsIcon.setAttribute('src', 'src/icons/views.png');
     
     resultsBox.append(searchResult);
     searchResult.append(
                         thumbnailBox,
                         channelSector,
                         dateSector,
                         viewsSector,
                         videoDescription, 
                         numInYoutubeDataArray
     );
     thumbnailBox.append(thumbnail, anchorVideo);
     channelSector.append(channelIcon, anchorChannel);
     dateSector.append(dateIcon, publishedDate);
     viewsSector.append(viewsIcon, viewQuantity);
     }
}

const deleteResults = () => {
   let findResultVideo = document.querySelectorAll('.resultVideo')  
     for (let item of findResultVideo) {
       item.remove()
     }
}
 
const setPageNumber = (direction) => {
   // Параметр для пагинации
   // 0 - предыдущая страница
   // 1 - следующая страница
   // 2 - resizePage
   // 3 (default) - новый поиск
   
   switch (direction) {
     case 0: pageNumber > 1 ? pageNumber-- : pageNumber = 1;
     break;
     case 1: pageNumber++;
     break;
     case 2: pageNumber = Math.ceil(setClipNumber() / setClipsOnPage());
     break;
     default: pageNumber = 1;
   }
   document.querySelector('.pageNumber').innerHTML = pageNumber
   return pageNumber
}
 
const setClipsOnPage = () => {
    return Math.floor(window.innerWidth / setClipWidth())
}
 
const setClipWidth = () => {
   let clipWidth;
   let maxWidth = window.innerWidth;
   if (maxWidth <= 319) {
     clipWidth = 130; 
   } else if (maxWidth >= 320 & maxWidth <= 480) {
     clipWidth = 230; 
   } else if (maxWidth > 480 & maxWidth <= 1280) {
     clipWidth = 310;
   } else if (maxWidth > 1280 & maxWidth <= 1600) {
     clipWidth = 390; 
   } else if (maxWidth > 1600 & maxWidth <= 1920) {
     clipWidth = 470; 
   } else {
     clipWidth = 610;
   } 
   return clipWidth
}
 
const setThumbsResolution = (start) => {
   let thumbUrl;
   let maxWidth = window.innerWidth;
   
   if (maxWidth < 320) {
     thumbUrl = youtubeDataArray[start].defaultUrl;
   } else if (maxWidth >= 320 & maxWidth < 1024) {
     thumbUrl = youtubeDataArray[start].mediumUrl;
   } else if (maxWidth >= 1024 & maxWidth < 1920) {
     thumbUrl = youtubeDataArray[start].highUrl;
   } else {
     thumbUrl = youtubeDataArray[start].standardUrl;
   }
   return thumbUrl
}
 
//Определение номера первого клипа на странице для resizePage() 
const setClipNumber = () => {
   return parseInt(document.querySelector('.numInYoutubeDataArray').textContent, 10)
}
 
function convertYouTubeData (publishedAt, viewCount, description) {
 
   //Преобразование YYYY-MM-DDTHH:MM:SSZ в YYYY-MM-DD
   publishedAt = publishedAt.slice(0, 10);
 
   //Приведение чисел к краткой форме (1К, 2.1М и.т.д.) 
   const reduceViewCount = (num) => {
     num >= 1e12 ? num = parseFloat((num / 1e12).toFixed(1)) + 'T' :
       num >= 1e9 ? num = parseFloat((num / 1e9).toFixed(1)) + 'B' :
         num >= 1e6 ? num = parseFloat((num / 1e6).toFixed(1)) + 'M':
           num >= 1e3 ? num = parseFloat((num / 1e3).toFixed(1)) + 'K' : num
     return num
   }
   viewCount = reduceViewCount(viewCount)
 
   //Сокращение описания (Youtube может выдать 5000 знаков)
   description.length > 120 ? 
     description = description.slice(0, 120) + '...': description
 
   return [publishedAt, viewCount, description]
}

export {
        deleteResults,
        addSearchResults,
        pageNumber
        }
