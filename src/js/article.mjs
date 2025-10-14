import NewsData from "./NewsData.mjs";

class ArticlePage {
  constructor() {
    this.newsData = new NewsData();
    this.articleContainer = document.querySelector("#article-content");
  }

  async init() {
    await this.loadHeaderFooter();
    
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article_id');
    
    if (!articleId) {
      this.showError("No article ID provided");
      return;
    }
    
    await this.loadArticle(articleId);
  }

  async loadHeaderFooter() {
    let headerTemplate = await this.loadTemplate(`../partials/header.html`);
    let footerTemplate = await this.loadTemplate(`../partials/footer.html`);

    headerTemplate = headerTemplate.replace(/src="images\//g, 'src="../images/');
    footerTemplate = footerTemplate.replace(/src="images\//g, 'src="../images/');

    const headerElement = document.querySelector("#header");
    const footerElement = document.querySelector("#footer");

    if (headerElement) {
      headerElement.innerHTML = headerTemplate;
    }
    if (footerElement) {
      footerElement.innerHTML = footerTemplate;
    }

    this.initializeHeaderFunctionality();
  }

  initializeHeaderFunctionality() {
    const hamburgerButton = document.querySelector('.ham-button');
    const navMenu = document.querySelector('header ul');

    if (hamburgerButton && navMenu) {
      hamburgerButton.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburgerButton.classList.toggle('active');
      });

      document.addEventListener('click', (event) => {
        if (!hamburgerButton.contains(event.target) && !navMenu.contains(event.target)) {
          navMenu.classList.remove('show');
          hamburgerButton.classList.remove('active');
        }
      });
    }

    this.initializeWeather();
  }

  async initializeWeather() {
    try {
      const { default: WeatherData } = await import('./weather.mjs');
      const weatherData = new WeatherData();
      const weatherInfo = await weatherData.getWeatherData();
      
      const weatherMenu = document.querySelector('#weather-menu');
      if (weatherMenu && weatherInfo) {
        weatherMenu.innerHTML = `
          <div class="weather-info">
            <img src="../images/icons/weather.svg" alt="weather" />
            <span>${weatherInfo.temperature}°C</span>
            <span>${weatherInfo.location}</span>
          </div>
        `;
      }
    } catch (error) {
      console.log('Weather data not available:', error);
    }
  }

  async loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
  }

  async loadArticle(articleId) {
    try {
      this.showLoading();
      
      const articleData = await this.newsData.getNewsById(articleId);
      
      if (!articleData || !articleData.results || articleData.results.length === 0) {
        this.showError("Article not found");
        return;
      }
      
      const article = articleData.results[0];
      this.renderArticle(article);
      
    } catch (error) {
      console.error("Error loading article:", error);
      this.showError("Failed to load article. Please try again later.");
    }
  }

  renderArticle(article) {
    const template = this.createArticleTemplate(article);
    this.articleContainer.innerHTML = template;
    
    document.title = `${article.title} | NewsTime`;
  }

  createArticleTemplate(article) {
    const imageUrl = article.image_url || '../src/public/images/default-image.webp';
    const publishDate = article.pubDate ? new Date(article.pubDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Date not available';
    
    const categories = article.category && article.category.length > 0 
      ? article.category.map(cat => `<span class="article-category">${cat}</span>`).join('')
      : '';

    return `
      <div class="article-header">
        <img class="article-image" src="${imageUrl}" alt="${article.title}" />
        <div class="article-meta">
          <h1 class="article-title">${article.title}</h1>
          <div class="article-info">
            <span class="article-source">${article.source_name || 'Unknown Source'}</span>
            <span class="article-date">${publishDate}</span>
          </div>
        </div>
      </div>
      
      <div class="article-content">
        ${article.description ? `<p class="article-description">${article.description}</p>` : ''}
        
        ${article.content ? `<div class="article-body">${this.formatContent(article.content)}</div>` : ''}
        
        ${categories ? `<div class="article-categories">${categories}</div>` : ''}
        
        ${article.link ? `<a href="${article.link}" target="_blank" rel="noopener noreferrer" class="article-link">Read full article on ${article.source_name || 'source'}</a>` : ''}
      </div>
    `;
  }

  formatContent(content) {
    if (!content) return '';
    
    return content
      .split('\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  }

  showLoading() {
    this.articleContainer.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading article...</p>
      </div>
    `;
  }

  showError(message) {
    this.articleContainer.innerHTML = `
      <div class="error-message">
        <h2>Error</h2>
        <p>${message}</p>
        <a href="../index.html" class="article-link">← Back to News</a>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const articlePage = new ArticlePage();
  articlePage.init();
});