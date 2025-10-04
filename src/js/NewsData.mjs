import { fetchingFunction } from "./utils.mjs";

const baseUrl = import.meta.env.VITE_NEWS_URL;

export default class NewsData {
  constructor() {}
  async getNews(query) {
    const response = await fetchingFunction(baseUrl, query);
    // console.log("response de getNews", response);
    return response;
  }
  async getNewsById(id){
    const response = await fetchingFunction(baseUrl, id);
    console.log("response by id", response);
    return response;
  }
}
