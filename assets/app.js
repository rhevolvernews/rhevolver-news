const state = { news: [], category: 'Todas', query: '' };
const $ = (s) => document.querySelector(s);
const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const dateLabel = d => new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${d}T12:00:00`));

function card(n){return `<article class="news-card"><a class="card-image" href="articulo.html?id=${encodeURIComponent(n.id)}"><img src="${esc(n.imagen)}" alt="${esc(n.titulo)}"></a><div class="card-body"><span class="category">${esc(n.categoria)}</span><h3><a href="articulo.html?id=${encodeURIComponent(n.id)}">${esc(n.titulo)}</a></h3><p>${esc(n.resumen)}</p><div class="meta"><span>${dateLabel(n.fecha)}</span><span>${esc(n.autor)}</span></div></div></article>`}
function renderLead(){const n=state.news.find(x=>x.destacada)||state.news[0]; if(!n)return; $('#leadStory').innerHTML=`<img src="${esc(n.imagen)}" alt="${esc(n.titulo)}"><div class="lead-overlay"><span class="category">${esc(n.categoria)}</span><h1>${esc(n.titulo)}</h1><p>${esc(n.resumen)}</p><a href="articulo.html?id=${encodeURIComponent(n.id)}">Leer noticia</a></div>`;}
function renderTrending(){const list=state.news.filter(x=>x.tendencia).slice(0,4); $('#trendingList').innerHTML=list.map((n,i)=>`<a class="trend-item" href="articulo.html?id=${encodeURIComponent(n.id)}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(n.titulo)}</span></a>`).join('');}
function renderFilters(){const cats=['Todas',...new Set(state.news.map(n=>n.categoria))]; $('#filters').innerHTML=cats.map(c=>`<button class="filter ${c===state.category?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join(''); document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;renderFilters();renderNews();});}
function renderNews(){let list=state.news.filter(n=>!n.destacada); if(state.category!=='Todas')list=list.filter(n=>n.categoria===state.category); if(state.query)list=list.filter(n=>(n.titulo+' '+n.resumen+' '+n.categoria).toLowerCase().includes(state.query)); $('#newsGrid').innerHTML=list.length?list.map(card).join(''):'<p class="empty">No se encontraron noticias.</p>';}
function renderOpinion(){const list=state.news.filter(n=>n.categoria==='Opinión'); $('#opinionGrid').innerHTML=list.map(n=>`<article><span class="category">${esc(n.categoria)}</span><h3><a href="articulo.html?id=${encodeURIComponent(n.id)}">${esc(n.titulo)}</a></h3><p>${esc(n.resumen)}</p><small>Por ${esc(n.autor)}</small></article>`).join('');}
async function init(){try{const r=await fetch('data/noticias.json',{cache:'no-store'});state.news=await r.json();renderLead();renderTrending();renderFilters();renderNews();renderOpinion();}catch(e){console.error(e);}}
$('#menuButton').onclick=()=>{const nav=$('#mainNav');const open=nav.classList.toggle('open');$('#menuButton').setAttribute('aria-expanded',open)};
$('#searchToggle').onclick=()=>{$('#searchPanel').classList.add('open');$('#searchInput').focus()};
$('#searchClose').onclick=()=>{$('#searchPanel').classList.remove('open')};
$('#searchInput').oninput=e=>{state.query=e.target.value.trim().toLowerCase();renderNews();};
$('#year').textContent=new Date().getFullYear();init();
