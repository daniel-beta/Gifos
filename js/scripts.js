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

const searchValue = document.querySelector("#searchGifos");
searchValue.addEventListener("keyup", () => {
  console.log(searchValue.value)
})



getTrendingSearches();
