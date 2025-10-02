import { renderListWithTemplate } from "./utils.mjs";

function newsCardTemplate(newNotice) {
  return `
  
  `;
}

export default class NewsList {
  constructor(query, data, listElement) {
    this.query = query;
    this.data = data;
    this.listElement = listElement;
  }
  async init() {
    const list = await this.data.getnews(this.query);
    console.log("list", list);
    this.renderList(list);
  }
  renderList(list) {
    renderListWithTemplate(newsCardTemplate, this.listElement, list);
  }
}
