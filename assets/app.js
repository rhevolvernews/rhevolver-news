const state={news:[],filter:'Todas'};
const byId=id=>document.getElementById(id);
const formatDate=date=>new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${date}T12:00:00`));
const articleUrl=n=>`articulo.html?id=${encodeURIComponent(n.id)}`;
const card=n=>`<article class="story-card"><a href="${articleUrl(n)}"><img src="${n.imagen}" alt=""><div class="story-body"><span>${n.categoria.toUpperCase()}</span><h3>${n.titulo}</h3><p>${n.resumen}</p><small>${formatDate(n.fecha)} · ${n.autor}</small><b class="read-more">Leer más →</b></div></a></article>`;
const compact=n=>`<li><a href="${articleUrl(n)}"><span>${n.categoria}</span><strong>${n.titulo}</strong></a></li>`;
const opinion=n=>`<article class="opinion-card"><a href="${articleUrl(n)}"><span>${n.categoria.toUpperCase()}</span><h3>${n.titulo}</h3><p>${n.resumen}</p><small>${n.autor}</small></a></article>`;
function render(){
 const hero=state.news.find(n=>n.destacada)||state.news[0];
 byId('heroArticle').innerHTML=`<img src="assets/img/hero.webp" alt="Identidad visual de Rhevolver.news"><div class="hero-content"><span class="kicker">${hero.categoria.toUpperCase()}</span><h1>${hero.titulo}</h1><p>${hero.resumen}</p><a class="primary-button" href="${articleUrl(hero)}">Leer noticia</a></div>`;
 byId('trendingList').innerHTML=state.news.filter(n=>n.tendencia).slice(0,5).map(compact).join('');
 const cats=['Todas','Local','Nacional','Internacional','Opinión','IA','TV Show','Humor'];
 byId('categoryFilters').innerHTML=cats.map(c=>`<button class="filter-button ${c===state.filter?'active':''}" data-filter="${c}">${c}</button>`).join('');
 const latest=state.filter==='Todas'?state.news:state.news.filter(n=>n.categoria===state.filter);
 byId('latestGrid').innerHTML=latest.slice(0,6).map(card).join('');
 const fill=(id,cat,limit=3,template=card)=>byId(id).innerHTML=state.news.filter(n=>n.categoria===cat).slice(0,limit).map(template).join('');
 fill('localGrid','Local');fill('nacionalGrid','Nacional',2);fill('internacionalGrid','Internacional',2);fill('opinionGrid','Opinión',3,opinion);fill('iaGrid','IA',1);fill('tvshowGrid','TV Show',1);fill('humorGrid','Humor',1);
}
fetch('data/noticias.json').then(r=>r.json()).then(data=>{state.news=data;render();}).catch(()=>{byId('latestGrid').innerHTML='<p>No fue posible cargar las noticias.</p>';});
const menuToggle=byId('menuToggle'),mainNav=byId('mainNav'),searchToggle=byId('searchToggle'),searchPanel=byId('searchPanel'),searchInput=byId('searchInput'),searchResults=byId('searchResults');
menuToggle?.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));
searchToggle?.addEventListener('click',()=>{searchPanel.classList.toggle('open');if(searchPanel.classList.contains('open'))searchInput.focus();});
searchInput?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();if(!q){searchResults.innerHTML='';return;}const results=state.news.filter(n=>`${n.titulo} ${n.resumen} ${n.categoria} ${n.tags.join(' ')}`.toLowerCase().includes(q)).slice(0,8);searchResults.innerHTML=results.length?results.map(n=>`<a href="${articleUrl(n)}"><span>${n.categoria}</span><strong>${n.titulo}</strong></a>`).join(''):'<p>Sin resultados.</p>';});
document.addEventListener('click',e=>{const f=e.target.closest('[data-filter]');if(f){state.filter=f.dataset.filter;render();document.querySelector('#latestHeading').scrollIntoView({behavior:'smooth'});}const link=e.target.closest('[data-filter-link]');if(link){state.filter=link.dataset.filterLink;render();document.querySelector('#latestHeading').scrollIntoView({behavior:'smooth'});}});
byId('year').textContent=new Date().getFullYear();
