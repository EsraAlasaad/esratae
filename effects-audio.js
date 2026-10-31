(()=>{
document.addEventListener('click',e=>{const target=e.target.closest('button,a.pill,.map-pin,.pin,.choice,.option-card,[role="button"]');if(!target)return;const b=target.getBoundingClientRect(),x=e.detail?e.clientX:b.left+b.width/2,y=e.detail?e.clientY:b.top+b.height/2,drop=document.createElement('i');drop.className='silver-waterdrop';drop.style.left=x+'px';drop.style.top=y+'px';document.body.append(drop);setTimeout(()=>drop.remove(),1100);
const a=target.closest('a[href]');if(a&&!e.defaultPrevented&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&a.target!=='_blank'){const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname!==location.pathname){e.preventDefault();setTimeout(()=>location.href=a.href,520)}}
});
const button=document.createElement('button');button.id='soundControl';button.className='pill ambience-control';button.type='button';button.textContent='Music';button.setAttribute('aria-label','Music');button.setAttribute('aria-pressed','false');const home=!location.pathname.split('/').pop()||location.pathname.endsWith('index.html');if(home){const anchor=document.querySelector('.hero-copy');(anchor||document.body).append(button)}
const waves=new Audio('assets/ocean-waves.mp3'),bali=new Audio('assets/bali-gamelan.mp3');waves.loop=bali.loop=true;waves.volume=.28;bali.volume=.13;let playing=false,timer=null,starting=false;
function stop(){waves.pause();bali.pause();clearTimeout(timer);playing=false;button.classList.remove('playing');button.textContent='Music';button.setAttribute('aria-pressed','false')}
async function start(){if(playing||starting)return;starting=true;try{await Promise.all([waves.play(),bali.play()]);playing=true;button.classList.add('playing');button.textContent='Music';button.setAttribute('aria-pressed','true');clearTimeout(timer);timer=setTimeout(stop,50000)}catch{waves.pause();bali.pause();button.textContent='Music'}finally{starting=false}}
button.onclick=()=>playing?stop():start();
if(!location.pathname.split('/').pop()||location.pathname.endsWith('index.html')){document.addEventListener('pointerdown',e=>{if(!e.target.closest('#soundControl')&&!document.querySelector('.intro'))start()},{once:true,capture:true});document.addEventListener('keydown',()=>start(),{once:true})}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();
