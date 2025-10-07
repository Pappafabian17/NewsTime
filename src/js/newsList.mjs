import { renderListWithTemplate } from "./utils.mjs";

function truncateText(text, maxLength = 120){
  if(!text) return '';
  if(text.length <= maxLength) return text;
  return text.substring(0,maxLength) + "...";

}

function newsCardTemplate(newNotice) {
  const truncatedTitle = truncateText(newNotice.title, 80);
  const truncatedDescription = truncateText(newNotice.description, 120);

  const imageLink = newNotice.image_url ? newNotice.image_url : 'src/public/images/default-image.webp';
  return `
    <section class="news-card">
        <a class="news-a" href="news/?article_id=${newNotice.article_id}">
          <img
            class="news-image"
            src="${imageLink}"
            alt="${newNotice.source_name}"
          />
          <div class="news-text">
            <h2 class="news-title">
              ${truncatedTitle}
            </h2>
            <p class="news-description">
              ${truncatedDescription ? truncatedDescription : 'No description available  for more information click on the article'}
            </p>
            <div class="nexs-category-container">
            ${newNotice.category.map((item)=> `<span class="news-category">${item}</span>`).join('')}
            </div>
          </div>
        </a>
      </section>
  `;
}

function loadingTemplate() {
  return `
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  `;
}

function errorTemplate(error) {
  return `
    <div class="error-container">
      <p>Error trying to load : ${error}</p>
    </div>
  `;
}

export default class NewsList {
  constructor(query, data, listElement) {
    this.query = query;
    this.data = data;
    this.listElement = listElement;
  }
  async init() {
    try {
      this.listElement.innerHTML = loadingTemplate();
      
      const allData = await this.data.getNews(this.query);
      let list = allData.results;
      
      
      if (list && list.length > 0) {
        this.renderList(list);
      } else {
        this.listElement.innerHTML = '<p>Notices not found for this country .</p>';
      }
    } catch (error) {
      console.error("Error trying to load notices:", error);
      this.listElement.innerHTML = errorTemplate(error.message);
    }
  }
  renderList(list) {
    renderListWithTemplate(newsCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
