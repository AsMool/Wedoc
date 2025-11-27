

const GALLERY_DATA = [
  { id: 'all', label: 'Toutes', items: [...DAY_IMAGES.map(img => ({ ...img, group: 'day' })), ...NIGHT_IMAGES.map(img => ({ ...img, group: 'night' }))] },
  { id: 'day', label: 'Jour', items: DAY_IMAGES.map(img => ({ ...img, group: 'day' })) },
  { id: 'night', label: 'Nuit', items: NIGHT_IMAGES.map(img => ({ ...img, group: 'night' })) }
];

function el(q) { return document.querySelector(q) }
function all(q) { return Array.from(document.querySelectorAll(q)) }

function prettify(path) {
  const name = path.split('/').pop().replace(/\.[^/.]+$/, '');
  return name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function createFigure(item) {
  const { group, src, description } = item;
  const figure = document.createElement('figure');
  figure.className = 'card card-figure';
  figure.dataset.category = group;
  const img = document.createElement('img');
  img.src = src;
  img.alt = description || `${group} ${prettify(src)}`;
  img.loading = 'lazy';
  const badge = document.createElement('div');
  badge.className = 'caption';
  badge.textContent = group === 'day' ? 'Jour' : 'Nuit';
  const meta = document.createElement('div');
  meta.className = 'ig-meta';
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = group === 'day' ? 'Jour' : 'Nuit';
  const desc = document.createElement('div');
  desc.className = 'desc';
  desc.textContent = description || prettify(src);
  meta.appendChild(title);
  meta.appendChild(desc);

  figure.appendChild(img);
  figure.appendChild(badge);
  figure.appendChild(meta);
  figure.addEventListener('click', () => openModal(src, `${title.textContent} — ${desc.textContent}`));
  return figure;
}

function buildGallery() {
  const container = el('#gallery');
  const empty = el('#gallery-empty');
  container.innerHTML = '';
  let total = 0;
  GALLERY_DATA.find(x => x.id === 'all').items.forEach(item => {
    total++;
    container.appendChild(createFigure(item));
  });
  empty.style.display = total === 0 ? 'block' : 'none';
}

function openModal(src, caption) {
  const modal = el('#image-modal');
  el('#modal-image').src = src;
  el('#modal-caption').textContent = caption || '';
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = el('#image-modal');
  el('#modal-image').src = '';
  modal.classList.add('hidden');
}

const buttonMap = new Map();

function initFilters() {
  const configs = [
    { el: el('#filter-all'), cat: 'all' },
    { el: el('#filter-day'), cat: 'day' },
    { el: el('#filter-night'), cat: 'night' }
  ];
  configs.forEach(({ el, cat }) => {
    if (!el) return;
    buttonMap.set(cat, el);
    el.addEventListener('click', () => {
      filter(cat);
      if (cat === 'all') history.replaceState(null, '', location.pathname + location.search);
      else location.hash = `#${cat}`;
    });
  });
  const modal = el('#image-modal');
  modal.addEventListener('click', e => {
    if (e.target.classList.contains('image-modal-overlay') || e.target.classList.contains('image-modal-close')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function setActiveButton(cat) {
  buttonMap.forEach((btn, key) => {
    const match = cat === 'all' ? key === 'all' : key === cat;
    btn.classList.toggle('active', match);
  });
}

function filter(cat) {
  const items = all('#gallery .card');
  items.forEach(item => {
    item.style.display = cat === 'all' || item.dataset.category === cat ? 'block' : 'none';
  });
  setActiveButton(cat);
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  buildGallery();

  // Check URL parameter first, then hash
  const urlParams = new URLSearchParams(location.search);
  const filterParam = urlParams.get('filter');
  const hash = location.hash.replace('#', '');

  if (filterParam === 'day' || filterParam === 'night') {
    filter(filterParam);
  } else if (hash === 'day' || hash === 'night') {
    filter(hash);
  } else {
    filter('all');
  }
});
