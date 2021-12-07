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
  const iconLike = `<div class="id${gifoId} like icon" onclick="like('${gifoId}','${titleGif}','${usernameGif}','${imgUrlGif}')"></div>`
  const iconDelete = `<div class="id${gifoId} delete icon" onclick="removeGifo('${gifoId}')"></div>`
  where.innerHTML =
    `<img
    src="${imgUrlGif}"
    alt="${titleGif}"
    onclick="expand('${gifoId}','${imgUrlGif}', '${titleGif}', '${usernameGif}')"
  />
  <div class="gifoInfo">
    <div class="actions"> 
      ${document.querySelector('#misGifosPage') ? iconLike + iconDelete : iconLike}
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
  arrows()
  result.then((resp) => {
    resp.data.map((item) => createGifCardsSlider(item));
  }).catch((e) => {
    console.log("Error: " + e);
  });
};

const arrows = () => {
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
}

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

const removeLike = (gifoId) => {
  const likeSection = JSON.parse(localStorage.getItem('gif')) || [];
  let likeIndex;
  likeSection.forEach((gifoInfo, index) => {
    if (gifoInfo.id === gifoId) {
      likeIndex = index;
    }
  });
  likeSection.splice(likeIndex, 1);
  localStorage.setItem('gif', JSON.stringify(likeSection));
  domLikes();
  document.querySelector(`.id${gifoId}`).classList.remove('active');
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

const menuMobile = () => {
  const iconMenuMobile = document.querySelector('.menuMobile')
  const menuList = document.querySelector("#menuList")
  const header = document.getElementsByTagName('header')
  iconMenuMobile.addEventListener('click', e => {
    e.preventDefault()
    if (menuList.classList.contains("open")) {
      menuList.classList.remove("open")
      header[0].classList.remove("open")
    } else {
      menuList.classList.add("open")
      header[0].classList.add("open")
    }
  })
}

/* CREATE GIFO */

const video = document.querySelector('#createGifos')
const buttonCreateGifo = document.querySelector('#buttonCreateGifo')
const titleCreateGifo = document.querySelector('.titulo')
const textCreateGifo = document.querySelector('#textCreateGifo')
const buttonRecordGifo = document.querySelector('#buttonRecordGifo')
const buttonStopGifo = document.querySelector('#buttonStopGifo')
const timerGifo = document.querySelector('#timerGifo')
const repeatGifo = document.querySelector('#repeatGifo')
const buttonUpload = document.querySelector('#buttonUpload')
const gifoRecord = document.querySelector('#gifoRecord')
let recorder
let form = new FormData();
let blobUpload

const createGifo = () => {
  buttonCreateGifo.addEventListener('click', () => {
    getStreamAndRecord()
    startCreateGifo()
    stopCreateGifo()
    uploadGifo()
  })
}

const getStreamAndRecord = () => {
  titleCreateGifo.innerHTML = "¿Nos das acceso <br> a tu cámara?"
  textCreateGifo.innerHTML = "El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO."
  document.querySelector('#step1').classList.add('active')
  document.querySelector('#buttonCreateGifo').classList.add('dn')
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      height: { max: 300 }
    }
  })
    .then(function (stream) {
      video.srcObject = stream;
      video.play()
      buttonRecordGifo.classList.remove('dn')
      document.querySelector('#step1').classList.remove('active')
      document.querySelector('#step2').classList.add('active')

      recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 400,
        height: 300,
        hidden: 240,
        onGifRecordingStarted: function () {
          console.log('started')
        },
      });
    })
    .catch(function (err) {
      console.log(err)
    })
}

const startCreateGifo = () => {
  buttonRecordGifo.addEventListener('click', () => {
    buttonRecordGifo.classList.add('dn')
    buttonStopGifo.classList.remove('dn')
    timerFunction()
    recorder.startRecording();
  })
}

const repeatCaptureGifo = () => {
  buttonUpload.classList.remove('dn')
  repeatGifo.classList.add('dn')
  video.classList.remove('dn');
  gifoRecord.classList.add('dn')
  timerGifo.classList.remove('dn')
  buttonUpload.classList.add('dn')
  buttonRecordGifo.classList.remove('dn')
  getStreamAndRecord()
}

const stopCreateGifo = () => {
  buttonStopGifo.addEventListener('click', () => {
    recorder.stopRecording(() => {
      video.classList.add('dn');
      gifoRecord.classList.remove('dn');
      blobUpload = recorder.getBlob();
      gifoRecord.src = URL.createObjectURL(blobUpload);
      form.append('file', recorder.getBlob(), 'myGif.gif');
      console.log(form.get('file'))
    });
    clearInterval(timer);
    hours = '00';
    minutes = '00';
    seconds = '00';
    timerGifo.innerText = `${hours}:${minutes}:${seconds}`;
    timerGifo.classList.add('dn')
    repeatGifo.classList.remove('dn')
    repeatGifo.addEventListener('click', () => {
      repeatCaptureGifo()
    })
    buttonStopGifo.classList.add('dn')
    buttonUpload.classList.remove('dn')
  })
}

let timer
let hours = '00';
let minutes = '00';
let seconds = '00';

const timerFunction = () => {
  timerGifo.classList.remove('dn')
  timer = setInterval(timeRecord, 1000);
}

const timeRecord = () => {
  seconds++;
  if (seconds < 10) seconds = `0` + seconds;
  if (seconds > 59) {
    seconds = `00`;
    minutes++;
    if (minutes < 10) minutes = `0` + minutes;
  }
  if (minutes > 59) {
    minutes = `00`;
    hours++;
    if (hours < 10) hours = `0` + hours;
  }
  timerGifo.innerHTML = `${hours}:${minutes}:${seconds}`;
}

const uploadGifo = () => {
  buttonUpload.addEventListener('click', () => {
    document.querySelector('#step2').classList.remove('active')
    document.querySelector('#step3').classList.add('active')
    repeatGifo.classList.add('dn')
    document.querySelector('#bgGifo').classList.remove('dn')
    document.querySelector('#upload').classList.remove('dn')
    document.querySelector('#loader').classList.remove('dn')
    document.querySelector('#uploading').classList.remove('dn')
    buttonUpload.classList.add('dn')
    uploadFile()
  })
}

const uploadFile = () => {
  fetch(`${uploadUrl}gifs?api_key=${apiKey}`, {
    method: 'POST',
    body: form,
  })
    .then(resp => resp.json())
    .then(gifos => {
      const myGif = JSON.parse(localStorage.getItem('misGifos')) || [];
      myGif.push(gifos);
      localStorage.setItem('misGifos', JSON.stringify(myGif));
      document.querySelector('#loader').classList.add('ok')
      document.querySelector('#uploading').innerHTML = "GIFO subido con éxito"
      const gifoShare = gifos.data.id;
      document.querySelector('.download').classList.remove('dn')
      document.querySelector('.share').classList.remove('dn')
      document.querySelector('.share').addEventListener('click', () => {
        window.open(`https://media.giphy.com/media/${gifoShare}/giphy.gif?_blank`);
      });
      document.querySelector('.download').classList.remove('none');
      document.querySelector('.download').addEventListener('click', () => {
        downloadGifo(gifoShare);
      });
    }).catch(e => console.log(e));
};

const downloadGifo = (gifoIdDownload) => {
  const urlMyGif = `${giphyUrl}gifs/${gifoIdDownload}?api_key=${apiKey}`;
  console.log(urlMyGif)
  let result = getApi(urlMyGif);
  result.then((resp) => {
    download(resp.data.images.original.url);
  }).catch((e) => {
    alert("Error: " + e);
  });
};

/* MIS GIFOS */

const getId = () => {
  const myGif = JSON.parse(localStorage.getItem('misGifos')) || [];
  myGif.map(id => {
    getGifoId(id.data.id)
  });
}

const getGifoId = (gifoId) => {
  const urlMyGifLocal = `${giphyUrl}gifs/${gifoId}?api_key=${apiKey}`;
  let result = getApi(urlMyGifLocal);
  result.then((resp) => {
    domMyGifos(resp.data)
  }).catch((e) => {
    console.log("Error: " + e);
  });
};

const myGifosContainer = document.querySelector('#myGifosContainer');

const domMyGifos = (data) => {
  if (document.querySelector('#misGifosPage')) {
    const gifosLs = JSON.parse(localStorage.getItem('misGifos')) || [];
    if (gifosLs.length !== 0) {
      emptyContainer.classList.add('dn');
      const gifoCardsLike = document.createElement('div');
      gifoCardsLike.classList.add('gifoCardsLike');
      gifoCardsLike.setAttribute('id', `id${data.id}`)
      createCard(data.id, data.images.original.url, data.title, data.username, gifoCardsLike)
      myGifosContainer.appendChild(gifoCardsLike)
    } else {
      emptyContainer.classList.remove('dn');
      myGifosContainer.innerHTML = '';
    }
  }
}

const removeGifo = gifoId => {
  deleteGifo(gifoId);
  myGifosContainer.removeChild(document.querySelector(`#id${gifoId}`));
  if (myGifosContainer.innerHTML === '') {
    emptyContainer.classList.remove('dn');
  } else {
    emptyContainer.classList.add('dn');
  }
}

const deleteGifo = gifo => {
  const myGifo = JSON.parse(localStorage.getItem('misGifos')) || [];
  let index;
  myGifo.map((gifDelete, i) => {
    if (gifDelete.id === gifo) {
      index = i;
    }
  });
  myGifo.splice(index, 1);
  localStorage.setItem('misGifos', JSON.stringify(myGifo));
}

/* MOBILE */

const isMobile = gifoId => {
  const gifo = document.querySelector(`#id${gifoId}`)
  if (screen.width < 1024) {
    gifo.addEventListener('click', () => {
      console.log('Click en el gifo', gifoId)
    })
  }
}

/* FUNCTIONS */

if (document.querySelector('#home')) {
  getTrendingSearches()
  searchSuggestions()
  if (document.querySelector('#gifosResult')) {
    showMoreAction()
  }
}

if (document.querySelector('#likesPage')) {
  domLikes();
}

if (document.querySelector('#misGifosPage')) {
  getId();
}

if (!document.querySelector('#createGifosPage')) {
  trendingSlider()
} else {
  createGifo()
}

menuMobile()
