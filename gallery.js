const DAY_IMAGES = [
  'img/photojours/20251031_163052.webp',
  'img/photojours/20251031_163459.webp',
  'img/photojours/20251031_163738(0).webp',
  'img/photojours/20251031_165036.webp',
  'img/photojours/20251031_165325.webp',
  'img/photojours/20251031_165438.webp',
  'img/photojours/IMG_8116.webp',
  'img/photojours/IMG_8117.jpeg'
];

const NIGHT_IMAGES = [
  'img/photonuit/169DBAA2-E100-4D23-91EE-991EB90BE0E5_1_105_c.webp',
  'img/photonuit/1AB32A95-DFA8-4B0B-B2BF-E5D9B9402B23_1_105_c.webp',
  'img/photonuit/1EA9D4B7-B150-4030-81EF-613FA0015EA2_1_105_c.webp',
  'img/photonuit/2AF33758-D792-49A5-BEE5-DC67E377A12B_1_105_c.webp',
  'img/photonuit/2D130D95-B8C2-42D5-9EE4-C18C297FB083_1_105_c.webp',
  'img/photonuit/4CB53772-856E-4487-A3FB-074F11CC4903_1_105_c.webp',
  'img/photonuit/50B30557-0B5E-4352-B26F-4D4D6FC5CDBC_1_105_c.webp',
  'img/photonuit/54D260A5-36A0-44C5-A414-437D51B5A7D1_1_105_c.webp',
  'img/photonuit/5B3340BF-69AE-43C1-A0F3-FC6C3C43D8E1_1_105_c.webp',
  'img/photonuit/6620355E-8D35-4C1E-965C-B9D5D5E10D49_1_105_c.webp',
  'img/photonuit/72A8E73F-EA66-485B-BC32-5B90EAB632C7_1_105_c.webp',
  'img/photonuit/965D1BEC-D265-4888-88EB-FBD636B89195_1_105_c.webp',
  'img/photonuit/AA61889A-E1FC-4B78-9925-7104B133DA5A_1_105_c.webp',
  'img/photonuit/B21E81F6-445B-4CBE-8FCA-89133C33FBD2_1_105_c.webp',
  'img/photonuit/B25B0532-CC3E-470D-8756-4902EF578C99_1_105_c.webp',
  'img/photonuit/B4BA88B5-CF2D-4A5C-9540-D933537B6670_1_105_c.webp',
  'img/photonuit/C8C1E233-E5B7-4AC0-A1ED-B2037C733985_1_105_c.webp',
  'img/photonuit/D3207E6B-1256-46F9-BD6C-286E79BBF0C8_1_105_c.webp',
  'img/photonuit/D884CA4B-D85B-41FB-9CAE-0AA832808AB8_1_105_c.webp',
  'img/photonuit/DBB3E2E2-B17D-494B-A844-EACC5AF8C2DA_1_105_c.webp',
  'img/photonuit/DD49D98E-7630-4B5D-8174-98CC90C4C031_1_105_c.webp',
  'img/photonuit/E37FEBF2-6E3F-4A9C-B414-1B615917666B_1_105_c.webp',
  'img/photonuit/E8FA4D7A-2C75-4405-9211-6C0B2833F66D_1_105_c.webp',
  'img/photonuit/EFD2AA38-9EA9-481E-BBDC-FEED35D572C3_1_105_c.webp',
  'img/photonuit/F7D72006-230E-4E3B-8485-D8369153436D_1_105_c.webp',
  'img/photonuit/FF21117B-63C8-42BB-A8A3-EAD5F2E4E3F8.webp'
];

const GALLERY_DATA = [
  { id: 'all', label: 'Toutes', items: [...DAY_IMAGES.map(src=>({src, group: 'day'})), ...NIGHT_IMAGES.map(src=>({src, group: 'night'}))] },
  { id: 'day', label: 'Jour', items: DAY_IMAGES.map(src=>({src, group: 'day'})) },
  { id: 'night', label: 'Nuit', items: NIGHT_IMAGES.map(src=>({src, group: 'night'})) }
];

function el(q){return document.querySelector(q)}
function all(q){return Array.from(document.querySelectorAll(q))}

function prettify(path){
  const name = path.split('/').pop().replace(/\.[^/.]+$/, '');
  return name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function createFigure(group, src){
  const figure = document.createElement('figure');
  figure.className = 'card card-figure';
  figure.dataset.category = group;
  const img = document.createElement('img');
  img.src = src;
  img.alt = `${group} ${prettify(src)}`;
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
  desc.textContent = prettify(src);
  meta.appendChild(title);
  meta.appendChild(desc);
  figure.appendChild(img);
  figure.appendChild(badge);
  figure.appendChild(meta);
  figure.addEventListener('click', ()=> openModal(src, `${title.textContent} — ${desc.textContent}`));
  return figure;
}

function buildGallery(){
  const container = el('#gallery');
  const empty = el('#gallery-empty');
  container.innerHTML = '';
  let total = 0;
  GALLERY_DATA.find(x=>x.id==='all').items.forEach(item=>{
    total++;
    container.appendChild(createFigure(item.group, item.src));
  });
  empty.style.display = total === 0 ? 'block' : 'none';
}

function openModal(src, caption){
  const modal = el('#image-modal');
  el('#modal-image').src = src;
  el('#modal-caption').textContent = caption || '';
  modal.classList.remove('hidden');
}

function closeModal(){
  const modal = el('#image-modal');
  el('#modal-image').src = '';
  modal.classList.add('hidden');
}

const buttonMap = new Map();

function initFilters(){
  const configs = [
    { el: el('#filter-all'), cat: 'all' },
    { el: el('#filter-day'), cat: 'day' },
    { el: el('#filter-night'), cat: 'night' }
  ];
  configs.forEach(({ el, cat })=>{
    if(!el) return;
    buttonMap.set(cat, el);
    el.addEventListener('click', ()=>{
      filter(cat);
      if(cat === 'all') history.replaceState(null, '', location.pathname + location.search);
      else location.hash = `#${cat}`;
    });
  });
  const modal = el('#image-modal');
  modal.addEventListener('click', e=>{
    if(e.target.classList.contains('image-modal-overlay') || e.target.classList.contains('image-modal-close')) closeModal();
  });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') closeModal();
  });
}

function setActiveButton(cat){
  buttonMap.forEach((btn, key)=>{
    const match = cat === 'all' ? key === 'all' : key === cat;
    btn.classList.toggle('active', match);
  });
}

function filter(cat){
  const items = all('#gallery .card');
  items.forEach(item=>{
    item.style.display = cat === 'all' || item.dataset.category === cat ? 'block' : 'none';
  });
  setActiveButton(cat);
}

document.addEventListener('DOMContentLoaded', ()=>{
  initFilters();
  buildGallery();
  const hash = location.hash.replace('#', '');
  if(hash === 'day' || hash === 'night') filter(hash);
  else filter('all');
});
