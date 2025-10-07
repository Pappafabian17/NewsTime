import NewsData from "./NewsData.mjs";
import NewsList from "./newsList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import WeatherData from "./weather.mjs";
import Search from "./search.mjs";

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
let weatherInformation = null;
let searchInstance = null;


async function initPage() {
  await loadHeaderFooter();
  setupNavigation();
  setupSearch();
  setweather();
  loadNewsForCountry("Argentina");
}

function setupNavigation(){
  setTimeout(()=>{
    const navLinks = document.querySelectorAll('header ul li a');
    const hamburgerButton = document.querySelector('.ham-button');
    const hamburguerIcon = document.querySelector('.ham-icon');
    const navMenu = document.querySelector('header ul');

    navLinks.forEach(link =>{
      link.addEventListener('click', (e) =>{
        e.preventDefault();
        const countryName = e.target.textContent.trim();
        loadNewsForCountry(countryName);
        updateActiveNavItem(e.target);
        
        if (navMenu.classList.contains('show')) {
          navMenu.classList.remove('show');
          hamburgerButton.classList.remove('active');
        }
      })
    })

    if (hamburgerButton) {
      hamburgerButton.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburgerButton.classList.toggle('active');

      });
    }

    document.addEventListener('click', (e) => {
      if (!hamburgerButton.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('show');
        hamburgerButton.classList.remove('active');
      }
    });
  },0)
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
}

function updateActiveNavItem(activeLink) {
  const navLinks = document.querySelectorAll('header ul li a');
  navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

function setupSearch() {
  searchInstance = new Search();
  searchInstance.init();
}
async function setweather(){
  const weatherData = new WeatherData();
  weatherInformation =  await weatherData.getWeather();
  const weather = weatherInformation.current;
  const location = weatherInformation.location;
  const weatherMenu = document.querySelector('#weather-menu');
  weatherMenu.innerHTML = `
    <img src="${weather.condition.icon}" alt="${weather.condition.text}">
    <p>${weather.feelslike_c}°C</p>
    <p>${location.name}</p>
  `
}

initPage();
