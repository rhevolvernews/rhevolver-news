const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');
const filterButtons = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');
const emptyState = document.getElementById('emptyState');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

searchToggle?.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) searchInput.focus();
});

searchClose?.addEventListener('click', () => {
  searchPanel.classList.remove('open');
  searchInput.value = '';
  applyFilters();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    applyFilters();
  });
});

searchInput?.addEventListener('input', applyFilters);

function applyFilters() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const term = (searchInput?.value || '').trim().toLowerCase();
  let visible = 0;

  newsCards.forEach(card => {
    const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
    const text = `${card.dataset.search || ''} ${card.innerText}`.toLowerCase();
    const searchMatch = !term || text.includes(term);
    const show = categoryMatch && searchMatch;
    card.classList.toggle('hidden', !show);
    if (show) visible += 1;
  });

  emptyState.style.display = visible ? 'none' : 'block';
}

document.querySelectorAll('[data-share-title]').forEach(button => {
  button.addEventListener('click', async () => {
    const title = button.dataset.shareTitle || document.title;
    const url = button.dataset.shareUrl || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        button.textContent = 'Enlace copiado';
        setTimeout(() => button.textContent = 'Compartir', 1600);
      }
    } catch (error) {
      console.log('Compartir cancelado', error);
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
