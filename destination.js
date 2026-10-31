(() => {
 const key = location.pathname.split('/').pop().split('.')[0];
 const id = ['jakarta','bali','maafushi','conrad'].includes(key) ? key : location.hash.slice(1) || 'bali';
 const extra = {
 maafushi: {id:'maafushi',kicker:'Maldives',title:'Maafushi',titleAr:'',sub:'An island escape',subAr:'',cols:1,items:[{id:'maafushi',photo:'assets/maldives.png',name:'Maafushi Island',ar:'',tag:'South Malé Atoll',tagAr:'',desc:'Explore the island, enjoy the beach and discover the surrounding lagoon.',descAr:''}]},
 conrad: {id:'conrad',kicker:'Maldives',title:'Conrad',titleAr:'',sub:'Conrad Maldives Rangali Island',subAr:'',cols:1,items:[{id:'conrad',photo:'assets/maldives.png',name:'Conrad Maldives Rangali Island',ar:'',tag:'South Ari Atoll',tagAr:'',desc:'Discover the twin-island resort and its Indian Ocean setting.',descAr:''}]}
 };
 window.JOURNAL = [extra[id] || window.JOURNAL.find(c=>c.id===id) || window.JOURNAL[0]];
 window.JOURNAL[0].titleAr='';
 document.title=window.JOURNAL[0].title+' | TAER ALSHAREQ';
})();