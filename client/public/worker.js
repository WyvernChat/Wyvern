/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference lib="scripthost" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
const ctx = self

ctx.addEventListener("push", (event) => {
    const payload = event.data?.text() ?? "no payload"
    event.waitUntil(
        ctx.registration.showNotification("Wyvern", {
            body: payload
        })
    )
})

// self.addEventListener("fetch", (event: FetchEvent) => {
//     const url = new URL(event.request.url)
//     console.log(url)
//     if (url.hostname === "wyvern.tkdkid1000.net") return
//     event.respondWith(
//         fetch({
//             ...event.request,
//             url: "https://localhost:3003/proxy/" + event.request.url
//         })
//     )
// })
