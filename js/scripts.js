'use strict'

/* API */

const apiKey = 'zC2HjvfPhD1vMZCqbSACeEt8VwC9Tm4K';
const giphyUrl = 'https://api.giphy.com/v1/';
const uploadUrl = 'https://upload.giphy.com/v1/';

const getApi = async (url) => {
  try {
    let response = await fetch(url);
    response = await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}

/* TRENDING SEARCHES */

const getTrendingSearches = () => {
  const url = `${giphyUrl}trending/searches?api_key=${apiKey}`;
  const result = getApi(url);
  const trendingSearches = document.querySelector('#trendingSearches');
  result.then((resp) => {
    for (let i = 0; i < 5; i++) {
      trendingSearches.innerHTML +=
        `<span onclick="searchSuggestion('${resp.data[i]}')">
      ${resp.data[i]}, 
    </span>`
    }
    trendingSearches.lastChild.textContent = trendingSearches.lastChild.textContent.slice(0, -7)
  }).catch((e) => {
    console.log('Error: ' + e);
  });
}

/* SEARCH */

const searchValue = document.querySelector('#searchGifos')
const suggestionsDiv = document.querySelector('#suggestions')
const iconClose = document.querySelector('.icon-close')
const iconSearch = document.querySelector('.icon-search')
const iconSearchGray = document.querySelector('.icon-search-gray')
const searchResult = document.querySelector('#searchResult')
const titleResult = document.querySelector('#titleResult')
const gifosResult = document.querySelector("#gifosResult")
const trending = document.querySelector('#trending')
const notFound = document.querySelector('#notFound')
const showMore = document.querySelector('.showMore')

/* SUGGESTIONS - SEARCH */

const searchSuggestions = () => {
  searchValue.addEventListener('keyup', () => {
    if (searchValue.value !== '') {
      const texto = searchValue.value;
      showSuggestions(texto);
      iconSearch.classList.add('dn')
      iconClose.classList.remove('dn')
      iconSearchGray.classList.remove('dn')
      suggestionsDiv.classList.remove('dn')
      closeSearch()
    } else {
      iconSearch.classList.remove('dn')
      iconClose.classList.add('dn')
      iconSearchGray.classList.add('dn')
    }
    suggestionsDiv.innerHTML = '';
  })

  searchValue.addEventListener('keyup', () => {
    if (event.which === 13 || event.keyCode == 13) {
      if (searchValue.value !== '') {
        search(searchValue.value);
        titleResult.classList.remove('dn')
        trending.classList.add('dn')
        showMore.classList.remove('dn');
        suggestionsDiv.classList.add('dn')
      } else {
        gifosResult.innerHTML = '';
        titleResult.classList.add('dn');
        notFound.classList.remove('dn');
        showMore.classList.add('dn');
      }
    }
  });
}

const closeSearch = () => {
  iconClose.addEventListener('click', () => {
    suggestionsDiv.classList.add('dn')
    iconSearch.classList.remove('dn')
    iconClose.classList.add('dn')
    iconSearchGray.classList.add('dn')
    searchValue.value = '';
  });
}

const showSuggestions = suggestion => {
  const urlSearch = `${giphyUrl}gifs/search/tags?api_key=${apiKey}&q=${suggestion}=&limit=5`;
  const suggestions = getApi(urlSearch)
  suggestions.then((resp) => {
    resp.data.map(elementSuggestion => {
      suggestionsDom(elementSuggestion.name);
    });
  }).catch((e) => {
    console.log('Error:  ' + e);
  });
}

const suggestionsDom = suggestionDom => {
  suggestionsDiv.innerHTML +=
    `<div class='suggestion' onclick="searchSuggestion('${suggestionDom}')">
      <div class='icon-search-gray'></div>
      ${suggestionDom}
    </div>`
}

const searchSuggestion = suggestion => {
  search(suggestion)
  suggestionsDiv.classList.add('dn')
  searchValue.value = suggestion
  titleResult.textContent = suggestion
  titleResult.classList.remove('dn')
  trending.classList.add('dn')
  if (searchValue.value !== '') {
    iconSearch.classList.add('dn')
    iconClose.classList.remove('dn')
    iconSearchGray.classList.remove('dn')
    closeSearch()
  }
  searchGray()
}

const searchGray = () => {
  iconSearchGray.addEventListener('click', () => {
    if (searchValue.value != '') {
      search(searchValue.value);
      titleResult.classList.remove('dn')
      trending.classList.add('dn')
      gifosResult.innerHTML = ''
      suggestionsDiv.classList.add('dn')
    } else {
      gifosResult.innerHTML = ''
    }
  })
}

/* SEARCH FUNCTION */

const search = (word) => {
  const urlSearch = `${giphyUrl}gifs/search?api_key=${apiKey}&q=${word}&q=&limit=12`;
  const result = getApi(urlSearch);
  gifosResult.innerHTML = ''
  result.then((resp) => {
    if (resp.data.length === 0) {
      notFound.classList.remove('dn');
      showMore.classList.add('dn');
    } else {
      notFound.classList.add('dn');
      resp.data.map((items, i) => {
        createGifCards(items);
      });
      if (resp.data.length >= 12) {
        showMore.classList.remove('dn');
      } else {
        showMore.classList.add('dn');
      }
    }
    titleResult.textContent = searchValue.value;
    console.log(resp.data)
  }).catch((e) => {
    console.log('Error: ' + e);
  });
}

/* CREATE CARD */

const createCard = (gifoId, imgUrlGif, titleGif, usernameGif, where) => {
  where.innerHTML =
    `<img
    src="${imgUrlGif}"
    alt="${titleGif}"
  />
  <div class="gifoInfo">
    <div class="actions">
      <div class="id${gifoId} like icon" onclick="like('${gifoId}','${titleGif}','${usernameGif}','${imgUrlGif}')"></div>
      <div class="download icon" onclick="download('${imgUrlGif}', '${titleGif}')"></div>
      <div class="expand icon" onclick="expand('${gifoId}','${imgUrlGif}', '${titleGif}', '${usernameGif}')"></div>
    </div>
    <div class="titles">
      <p class="user">${usernameGif}</p>
      <p class="title">${titleGif}</p>
    </div>
  </div>`
}

/* CREATE GIF CARDS */

const createGifCards = (data) => {
  const gifoTrending = document.createElement('div');
  gifoTrending.classList.add('gifoTrending');
  createCard(data.id, data.images.original.url, data.title, data.username, gifoTrending)
  gifosResult.appendChild(gifoTrending)
};

/* SHOW MORE */

const showMoreAction = () => {
  let page = 12
  showMore.addEventListener('click', () => {
    page += 12;
    showMoreFunction(titleResult.textContent, page);
  });
}

const showMoreFunction = (title, page) => {
  const urlSearch = `${giphyUrl}gifs/search?api_key=${apiKey}&q=${title}&q=&limit=12&offset=${page}`;
  const result = getApi(urlSearch);
  result.then((resp) => {
    resp.data.map((items, i) => createGifCards(items));
    if (12 > resp.data.length) {
      showMore.classList.add('dn');
    }
  }).catch((e) => {
    console.log("Error: " + e);
  });
}

/* SLIDER */

const sliderTrending = document.querySelector('#gifoTrendingSlider');

const createGifCardsSlider = (data) => {
  const gifSlider = document.createElement('div');
  gifSlider.classList.add('gifoTrending');
  createCard(data.id, data.images.original.url, data.title, data.username, gifSlider)
  sliderTrending.appendChild(gifSlider)
  iconLikeActive(data.id)
};

const expand = (gifoId, imgUrlGif, titleGif, usernameGif) => {
  const body = document.getElementsByTagName('body')[0]
  const header = document.getElementsByTagName('header')[0]
  header.insertAdjacentHTML('beforebegin',
    `<section id="expandContainer">
    <div id="expandBackground"></div>
    <div id="expandContent">
      <div id="expandCloseIcon"></div>
      <img src="${imgUrlGif}" alt="${titleGif}"/>
      <div id="gifDetails">
        <div id="nameGif">
          <div id="usernameGif">${usernameGif}</div>
          <div id="titleGif">${titleGif}</div>
        </div>
        <div class="id${gifoId} like icon" onclick="like('${gifoId}','${titleGif}','${usernameGif}','${imgUrlGif}')"></div>
        <div class="download icon" onclick="download('${imgUrlGif}', '${titleGif}')"></div>
      </div>
    </div>
  </section>`);
  const expandCloseIcon = document.querySelector('#expandCloseIcon')
  const expandContainer = document.querySelector('#expandContainer')
  expandCloseIcon.addEventListener('click', () => {
    body.removeChild(expandContainer)
  })
  const expandBackground = document.querySelector('#expandBackground')
  expandBackground.addEventListener('click', () => {
    body.removeChild(expandContainer)
  })
  iconLikeActive(gifoId)
};

const trendingSlider = () => {
  const urlTrending = `${giphyUrl}gifs/trending?api_key=${apiKey}&limit=25&rating=g`;
  const result = getApi(urlTrending);
  result.then((resp) => {
    resp.data.map((item) => createGifCardsSlider(item));
  }).catch((e) => {
    console.log("Error: " + e);
  });
};

const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');

arrowRight.addEventListener('click', () => {
  let scrollAmount = 0;
  let slideTimer = setInterval(() => {
    sliderTrending.scrollLeft += 110;
    scrollAmount += 10;
    if (scrollAmount >= 100) {
      window.clearInterval(slideTimer);
    }
  }, 20);
});

arrowLeft.addEventListener('click', () => {
  let scrollAmount = 0;
  let slideTimer = setInterval(() => {
    sliderTrending.scrollLeft -= 110;
    scrollAmount += 10;
    if (scrollAmount >= 100) {
      window.clearInterval(slideTimer);
    }
  }, 20);
});

/* DOWNLOAD */

const dataURL = async url => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

const download = async (gifDownload, name) => {
  const a = document.createElement("a");
  a.href = await dataURL(gifDownload);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* LIKES */

const like = (gifoId, titleGif, usernameGif, imgUrlGif) => {
  const dataGifo = {
    id: gifoId,
    title: titleGif,
    username: usernameGif,
    url: imgUrlGif
  }
  const likeSection = JSON.parse(localStorage.getItem('gif')) || [];
  const likeIcon = document.querySelector(`.id${gifoId}`)

  likeSection.map(element => {
    if (element.id === gifoId) {
      likeIcon.classList.add('active');
    }
  })
  if (checkLike(gifoId) === false) {
    likeIcon.classList.add('active');
    addLike(dataGifo);
  } else {
    console.log("quitando like");
    likeIcon.classList.remove('active');
    removeLike(gifoId);
  }
}

let checkLike = gifoId => {
  let likeGifo = false;
  const likeSection = JSON.parse(localStorage.getItem('gif')) || [];
  for (let gifo of likeSection) {
    if (gifo.id === gifoId) {
      likeGifo = true;
    }
  }
  return likeGifo
}

const addLike = gifoLike => {
  const likes = JSON.parse(localStorage.getItem('gif')) || [];
  likes.push(gifoLike);
  localStorage.setItem('gif', JSON.stringify(likes));
  domLikes();
}

const removeLike = (gifoID) => {
  const likeSection = JSON.parse(localStorage.getItem('gif')) || [];
  let likeIndex;
  likeSection.forEach((gifoInfo, index) => {
    if (gifoInfo.id === gifoID) {
      likeIndex = index;
    }
  });
  likeSection.splice(likeIndex, 1);
  localStorage.setItem('gif', JSON.stringify(likeSection));
  domLikes();
};

const emptyContainer = document.querySelector('#emptyContainer');
const likesContainer = document.querySelector('#likesContainer');

const domLikes = () => {
  if (document.querySelector('#likesPage')) {
    const gifosLs = JSON.parse(localStorage.getItem('gif')) || [];
    if (gifosLs.length !== 0) {
      emptyContainer.classList.add('dn');
      console.log(gifosLs);
      likesContainer.innerHTML = '';
      gifosLs.forEach((data, index) => {
        const gifoCardsLike = document.createElement('div');
        gifoCardsLike.classList.add('gifoCardsLike');
        createCard(data.id, data.url, data.title, data.username, gifoCardsLike)
        likesContainer.appendChild(gifoCardsLike)
      });
    } else {
      emptyContainer.classList.remove('dn');
      likesContainer.innerHTML = '';
    }
  }
}

const iconLikeActive = gifoId => {
  const likeSection = JSON.parse(localStorage.getItem('gif')) || [];
  likeSection.map(elemento => {
    if (elemento.id === gifoId) {
      const activeLike = document.querySelector(`.id${gifoId}`)
      activeLike.classList.add('active');
    }
  })
}

/* FUNCTIONS */

if (document.querySelector('#home')) {
  getTrendingSearches()
  searchSuggestions()
  if (document.querySelector('#gifosResult')) {
    showMoreAction();
  }
}

if (document.querySelector('#likesPage')) {
  console.log("Estas en favoritos");
  domLikes();
}

trendingSlider();
