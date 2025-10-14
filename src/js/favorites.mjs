import { loadHeaderFooter, getFavorites, removeFromFavorites } from "./utils.mjs";

class Favorites {
  constructor() {
    this.favoritesContainer = null;
  }

  async init() {
    await loadHeaderFooter();
    this.favoritesContainer = document.getElementById('favorites-list');
    this.loadFavorites();
  }

  loadFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
      this.showEmptyMessage();
      return;
    }

    this.renderFavorites(favorites);
  }

  showEmptyMessage() {
    this.favoritesContainer.innerHTML = `
      <div class="empty-favorites">
        <p>You haven't added any favorites yet.</p>
        <p>Start browsing news and click the heart icon to save your favorite articles!</p>
        <a href="index.html" class="back-to-news">Browse News</a>
      </div>
    `;
  }

  renderFavorites(favorites) {
    const favoritesHtml = favorites.map(article => this.favoriteCardTemplate(article)).join('');
    this.favoritesContainer.innerHTML = favoritesHtml;
    this.setupRemoveButtons();
  }

  favoriteCardTemplate(article) {
    const imageUrl = article.image_url || 'images/default-image.webp';
    
    return `
      <div class="favorite-card" data-article-id="${article.article_id}">
        <a href="news/?article_id=${article.article_id}" class="favorite-link">
          <img src="${imageUrl}" alt="${article.title}" class="favorite-image" onerror="this.src='images/default-image.webp'">
          <div class="favorite-content">
            <h3 class="favorite-title">${article.title}</h3>
            <p class="favorite-source">${article.source_name || 'Unknown source'}</p>
          </div>
        </a>
        <button class="remove-favorite-btn" data-article-id="${article.article_id}">
          <img src="images/icons/cross.svg" alt="Remove from favorites">
        </button>
      </div>
    `;
  }

  setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-favorite-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = button.getAttribute('data-article-id');
        this.removeFavorite(articleId);
      });
    });
  }

  removeFavorite(articleId) {
    removeFromFavorites(articleId);
    const favoriteCard = document.querySelector(`[data-article-id="${articleId}"]`);
    if (favoriteCard) {
      favoriteCard.remove();
    }
    
    const remainingFavorites = getFavorites();
    if (remainingFavorites.length === 0) {
      this.showEmptyMessage();
    }
  }
}

const favoritesPage = new Favorites();
favoritesPage.init();