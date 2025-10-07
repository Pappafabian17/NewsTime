import { fetchingFunction } from "./utils.mjs";

const baseUrl = import.meta.env.VITE_NEWS_URL;

export default class NewsData {
  constructor() {}
  async getNews(query) {
    const response = await fetchingFunction("news",baseUrl, query);
    return response;
  }
  async getNewsById(id){
    const response = await fetchingFunction("news",baseUrl,null, id);
    return response;
  }
}
