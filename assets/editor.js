const form=document.getElementById('editorForm'), out=document.getElementById('jsonOutput');
form.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form));const id=d.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');out.value=JSON.stringify({...d,id,fecha:new Date().toISOString().slice(0,10)},null,2)};
document.getElementById('copyJson').onclick=async()=>{await navigator.clipboard.writeText(out.value);alert('JSON copiado')};
