chrome.storage.local.get(["checked"], (result) => {
    document.getElementById("autologin").checked = result.checked;
})
chrome.storage.local.get(["light"], (result) => {
    document.getElementById("light").checked = result.light;
})
document.getElementById("autologin").addEventListener("change", (e) => {
    chrome.storage.local.set({ checked: e.target.checked });
})
document.getElementById("light").addEventListener("change", (e) => {
    chrome.storage.local.set({ light: e.target.checked });
})