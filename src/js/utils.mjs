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
  const basePath = isDev ? "src/public/" : "";
  
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
