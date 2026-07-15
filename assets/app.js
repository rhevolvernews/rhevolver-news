const menuToggle=document.getElementById('menuToggle');
const mainNav=document.getElementById('mainNav');
const searchToggle=document.getElementById('searchToggle');
const searchPanel=document.getElementById('searchPanel');
const searchClose=document.getElementById('searchClose');
const searchInput=document.getElementById('searchInput');
menuToggle?.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));
searchToggle?.addEventListener('click',()=>{searchPanel.classList.toggle('open');if(searchPanel.classList.contains('open'))searchInput.focus();});
searchClose?.addEventListener('click',()=>{searchPanel.classList.remove('open');searchInput.value='';filterStories('');});
function filterStories(q){const term=q.trim().toLowerCase();document.querySelectorAll('.searchable').forEach(el=>{const hay=(el.dataset.search+' '+el.textContent).toLowerCase();el.classList.toggle('hidden',term&&!hay.includes(term));});}
searchInput?.addEventListener('input',e=>filterStories(e.target.value));
document.getElementById('year').textContent=new Date().getFullYear();
