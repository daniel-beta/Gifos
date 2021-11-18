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
        console.log("nichim")
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
    console.log('Ha ocurrido un error ' + e);
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
}

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
});

/* SEARCH FUNCTION */

const search = (word) => {
  const urlSearch = `${giphyUrl}gifs/search?api_key=${apiKey}&q=${word}&q=&limit=12`;
  const result = getApi(urlSearch);
  gifosResult.innerHTML = ''
  result.then((resp) => {
    if (resp.data.length === 0) {
      console.log('nada')
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

/* CREATE GIF CARDS */

const createGifCards = (data) => {
  const gifoTrending = document.createElement('div');
  gifoTrending.classList.add('gifoTrending');
  gifoTrending.innerHTML =
    `<img
      src="${data.images.original.url}"
      alt="${data.title}"
    />
    <div class="gifoInfo">
      <div class="actions">
        <div class="like icon"></div>
        <div class="download icon"></div>
        <div class="expand icon"></div>
      </div>
      <div class="titles">
        <p class="user">${data.username}</p>
        <p class="title">${data.title}</p>
      </div>
    </div>`
  gifosResult.appendChild(gifoTrending)
};

/* SHOW MORE */

let page = 12
showMore.addEventListener('click', () => {
  page += 12;
  showMoreFunction(titleResult.textContent, page);
});

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
  gifSlider.innerHTML =
    `<img
      src="${data.images.original.url}"
      alt="${data.title}"
    />
    <div class="gifoInfo">
      <div class="actions">
        <div class="like icon"></div>
        <div class="download icon"></div>
        <div class="expand icon"></div>
      </div>
      <div class="titles">
        <p class="user">${data.username}</p>
        <p class="title">${data.title}</p>
      </div>
    </div>`
  sliderTrending.appendChild(gifSlider)
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

/* FUNCTIONS */

getTrendingSearches()
searchSuggestions()
trendingSlider();
