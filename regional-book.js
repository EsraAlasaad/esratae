(()=>{
const key=document.body.dataset.place||new URLSearchParams(location.search).get('place')||'ubud',r=REGIONS[key]||REGIONS.ubud;
window.activeRegion=r;document.title=r.name+' | TAER ALSHAREQ';
const $=s=>document.querySelector(s);let n=0,busy=false,playing=false,timer=null;
const items=[...r.pages.map(x=>({...x,section:x.section||'explore'})),...(r.hotels||[]).map(x=>({...x,title:x.title||x.name,section:'hotels'})),...(r.restaurants||[]).map(x=>({...x,title:x.name,section:'restaurants'}))];
const ar=()=>document.documentElement.lang==='ar';
const category=x=>ar()?({explore:'استكشاف',hotels:'الفنادق',restaurants:'المطاعم',resorts:'المنتجعات',villas:'الفلل',events:'المناسبات'}[x.section]):({explore:'Explore',hotels:'Hotels',restaurants:'Restaurants',resorts:'Resort collection',villas:'Villa collection',events:'Celebration magazine'}[x.section]);
function schedule(){clearTimeout(timer);if(playing)timer=setTimeout(()=>next(),8000)}
function setPlay(on){playing=on;$('#bookPlay').textContent=on?'Ⅱ':'▶';$('#bookPlay').setAttribute('aria-label',on?'Pause journal':'Play journal');schedule()}
function visual(x){
if((key==='events'||key==='maldives'||key==='conrad'||x.section==='hotels')&&x.image)return '<div class="original-photo-scene"><div class="original-photo-shadow"></div><div class="photo-water-shimmer" aria-hidden="true"></div><img src="'+x.image+'" alt="'+x.title+'"/><small>Destination photograph</small></div>';

if(x.object)return '<div class="cutout-scene"><div class="popup-shadow"></div><img class="landmark-object" src="'+x.object+'" alt="'+x.title+'"/></div>';
if(x.artSet)return '<div class="cutout-scene"><div class="popup-shadow"></div><div class="sprite-object atlas-'+x.artSet+' cell-'+x.artIndex+'" role="img" aria-label="Artistic 3D illustration for '+x.title+'"></div><small class="art-note">Artistic 3D illustration</small></div>';
if(x.visual==='dish')return '<div class="popup-stage dish-stage"><div class="popup-shadow"></div><div class="serving-plate"></div><div class="food-reveal dish-object dish-'+x.dishIndex+'" role="img" aria-label="Illustration of '+x.dish+'"></div><div class="food-steam" aria-hidden="true"><i></i><i></i><i></i></div><div class="popup-caption">'+(ar()?x.dishAr:x.dish)+'</div></div>';
const src=x.image||'assets/regions/'+r.photo+'.jpg',caption=x.caption||x.title||r.name;
return '<div class="popup-stage '+(x.visual==='architecture'?'architecture':'landscape')+'"><div class="ground-plane"><img src="'+src+'" alt=""/></div><div class="popup-shadow"></div><div class="popup-photo"><img src="'+src+'" alt="'+x.title+'"/></div><div class="popup-caption">'+caption+'</div><span class="scene-label">'+(x.visual==='architecture'?'THE STAY COLLECTION':'A PLACE TO DISCOVER')+'</span></div>';
}
function render(){const x=items[n];$('#region-title').textContent=ar()?r.ar:r.name;$('#region-kicker').textContent=r.kicker||(ar()?'بالي · دفتر الرحلة':'Bali · Travel journal');
$('#bookCopy').innerHTML='<div class="eyebrow">'+category(x)+'</div><h2>'+(ar()?x.ar:x.title)+'</h2><div class="book-ornament">✦</div><p class="page-tag">'+(ar()?(x.tagAr||''):x.tag||'')+'</p><p>'+(ar()?x.textAr:x.text)+'</p>'+(x.rooms?'<div class="room-types"><h3>Rooms & villas</h3><ul>'+x.rooms.map(t=>'<li>'+t+'</li>').join('')+'</ul></div>':'')+(x.dish?'<div class="dish-summary"><b>'+(ar()?x.dishAr:x.dish)+'</b><p>'+(ar()?x.dishNoteAr:x.dishNote)+'</p></div>':'')+(x.url?'<a class="pill" target="_blank" rel="noopener" href="'+x.url+'">'+(ar()?'الموقع الرسمي ↗':'Official website ↗')+'</a>':'');
$('#bookPhoto').innerHTML=visual(x);$('#pageCount').textContent=items.slice(0,n+1).filter(i=>i.section===x.section).length+' / '+items.filter(i=>i.section===x.section).length;$('#bookPrev').disabled=n===0;$('#bookNext').setAttribute('aria-label',n===items.length-1?'Close book and return to Overview':'Next page');
$('.book-tabs').querySelectorAll('button').forEach(b=>{b.hidden=!items.some(i=>i.section===b.dataset.section);b.classList.toggle('active',b.dataset.section===x.section);b.setAttribute('aria-current',b.dataset.section===x.section?'page':'false')});if(r.collection)$('.book-tabs').hidden=true;
history.replaceState(null,'',location.pathname+location.search+'#'+x.section);schedule();
}
function move(to){if(busy||to===n)return;busy=true;const book=$('#travelBook'),leaf=document.createElement('div');leaf.className='turn-leaf';const old=items[n];leaf.innerHTML=visual(old);n=to;render();book.append(leaf);book.classList.add('turning');setTimeout(()=>{leaf.remove();book.classList.remove('turning');busy=false},matchMedia('(prefers-reduced-motion: reduce)').matches?0:650)}
function closeBook(){busy=true;setPlay(false);$('#travelBook').classList.add('closing');setTimeout(()=>location.href='index.html?overview=1',750)}
function next(){if(busy)return;if(n<items.length-1)move(n+1);else closeBook()}
$('#bookPrev').onclick=()=>{setPlay(false);if(n>0)move(n-1)};$('#bookNext').onclick=()=>{setPlay(false);next()};$('#bookPlay').onclick=()=>setPlay(!playing);
$('.book-tabs').onclick=e=>{const b=e.target.closest('button[data-section]');if(b){setPlay(false);move(items.findIndex(x=>x.section===b.dataset.section))}};
addEventListener('keydown',e=>{if(e.key==='ArrowRight')$('#bookNext').click();if(e.key==='ArrowLeft')$('#bookPrev').click()});
$('#bookPhoto').addEventListener('pointermove',e=>{const b=$('#bookPhoto').getBoundingClientRect();$('#bookPhoto').style.setProperty('--tilt-x',((e.clientY-b.top)/b.height-.5)*-8+'deg');$('#bookPhoto').style.setProperty('--tilt-y',((e.clientX-b.left)/b.width-.5)*10+'deg')});$('#bookPhoto').addEventListener('pointerleave',()=>{$('#bookPhoto').style.setProperty('--tilt-x','0deg');$('#bookPhoto').style.setProperty('--tilt-y','0deg')});
addEventListener('site-language-change',render);const target=location.hash.slice(1);const found=items.findIndex(x=>x.section===target);if(found>=0)n=found;render();
})();
