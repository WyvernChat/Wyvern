/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference lib="scripthost" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
const ctx = self

ctx.addEventListener("push", (event) => {
    const payload = event.data?.json()
    if (!payload) return
    event.waitUntil(ctx.registration.showNotification("Wyvern", payload))
})

ctx.addEventListener("notificationclick", (event) => {
    event.preventDefault()
    event.notification.close()
    switch (event.notification.data.type) {
        case "MESSAGE_CREATE": {
            event.waitUntil(
                ctx.clients.matchAll({ type: "window" }).then((clients) => {
                    if (clients.length === 0) {
                        event.waitUntil(
                            ctx.clients.openWindow(
                                `/channels/${event.notification.data.guildId}/${event.notification.data.channelId}`
                            )
                        )
                    } else {
                        /** @type {WindowClient} */
                        const client = clients[0]
                        const regex = new RegExp(
                            String.raw`^\/channels\/${event.notification.data.guildId}\/${event.notification.data.channelId}(?:\/${event.notification.data.messageId})?$`,
                            "gm"
                        )
                        console.log({ url: client.url, regex })
                        if (new URL(client.url).pathname.match(regex))
                            event.waitUntil(client.focus())
                        // client.
                        // client.postMessage("MESSAGE_CREATE", "")
                    }
                })
            )
            break
        }
    }
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
