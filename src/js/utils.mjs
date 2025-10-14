const news_api_key = import.meta.env.VITE_NEWS_API_KEY;
const weather_api_key = import.meta.env.VITE_WEATHER_API;
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);

  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const isDev = import.meta.env.DEV;
  const basePath = isDev ? "" : "";
  
  const headerTemplate = await loadTemplate(`${basePath}partials/header.html`);
  const footerTemplate = await loadTemplate(`${basePath}partials/footer.html`);

  const headerElement = document.querySelector("#header");
  const footerElement = document.querySelector("#footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export async function fetchingFunction(aplication = null, url, q, id = null) {
  let response;
  try{
    if(aplication ==="news"){
      if(!id){
        response = await fetch(`${url}?apikey=${news_api_key}&q=${q}`);
      }else{
        response = await fetch(`${url}?apikey=${news_api_key}&id=${id}`);
      }
    }else{
      response = await fetch(`${url}?key=${weather_api_key}&q=${q}&aqi=no`);
    }

    const data = await convertToJson(response);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getLocation(){
  return new Promise((resolve, reject)=>{
    if(!("geolocation" in navigator)){
      return reject(new Error("Geolocation is not supported"))
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      const {latitude, longitude} = position.coords;
      resolve({lat: latitude, lon: longitude})
    }, (error)=>{
      reject(error)
    })
  })
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

export function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

export function addToFavorites(article) {
  const favorites = getFromLocalStorage('favorites', []);
  const isAlreadyFavorite = favorites.some(fav => fav.article_id === article.article_id);
  
  if (!isAlreadyFavorite) {
    favorites.push(article);
    saveToLocalStorage('favorites', favorites);
    return true;
  }
  return false;
}

export function removeFromFavorites(articleId) {
  const favorites = getFromLocalStorage('favorites', []);
  const updatedFavorites = favorites.filter(fav => fav.article_id !== articleId);
  saveToLocalStorage('favorites', updatedFavorites);
  return updatedFavorites.length !== favorites.length;
}

export function getFavorites() {
  return getFromLocalStorage('favorites', []);
}

export function isFavorite(articleId) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.article_id === articleId);
}
