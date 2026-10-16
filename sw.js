const C='fp-v2';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(['./','index.html','manifest.json'].map(u=>c.add(new Request(u,{cache:'reload'}))))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
// Réseau d'abord ; la copie en cache est mise à jour à chaque chargement réussi, elle ne sert qu'hors connexion
self.addEventListener('fetch',e=>{
 const q=e.request,u=new URL(q.url);
 if(q.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(q,{cache:'no-cache'}).then(r=>{if(r.status===200){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp)).catch(()=>{})}return r})
  .catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
