import NewsData from "./NewsData.mjs";
import NewsList from "./newsList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const countryMap = {
    "Argentina": "ar",
    "United States": "us",
    "Uruguay": "uy",
    "World": "wo"
}


async function initPage() {
  await loadHeaderFooter();
  const newsData = new NewsData();
  const newsListElement = document.querySelector(".news-list");
  const myList = new NewsList("Argentina", newsData, newsListElement);
  myList.init();
}

initPage();
