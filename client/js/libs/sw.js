importScripts('workbox-sw.prod.v1.0.1.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "/audio/pop.ogg",
    "revision": "c362f88916872738458a1a342371c8bc"
  },
  {
    "url": "/css/bootstrap.css",
    "revision": "cbc131e073b5be115045dd4e50e884bd"
  },
  {
    "url": "/css/fonts/inconsolatag.woff",
    "revision": "057442d0d60d78f4a3630c6549d53d46"
  },
  {
    "url": "/css/fonts/Lato-700/Lato-700.woff",
    "revision": "ef957703c11c5472df66c86dc26d506e"
  },
  {
    "url": "/css/fonts/Lato-700/Lato-700.woff2",
    "revision": "39c04b1c25c34280adbe76749e689f2f"
  },
  {
    "url": "/css/fonts/Lato-700/LICENSE.txt",
    "revision": "39591640d6982378c43eba1db4b68e12"
  },
  {
    "url": "/css/fonts/Lato-regular/Lato-regular.woff",
    "revision": "692b2ac094cb0b2679dadd8cba568087"
  },
  {
    "url": "/css/fonts/Lato-regular/Lato-regular.woff2",
    "revision": "2fdbf25c9ba247df7b74fbb0137c4bca"
  },
  {
    "url": "/css/fonts/Lato-regular/LICENSE.txt",
    "revision": "39591640d6982378c43eba1db4b68e12"
  },
  {
    "url": "/css/style.css",
    "revision": "d188e5419238dc5c95ab32d4e5738c2b"
  },
  {
    "url": "/fonts/fontawesome-webfont.woff",
    "revision": "fee66e712a8a08eef5805a46892932ad"
  },
  {
    "url": "/fonts/fontawesome-webfont.woff2",
    "revision": "af7ae505a9eed503f8b8e6982036873e"
  },
  {
    "url": "/img/apple-touch-icon-120x120.png",
    "revision": "f81718a9cd0aa7a97ea1b761fa7acb6a"
  },
  {
    "url": "/img/favicon-notification.png",
    "revision": "9e2c73027792e234f5c1392f855f29d6"
  },
  {
    "url": "/img/favicon.png",
    "revision": "08a41730451bf7e852e70f7be6035aa3"
  },
  {
    "url": "/img/logo-64.png",
    "revision": "0d4a1daff68c80998dd9bea7eca4a967"
  },
  {
    "url": "/img/logo-dark.svg",
    "revision": "257bf637b473a1bb34c938fe38f0cc26"
  },
  {
    "url": "/img/logo.svg",
    "revision": "c24aeb66c2797cec0e96cd4e442b714b"
  },
  {
    "url": "/img/touch-icon-192x192.png",
    "revision": "9854fd134d8cbad228aa788ef443ef63"
  },
  {
    "url": "/index.html",
    "revision": "dd2416d64acce4735900882f611b6e81"
  },
  {
    "url": "/js/bundle.js.map",
    "revision": "569e6c50e1264f086b7745c71adfa4c7"
  },
  {
    "url": "/js/bundle.vendor.js.map",
    "revision": "044d10e3ddccb9e89df2d61e57ed3ccb"
  },
  {
    "url": "/js/libs/simplemap.json",
    "revision": "0b38955486f608451b80a63d6d2d4976"
  },
  {
    "url": "/manifest.json",
    "revision": "59e31c9e0ae83b522ed3ac194d1165f7"
  },
  {
    "url": "/robots.txt",
    "revision": "f71d20196d4caf35b6a670db8c70b03d"
  },
  {
    "url": "/themes/crypto.css",
    "revision": "a80bbefcc7c70c19fc304eae25a75710"
  },
  {
    "url": "/themes/example.css",
    "revision": "02cfc00458f7ddb4d0051ef5bc621ec4"
  },
  {
    "url": "/themes/morning.css",
    "revision": "27abb086bd781d5755abdcc474564985"
  },
  {
    "url": "/themes/zenburn.css",
    "revision": "45a0bf2681bd164cde8f55ec12085265"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
