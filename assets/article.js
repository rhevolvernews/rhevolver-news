const id=new URLSearchParams(location.search).get('id');
const byId=id=>document.getElementById(id);
const formatDate=date=>new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${date}T12:00:00`));
fetch('data/noticias.json').then(r=>r.json()).then(news=>{
 const n=news.find(x=>x.id===id)||news[0];
 document.title=`${n.titulo} | Rhevolver.news`;
 byId('metaDescription').content=n.resumen;byId('ogTitle').content=n.titulo;byId('ogDescription').content=n.resumen;byId('ogImage').content=n.imagen;
 const url=encodeURIComponent(location.href),text=encodeURIComponent(n.titulo);
 byId('articleContent').innerHTML=`<span class="kicker">${n.categoria.toUpperCase()}</span><h1>${n.titulo}</h1><p class="article-deck">${n.resumen}</p><div class="article-meta">${formatDate(n.fecha)} · ${n.autor}</div><img class="article-image" src="${n.imagen}" alt=""><div class="article-body">${n.contenido.map(p=>`<p>${p}</p>`).join('')}</div><div class="tags">${n.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="share-row"><strong>Compartir:</strong><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${url}">Facebook</a><a target="_blank" rel="noopener" href="https://wa.me/?text=${text}%20${url}">WhatsApp</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${text}&url=${url}">X</a><button id="copyLink">Copiar enlace</button></div>`;
 byId('copyLink').addEventListener('click',()=>navigator.clipboard.writeText(location.href).then(()=>byId('copyLink').textContent='Copiado'));
 const related=news.filter(x=>x.id!==n.id&&(x.categoria===n.categoria||x.tags.some(t=>n.tags.includes(t)))).slice(0,3);
 byId('relatedGrid').innerHTML=related.map(x=>`<article class="story-card"><a href="articulo.html?id=${encodeURIComponent(x.id)}"><img src="${x.imagen}" alt=""><div class="story-body"><span>${x.categoria.toUpperCase()}</span><h3>${x.titulo}</h3><p>${x.resumen}</p></div></a></article>`).join('');
});
byId('year').textContent=new Date().getFullYear();
