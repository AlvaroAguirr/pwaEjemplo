// plantilla de servie worker

const { cache } = require("react");

// 1. el nombre del servicio y los archvios a cachear 

const CACHE_NAME=   "nombre-del-cache"
const urlsToCache = [
    "index.html",
    "style.css",    "app.js",
    "offline.html",
]

// 2. install  -> el evento que se ejecuta al instalar el swe
// se diapara la oprimera vez que se registra el service worker 
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsToCache))
    );

});

// 3. Activate ->  este evento se ejecuta al activarse 
// debe limpiar caches vieja
 // se dispara cuando el sw se activa ( esta en ejecucion)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
            .map(key=> caches.delete(key))
            )
        )
    );
}
)
// fetch -> intercepta las peticiones de la pwa,

// Intercepta cada peticino de cada pagina de la pwa
// busca primero el cache, y si el recurso no esta , va a la red 
// si todo falla , muestra offline.hmtl
self.addEventListener("fetch", event => {
    event.respondwith(
      caches.match(event.request).then(response=> {
        return response || fetch(event.request).catch(
            ()=> catches.match("offline.html")); 
      })  
    );
});


// 5. PUSH ->  notificaciones en segundo plano (Opcional)

self.addEventListener("push", event => {
    const data = event.data ? event.data.text(): "Notificacion sin datos "
    event.waitUntil(
    self.registration.showNotification("MI PWA", {body: data})
    )
})

 