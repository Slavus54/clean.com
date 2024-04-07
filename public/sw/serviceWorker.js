const PROFILE_CACHE = 'static-images-cache-v1'
const RESOURCES = [
    '/index.html',
    '/loading.gif'
]

self.addEventListener('install', async e => {
    const cache = await caches.open(PROFILE_CACHE)

    await cache.addAll(RESOURCES)
})

self.addEventListener('activate', async e => {
    const cache_tags = await caches.keys()

    await Promise.all(
        cache_tags.filter(tag => tag !== PROFILE_CACHE).map(tag => caches.delete(tag))
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(cacheFirst(e.request))
})

async function cacheFirst(req) {
    const result = await caches.match(req)

    return result ?? await fetch(req)
}