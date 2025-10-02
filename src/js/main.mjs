import NewsData from "./NewsData.mjs";
import { loadHeaderFooter, fetchingFunction } from "./utils.mjs";

async function initPage() {
  await loadHeaderFooter();
  const newsData = new NewsData();
  const data = await newsData.getNews("Argentina");
  console.log("data", data);
}

initPage();
