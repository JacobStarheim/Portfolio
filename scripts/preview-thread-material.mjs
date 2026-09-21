import { readFile, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';

// Local-only magnified proof using the website's actual rendering code.
// Run after next build. These files live only in ignored out/ and are never deployed.
await mkdir('out/thread-proof', { recursive: true });
for (const name of ['art-thread', 'thread-material']) {
  const source = await readFile(`src/lib/${name}.ts`, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  await writeFile(`out/thread-proof/${name}.js`, compiled.outputText);
}
await writeFile('out/thread-proof/index.html', `<!doctype html>
<html lang="no"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Illustrert strek — lokal kvalitetskontroll</title>
<style>
*{box-sizing:border-box}body{max-width:1180px;margin:24px auto;padding:0 16px;background:#101e20;color:#efe8d8;font:14px system-ui}h1{font-size:20px}p{line-height:1.5;color:#c8c6bc}.controls{display:flex;gap:12px;flex-wrap:wrap}.controls label{display:grid;gap:5px}select{font:inherit;padding:8px;max-width:100%}canvas{display:block;width:auto;height:min(720px,calc(100dvh - 330px));min-height:320px;max-width:100%;margin:auto;object-fit:contain;background:#101e20}h2{font-size:15px}#proofs{margin-top:20px}.proof{margin:0;padding:12px;border:1px solid #405052;min-width:0}.proof figcaption{font-weight:600;margin-bottom:12px}.proof small{display:block;margin-top:10px;color:#b8bcb3}#proofs:not(.grid){max-width:620px;margin-inline:auto}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.grid canvas{height:330px;min-height:0}.grid h2{font-size:14px}[hidden]{display:none!important}@media(max-width:700px){.grid{grid-template-columns:1fr}.grid canvas{height:420px}.controls{display:grid}}
</style>
<h1>Samme illustrerte strek gjennom overgangen</h1><p>Lokal kvalitetskontroll. Farger, skygge og myke kanter hentes fra streken i de to kunstbildene. Ingen tau- eller flettetekstur er lagt til.</p>
<div class="controls">
<label>Visning <select id="view"><option value="single">Én overgang</option><option value="all">Alle ni overganger</option></select></label>
<label>Bildevariant <select id="variant"><option value="large">Stor kilde · 1254 px bredde</option><option value="small">Mobilkilde · 390 CSS-px bredde</option></select></label>
<label>Overgang <select id="pair"></select></label>
</div>
<main><h2 id="mode">Forstørret nærbilde · originalkunst over og under</h2><div id="proofs"></div></main><p id="status" role="status" aria-live="polite">Laster …</p>
<script type="module">
import {createThreadGeometry,getArtThread} from './art-thread.js';
import {prepareThreadProfile,rasterizeThread} from './thread-material.js';
const names=['nimmo','traveller','driver','education','in5320','hobbies','bfme','podcast','chess','about'];
const selector=document.querySelector('#pair');
const view=document.querySelector('#view');
const variant=document.querySelector('#variant');
const proofs=document.querySelector('#proofs');
const status=document.querySelector('#status');
const mode=document.querySelector('#mode');
for(let i=0;i<names.length-1;i++){const option=document.createElement('option');option.value=i;option.textContent=names[i]+' → '+names[i+1];selector.append(option)}
selector.value='3';
const images=new Map();
const image=src=>{if(!images.has(src))images.set(src,(async()=>{const img=new Image();img.src=src;await img.decode();return img})());return images.get(src)};
const profiles=await fetch('/art/thread-profiles.json').then(r=>{if(!r.ok)throw new Error('Kunne ikke laste strekprofiler');return r.json()});
let revision=0;
async function renderPair(index,small){
 const from=names[index],to=names[index+1],suffix=small?'-640':'',profileVariant=small?'small':'large';
 const [upper,lower]=await Promise.all([image('/art/'+from+suffix+'.webp'),image('/art/'+to+suffix+'.webp')]);
 const width=small?390:1254,height=small?91:110,margin=65,clipWidth=140,scale=3;
 const start=getArtThread(from,small).bottom,end=getArtThread(to,small).top;
 const geometry=createThreadGeometry(start,end,{width,height,minimumWidth:0});
 const center=(geometry.start.x+geometry.end.x)/2,left=center-clipWidth/2;
 const raster=rasterizeThread(geometry,{scale,from:prepareThreadProfile(profiles.artworks[from][profileVariant].bottom,profiles),to:prepareThreadProfile(profiles.artworks[to][profileVariant].top,profiles)});
 const thread=document.createElement('canvas');thread.width=raster.width;thread.height=raster.height;thread.getContext('2d').putImageData(new ImageData(raster.data,raster.width,raster.height),0,0);
 const canvas=document.createElement('canvas');canvas.width=clipWidth*scale;canvas.height=(height+margin*2)*scale;canvas.setAttribute('aria-label',from+' → '+to+' · '+profileVariant);
 const c=canvas.getContext('2d');c.scale(scale,scale);c.fillStyle='#101e20';c.fillRect(0,0,clipWidth,height+margin*2);
 // Map the CSS-pixel crop back into the selected original raster. In mobile
 // mode the 640-pixel artwork is displayed at 390 CSS pixels, just as on site.
 const upperRatio=upper.naturalWidth/width,lowerRatio=lower.naturalWidth/width;
 c.drawImage(upper,left*upperRatio,upper.naturalHeight-margin*upperRatio,clipWidth*upperRatio,margin*upperRatio,0,0,clipWidth,margin);
 c.drawImage(lower,left*lowerRatio,0,clipWidth*lowerRatio,margin*lowerRatio,0,margin+height,clipWidth,margin);
 c.drawImage(thread,raster.left-left,margin,raster.cssWidth,raster.cssHeight);
 const figure=document.createElement('figure');figure.className='proof';figure.dataset.pair=from+'-'+to;figure.dataset.variant=profileVariant;figure.dataset.ready='true';
 const caption=document.createElement('figcaption');caption.textContent=(index+1)+'. '+from+' → '+to;
 const detail=document.createElement('small');detail.textContent=upper.naturalWidth+' px kilde → '+width+' CSS-px · mellomrom '+height+' px · raster 3×';
 figure.append(caption,canvas,detail);return figure;
}
async function render(){
 const current=++revision,all=view.value==='all',small=variant.value==='small',indices=all?names.slice(0,-1).map((_,i)=>i):[Number(selector.value)];
 const variantLabel=small?'Mobilkilde ved 390 CSS-px':'Stor kilde ved 1254 CSS-px';
 selector.disabled=all;proofs.classList.toggle('grid',all);proofs.dataset.readyCount='0';proofs.dataset.expectedCount=String(indices.length);proofs.dataset.variant=small?'small':'large';
 status.textContent='Laster '+indices.length+' overgang'+(all?'er':'')+' · '+variantLabel;mode.textContent=(all?'Alle ni overganger':'Forstørret nærbilde')+' · '+variantLabel+' · originalkunst over og under';
 try{
  const figures=await Promise.all(indices.map(index=>renderPair(index,small)));
  if(current!==revision)return;
  proofs.replaceChildren(...figures);proofs.dataset.readyCount=String(figures.length);
  status.textContent='Klar: '+figures.length+'/'+indices.length+' · '+variantLabel+' · samme kode og bildepiksler som nettsiden';
 }catch(error){
  if(current!==revision)return;
  proofs.replaceChildren();status.textContent='Kunne ikke tegne alle overgangene: '+error.message;
 }
}
for(const control of [selector,view,variant])control.addEventListener('change',render);await render();
</script></html>`);
console.log('Local proof: http://127.0.0.1:3100/thread-proof/');
