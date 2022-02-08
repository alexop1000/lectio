chrome.storage.local.get(["checked"], (result) => {
    document.getElementById("autologin").checked = result.checked;
})
chrome.storage.local.get(["light"], (result) => {
    document.getElementById("light").checked = result.light;
})
chrome.storage.local.get(["fri"], (result) => {
    document.getElementById("fri").checked = result.fri;
})
chrome.storage.local.get(["antiAFK"], (result) => {
    document.getElementById("antiAFK").checked = result.antiAFK;
})
document.getElementById("autologin").addEventListener("change", (e) => {
    chrome.storage.local.set({ checked: e.target.checked });
})
document.getElementById("light").addEventListener("change", (e) => {
    chrome.storage.local.set({ light: e.target.checked });
})
document.getElementById("fri").addEventListener("change", (e) => {
    chrome.storage.local.set({ fri: e.target.checked });
})
document.getElementById("antiAFK").addEventListener("change", (e) => {
    chrome.storage.local.set({ antiAFK: e.target.checked });
})