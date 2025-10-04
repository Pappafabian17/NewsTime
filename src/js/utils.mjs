const news_api_key = import.meta.env.VITE_NEWS_API_KEY;

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
  const headerTemplate = await loadTemplate("src/public/partials/header.html");
  const footerTemplate = await loadTemplate("src/public/partials/footer.html");

  const headerElement = document.querySelector("#header");
  const footerElement = document.querySelector("#footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export async function fetchingFunction(url, q, id = null) {
  let response;
  try{
    if(!id){
      response = await fetch(`${url}?apikey=${news_api_key}&q=${q}`);
  }else{
      response = await fetch(`${url}?apikey=${news_api_key}&id=${id}`);
  }

    const data = await convertToJson(response);
    // console.log("data dentro de utils", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
