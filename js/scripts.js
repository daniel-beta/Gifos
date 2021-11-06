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
  const trendingSearches = document.querySelector("#trendingSearches");
  result.then((resp) => {
    for (let i = 0; i < 5; i++) {
      const span = document.createElement("span");
      span.textContent = `${resp.data[i]}, `
      trendingSearches.appendChild(span);
    }
    trendingSearches.lastChild.textContent = trendingSearches.lastChild.textContent.slice(0, -2)
  }).catch((e) => {
    console.log("Error: " + e);
  });
}

/* SEARCH */

const searchValue = document.querySelector("#searchGifos")

const search = () => {
  const iconSearch = document.querySelector(".icon-search")
  const iconSearchGray = document.querySelector(".icon-search-gray")
  const iconClose = document.querySelector(".icon-close")
  searchValue.addEventListener("keyup", () => {
    if (searchValue.value !== '') {
      filtrar()
      iconSearch.classList.add("dn")
      iconClose.classList.remove("dn")
      iconSearchGray.classList.remove("dn")
    } else {
      iconSearch.classList.remove("dn")
      iconClose.classList.add("dn")
      iconSearchGray.classList.add("dn")
    }
  })
}

const showSuggestions = suggestion => {
  const urlSearch = `${giphyUrl}gifs/search/tags?api_key=${apiKey}&q=${suggestion}=&limit=5`;
  const suggestions = getApi(urlSearch)
  suggestions.then((resp) => {
    resp.data.map(elementSuggestion => {
      suggestionsDom(elementSuggestion.name);
    });
  }).catch((e) => {
    console.log("Ha ocurrido un error " + e);
  });


}

const suggestionsDom = suggestionDom => {
  console.log(suggestionDom)
  const searchBar = document.querySelector("#search-bar")
  searchBar.innerHTML += `<div class="suggestions">${suggestionDom}</div>`
}

const filtrar = () =>{
  const texto = searchValue.value;
  showSuggestions(texto);
  console.log("desde filtar", searchValue.value)
}

/* showSuggestions("hola") */
getTrendingSearches()
search()
