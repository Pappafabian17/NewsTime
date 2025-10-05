import NewsData from "./NewsData.mjs";
import NewsList from "./newsList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const countryMap = {
    "Argentina": "ar",
    "United States": "us",
    "Uruguay": "uy",
    "World": "wo",
    "Spain": "es",
    "France": "fr",
    "Germany": "de",
}

let currentNewsList = null;



async function initPage() {
  await loadHeaderFooter();
  setupNavigation();

  loadNewsForCountry("Argentina");
}

function setupNavigation(){
  setTimeout(()=>{
    const navLinks = document.querySelectorAll('header ul li a');

    navLinks.forEach(link =>{
      link.addEventListener('click', (e) =>{
        e.preventDefault();
        const countryName = e.target.textContent.trim();
        loadNewsForCountry(countryName);
        updateActiveNavItem(e.target);
      })
    })
  },100)
}

async function loadNewsForCountry(countryName){
  const countryCode = countryMap[countryName];

  if(!countryCode){
    console.error(`No country code found for ${countryName}`);
    return;
  }
  const newsData = new NewsData();
  const newsListElement = document.querySelector(".news-list");
  newsListElement.innerHTML = "";

  currentNewsList = new NewsList(countryName, newsData, newsListElement);
  await currentNewsList.init();
  console.log(`Loading news for ${countryName}-${countryCode}`   )
}

function updateActiveNavItem(activeLink) {
  const navLinks = document.querySelectorAll('header ul li a');
  navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}


initPage();
