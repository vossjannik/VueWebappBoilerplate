/* global importScripts WorkboxSW:true */

/* cache everything for offline usage */
importScripts('workbox-sw.prod.v2.1.2.js')

const workboxSW = new WorkboxSW({ skipWaiting: true })

workboxSW.precache([]) // <-- inserted by webpack

workboxSW.router.registerNavigationRoute('index.html', {
  blacklist: [
    /^.*\..*/,
  ],
})
