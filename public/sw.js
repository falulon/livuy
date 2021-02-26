const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
  
  '/login',
  '/register',
  'fallback.html',
  '/stylesheets/home.css',
  '/stylesheets/app.css',
  '/javascripts/validateForms.js',
  '/img/home_sheeps.jpg'
  ];

const serverPriorityPages = [
  '/campgrounds/',
  '/dictionary/',
  '/dictionary/index_archived',
  ];
  
// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});


// network only 
// self.addEventListener('fetch', function(event) {
//   event.respondWith(fetch(event.request));
// });



// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(caches.open(dynamicCacheName).then(function (cache) {
    return cache.match(evt.request).then(function (response) {
      var fetchPromise = fetch(evt.request).then(function (networkResponse) {
        cache.put(evt.request.url, networkResponse.clone());
        limitCacheSize(dynamicCacheName, 55);

        return networkResponse;
      });
      return response || fetchPromise;
    });
  }).catch(() => {
    if ((evt.request.url.indexOf('.png') < 0) && (evt.request.url.indexOf('.js') < 0) && (evt.request.url.indexOf('.jpg') < 0)
    && (evt.request.url.indexOf('.css') < 0) && (evt.request.url.indexOf('.css') < 0) && (evt.request.url.indexOf('image') < 0)
    && (evt.request.url.indexOf('fonts') < 0) && (evt.request.url.indexOf('.webp') < 0) && (evt.request.url.indexOf('.ico') < 0))
     {
      return caches.match('./fallback.html');
    } 
  }));
    })


