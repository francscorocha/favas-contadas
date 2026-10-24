// Rede primeiro (para apanhar receitas novas), cache quando não há rede
const CACHE='favas-6203f07f2b';
const BASE=['./','index.html','dados.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const guarda=r=>{if(r.ok||r.type==='opaque'){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r};
  if(u.origin===location.origin)
    e.respondWith(fetch(e.request).then(guarda).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
  else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(guarda)));
});
