chrome.storage.local.get(["checked"], (result) => {
    document.getElementById("autologin").checked = result.checked;
})
document.getElementById("autologin").addEventListener("change", (e) => {
    chrome.storage.local.set({ checked: e.target.checked });
})