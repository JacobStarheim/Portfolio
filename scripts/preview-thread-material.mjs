import { readFile, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';

// Local-only magnified comparison using the actual production rendering code.
// Run after next build. These files live only in ignored out/ and are never deployed.
await mkdir('out/thread-proof', { recursive: true });
for (const name of ['art-thread', 'thread-material']) {
  const source = await readFile(`src/lib/${name}.ts`, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  await writeFile(`out/thread-proof/${name}.js`, compiled.outputText);
}
await writeFile('out/thread-proof/index.html', `<!doctype html>
<html lang="no"><meta charset="utf-8"><title>Trådmateriale — lokal nærkontroll</title>
<style>body{margin:24px;background:#101e20;color:#efe8d8;font:14px system-ui}h1{font-size:20px}select{font:inherit;padding:10px}main{display:flex;gap:24px;flex-wrap:wrap}canvas{display:block;width:300px;height:720px;background:#101e20}h2{font-size:15px}</style>
<h1>Trådmateriale — 3× nærkontroll</h1><label>Overgang <select id="pair"></select></label>
<main><section><h2>Før: flat farge</h2><canvas id="old"></canvas></section><section><h2>Nå: generert trådmateriale</h2><canvas id="new"></canvas></section></main><p id="status">Laster …</p>
<script type="module">
import {createThreadGeometry,getArtThread} from './art-thread.js';
import {prepareThreadMaterial,prepareThreadProfile,rasterizeThread} from './thread-material.js';
const names=['nimmo','traveller','driver','education','in5320','hobbies','bfme','podcast','chess','about'];
const selector=document.querySelector('#pair');
for(let i=0;i<names.length-1;i++){const option=document.createElement('option');option.value=i;option.textContent=names[i]+' → '+names[i+1];selector.append(option)}
selector.value='1';
const image=async src=>{const img=new Image();img.src=src;await img.decode();return img};
const materialImage=await image('/art/thread-material.webp');
const materialCanvas=document.createElement('canvas');materialCanvas.width=materialImage.width;materialCanvas.height=materialImage.height;
const materialContext=materialCanvas.getContext('2d');materialContext.drawImage(materialImage,0,0);
const material=prepareThreadMaterial(materialContext.getImageData(0,0,materialImage.width,materialImage.height));
const profiles=await fetch('/art/thread-profiles.json').then(r=>r.json());
async function render(){
 const i=Number(selector.value),from=names[i],to=names[i+1];
 const [upper,lower]=await Promise.all([image('/art/'+from+'.webp'),image('/art/'+to+'.webp')]);
 const width=1254,height=110,margin=65,clipWidth=100,scale=3;
 const start=getArtThread(from).bottom,end=getArtThread(to).top;
 const geometry=createThreadGeometry(start,end,{width,height,minimumWidth:0});
 const center=(geometry.start.x+geometry.end.x)/2,left=center-clipWidth/2;
 const raster=rasterizeThread(material,geometry,{scale,from:prepareThreadProfile(profiles.artworks[from].large.bottom,profiles),to:prepareThreadProfile(profiles.artworks[to].large.top,profiles)});
 const thread=document.createElement('canvas');thread.width=raster.width;thread.height=raster.height;thread.getContext('2d').putImageData(new ImageData(raster.data,raster.width,raster.height),0,0);
 for(const id of ['old','new']){
  const canvas=document.querySelector('#'+id);canvas.width=clipWidth*scale;canvas.height=(height+margin*2)*scale;
  const c=canvas.getContext('2d');c.scale(scale,scale);c.fillStyle='#101e20';c.fillRect(0,0,clipWidth,height+margin*2);
  c.drawImage(upper,left,upper.height-margin,clipWidth,margin,0,0,clipWidth,margin);
  c.drawImage(lower,left,0,clipWidth,margin,0,margin+height,clipWidth,margin);
  c.save();c.translate(-left,margin);
  if(id==='new')c.drawImage(thread,raster.left,0,raster.cssWidth,raster.cssHeight);
  else{const gradient=c.createLinearGradient(0,0,0,height);gradient.addColorStop(0,start.color);gradient.addColorStop(1,end.color);c.fillStyle=gradient;c.fill(new Path2D(geometry.path))}
  c.restore();
 }
 document.querySelector('#status').textContent='Klar: '+from+' → '+to+' · samme kode og bildepiksler som nettsiden';
}
selector.addEventListener('change',render);await render();
</script></html>`);
console.log('Local proof: http://127.0.0.1:3100/thread-proof/');
