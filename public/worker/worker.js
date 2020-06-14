/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
if (workbox) {
  workbox.core.setCacheNameDetails({
    prefix: 'doddle',
    suffix: 'v1'
  });

  workbox.skipWaiting();
  workbox.clientsClaim();
  workbox.routing.registerRoute(/https:\/\/closertb.site\/.+\.(css|js)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'doddle:static',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20
        })
      ]
    }));
} else {
  console.log('workbox加载失败');
}
