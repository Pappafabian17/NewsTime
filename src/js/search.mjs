import NewsData from "./NewsData.mjs";
import { renderListWithTemplate } from "./utils.mjs";

export default class Search {
  constructor() {
    this.newsData = new NewsData();
    this.searchForm = null;
    this.searchInput = null;
    this.newsContainer = null;
  }

  init() {
    setTimeout(() => {
      this.searchForm = document.querySelector('.search-bar');
      this.searchInput = document.querySelector('.search-bar input[name="q"]');
      this.newsContainer = document.querySelector('.news-list');
      
      if (this.searchForm && this.searchInput) {
        this.setupEventListeners();
      }
    }, 100);
  }

  setupEventListeners() {
    this.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch();
    });

    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 3) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performSearch(query);
        }, 500);
      }
    });
  }

  async performSearch(customQuery = null) {
    const query = customQuery || this.searchInput.value.trim();
    
    if (!query || query.length < 2) {
      this.showMessage('Por favor ingresa al menos 2 caracteres para buscar');
      return;
    }

    try {
      this.showLoading();
      const data = await this.newsData.getNews(query);
      searchResults = data.results
      if (searchResults && searchResults.length > 0) {
        this.displaySearchResults(searchResults, query);
      } else {
        this.showMessage(`No se encontraron resultados para "${query}"`);
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      this.showMessage('Error al realizar la búsqueda. Por favor intenta nuevamente.');
    }
  }

  displaySearchResults(articles, query) {
    if (!this.newsContainer) return;

    this.newsContainer.innerHTML = '';

    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'search-results-header';
    resultsHeader.innerHTML = `
      <h2>Resultados de búsqueda para: "${query}"</h2>
      <p>Se encontraron ${articles.length} artículos</p>
    `;
    this.newsContainer.appendChild(resultsHeader);

    renderListWithTemplate(
      this.newsCardTemplate,
      this.newsContainer,
      articles,
      'beforeend',
      false
    );
  }

  newsCardTemplate(article) {
    const imageUrl = article.urlToImage || 'images/default-image.webp';
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <section class="news-card">
        <a class="news-a" href="news/index.html?article_id=${encodeURIComponent(article.url)}">
          <img
            class="news-image"
            src="${imageUrl}"
            alt="${article.title}"
            onerror="this.src='images/default-image.webp'"
          />
          <div class="news-text">
            <h2 class="news-title">${article.title}</h2>
            <p class="news-description">${article.description || 'Sin descripción disponible'}</p>
            <div class="news-meta">
              <span class="news-source">${article.source?.name || 'Fuente desconocida'}</span>
              <span class="news-date">${publishedDate}</span>
            </div>
          </div>
        </a>
      </section>
    `;
  }

  showLoading() {
    if (!this.newsContainer) return;
    
    this.newsContainer.innerHTML = `
      <div class="loading-container" style="text-align: center; padding: 2rem;">
        <div class="spinner"></div>
        <p>Buscando noticias...</p>
      </div>
    `;
  }

  showMessage(message) {
    if (!this.newsContainer) return;
    
    this.newsContainer.innerHTML = `
      <div class="search-message" style="text-align: center; padding: 2rem;">
        <p>${message}</p>
      </div>
    `;
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
  }
}