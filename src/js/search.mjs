import NewsData from "./NewsData.mjs";
import { renderListWithTemplate, addToFavorites, removeFromFavorites, isFavorite } from "./utils.mjs";

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
      this.showMessage('Please enter at least 2 characters to search');
      return;
    }

    try {
      this.showLoading();
      
      const data = await this.newsData.getNews(query);
      
      if (data.status === 'success' && data.results && data.results.length > 0) {
        this.displaySearchResults(data.results, query);
      } else {
        this.showMessage('No news found for your search');
      }
    } catch (error) {
      console.error('Error searching news:', error);
      this.showMessage('Error searching news. Please try again.');
    }
  }

  displaySearchResults(articles, query) {
    if (!this.newsContainer) return;
    
    this.newsContainer.innerHTML = `
      <div class="search-results-header">
        <h2>Search Results for "${query}"</h2>
        <p>Found ${articles.length} articles</p>
      </div>
    `;

    renderListWithTemplate(
      this.newsCardTemplate.bind(this),
      this.newsContainer,
      articles,
      'beforeend',
      false
    );
    
    this.setupFavoriteButtons();
  }

  newsCardTemplate(article) {
    const imageUrl = article.image_url || 'images/default-image.webp';
    const publishedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const favoriteIcon = isFavorite(article.article_id) ? 'images/icons/favourite-filled.svg' : 'images/icons/favourite-empty.svg';

    return `
      <section class="news-card">
        <a class="news-a" href="news/index.html?article_id=${encodeURIComponent(article.article_id)}">
          <img
            class="news-image"
            src="${imageUrl}"
            alt="${article.title}"
            onerror="this.src='images/default-image.webp'"
          />
          <div class="news-text">
            <h2 class="news-title">${article.title}</h2>
            <p class="news-description">${article.description || 'No description available'}</p>
            <div class="news-meta">
              <span class="news-source">${article.source_name || 'Unknown source'}</span>
              <span class="news-date">${publishedDate}</span>
            </div>
          </div>
        </a>
        <button class="favorite-btn" onclick="toggleFavorite('${article.article_id}', this)" data-article='${JSON.stringify(article).replace(/'/g, "&apos;")}'>
          <img src="${favoriteIcon}" alt="Add to favorites" />
        </button>
      </section>
    `;
  }

  showLoading() {
    if (!this.newsContainer) return;
    
    this.newsContainer.innerHTML = `
      <div class="loading-container" style="text-align: center; padding: 2rem;">
        <div class="spinner"></div>
        <p>Searching news...</p>
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
    if (this.newsContainer) {
      this.newsContainer.innerHTML = '';
    }
  }
  
  setupFavoriteButtons() {
    window.toggleFavorite = (articleId, buttonElement) => {
      const articleData = JSON.parse(buttonElement.getAttribute('data-article').replace(/&apos;/g, "'"));
      const img = buttonElement.querySelector('img');
      
      if (isFavorite(articleId)) {
        removeFromFavorites(articleId);
        img.src = 'images/icons/favourite-empty.svg';
      } else {
        addToFavorites(articleData);
        img.src = 'images/icons/favourite-filled.svg';
      }
    };
  }
}