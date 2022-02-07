
const cache = {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const action = request.action
    if (action == "cache") {
        cache[request.key] = request.value
        console.log("Cached", request.key, request.value)
        sendResponse(cache[request.key].value)
    } else if (action == "get") {
        console.log("Getting", request.key)
        sendResponse(cache[request.key])
    }
    return true;
})

setInterval(() => {
    for (let key in cache) {
        if (cache[key].time < Date.now()) {
            console.log(`Cache expired for ${key}`)
            delete cache[key]
        }
    }
}, 1000)