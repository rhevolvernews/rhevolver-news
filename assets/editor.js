const form=document.getElementById('editorForm'),output=document.getElementById('editorOutput');
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
form.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form));const item={id:slug(d.titulo),titulo:d.titulo,resumen:d.resumen,contenido:d.contenido.split(/\n\s*\n/).filter(Boolean),categoria:d.categoria,autor:d.autor,fecha:new Date().toISOString().slice(0,10),imagen:d.imagen,tags:[d.categoria]};output.value=JSON.stringify(item,null,2)+',';});
document.getElementById('copyOutput').addEventListener('click',()=>navigator.clipboard.writeText(output.value));
