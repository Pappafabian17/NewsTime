import { renderListWithTemplate } from "./utils.mjs";

function newsCardTemplate(newNotice) {
  return `
    <section class="news-card">
        <a class="news-a" href="../news/?article_id=${newNotice.article_id}">
          <img
            class="news-image"
            src="${newNotice.image_url}"
            alt="${newNotice.source_name}"
          />
          <div class="news-text">
            <h2 class="news-title">
              ${newNotice.title}
            </h2>
            <p class="news-description">
              ${newNotice.description}
            </p>
          </div>
        </a>
      </section>
  `;
}

export default class NewsList {
  constructor(query, data, listElement) {
    this.query = query;
    this.data = data;
    this.listElement = listElement;
  }
  async init() {
    const allData = await this.data.getNews(this.query);
    let list = allData.results;
    console.log("listaaaaaaa", list);
    this.renderList(list);
  }
  renderList(list) {
    renderListWithTemplate(newsCardTemplate, this.listElement, list);
  }
}
