import { 
        youtubeDataArray,
        userAPIKey 
                          } from '/scripts/data.js';
import { addSearchResults } from '/scripts/createResults.js';
import { testJSON } from '/scripts/test.js';

let pageToken = '';

const idRequestPrepare = () => {
    const idSearchUrl = 'https://youtube.googleapis.com/youtube/v3/search';
    let idRequest = new URL(idSearchUrl);
    let question = document.querySelector('.searchInput').value;
    const resultsQuantity = 15;

    idRequest.searchParams.set('part', 'id');
    idRequest.searchParams.set('maxResults', `${resultsQuantity}`);
      
    pageToken !== 0 ? idRequest.searchParams.set('pageToken', pageToken) : null;
    
    idRequest.searchParams.set('q', question);
    idRequest.searchParams.set('key', userAPIKey);
      
    return idRequest
}

const extractIdArray = (idData, idArray) => {
    let { nextPageToken = '', items } = idData;
    pageToken = nextPageToken;
    for (let item of items) {
      item.id.videoId !== undefined ? idArray.push(item.id.videoId) : null;   // Иногда youtube выдаёт без videoId
    }
}

const videoRequestPrepare = (idArray) => {
    const videoSearchUrl = 'https://youtube.googleapis.com/youtube/v3/videos';
    let part = 'snippet,statistics';
    let videoRequest = new URL(videoSearchUrl);
    videoRequest.searchParams.set('part', part);
    videoRequest.searchParams.set('id', idArray);
    videoRequest.searchParams.set('key', userAPIKey);
    return videoRequest
}

const requestSend = async(param = 3) => {
// Параметры requestSend(): 
// 1 - тестовый массив из test.js (результатов 27! дальше будет через API)
// 2 - продолжение поиска через API
// 3 - новый поиск через API
  let idArray = [];
    if (param === 1) {
      testJSON();
      await addSearchResults(param + 2);

    } else {

    await fetch(idRequestPrepare())
        .then((response) => {
            if (response.ok) {
                return response;
          } else {
              console.log('Error: ' + response.status);
          }
        })
        .then(response => response.json())
        .then(idData => extractIdArray(idData, idArray))
        .catch(error => {
          console.log('Error: ' + error.message);
        })
    
    await fetch(videoRequestPrepare(idArray))
        .then((response) => {
            if (response.ok) {
                return response;
          } else {
              console.log('Error: ' + response.status);
          }
        })
        .then((response) => response.json())
        .then((youtubeData) => createYoutubeDataArray(youtubeData))
        .then(() => {
            param === 3 ? addSearchResults(param) : null
        })
    }
}

function createYoutubeDataArray (youtubeData) {
    let { items } = youtubeData;
    let noImage = './src/icons/noImage.png';

    for (let item of items) {
      let { 
        id,  // Проверка на остутсвие id в extractIdArray()
        snippet: {  publishedAt = '', 
                    channelTitle = '', 
                    channelId = '', 
                    title = 'Название отсутствует', 
                    description = 'Описание отсутствует',
        thumbnails }, 
        statistics: { viewCount = 0 }
      } = item;

      let { default: defaultUrl, 
            medium: mediumUrl, 
            high: highUrl,
            standard: standardUrl } = thumbnails;
              
      defaultUrl === undefined ?  defaultUrl = noImage :
                                  defaultUrl = defaultUrl.url
  
      mediumUrl === undefined ? mediumUrl = noImage :
                                mediumUrl = mediumUrl.url
  
      highUrl === undefined ? highUrl = noImage :
                              highUrl = highUrl.url
  
      standardUrl === undefined ? standardUrl = noImage :
                                  standardUrl = standardUrl.url
  
      let videoData = {
        id,
        publishedAt,
        channelTitle,
        channelId,
        title,
        description,
        viewCount,
        defaultUrl,
        mediumUrl,
        highUrl,
        standardUrl
      };

      youtubeDataArray.push(videoData);
    }
}

export {
        requestSend,
        createYoutubeDataArray
        };