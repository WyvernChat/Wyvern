/// <reference lib="webworker" />

const sw = this as unknown as ServiceWorkerGlobalScope & typeof globalThis

sw.addEventListener("install", async (event) => {})
