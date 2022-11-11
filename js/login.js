pages.login = (async () => {
    if (!(await getSetting("Auto Login"))) return;
    const passwordbox = await first("#password");
    const usernamebox = await first("#username");
    // When passwordbox or usernamebox lost focus
    passwordbox.addEventListener("blur", () => {
            // Save the password in chrome.storage
            chrome.storage.local.set({
                password: passwordbox.value
            }, () => {
                console.log("Password saved");
            });
    })
    usernamebox.addEventListener("blur", () => {
            // Save the username in chrome.storage
            chrome.storage.local.set({
                username: usernamebox.value
            }, () => {
                console.log("Username saved");
            });
    })
    
    // Get the username and password from chrome.storage
    chrome.storage.local.get(["username", "password"], (result) => {

        // If the username and password are not empty
        if (result.username && result.password) {
            // Set the username and password
            usernamebox.value = result.username;
            passwordbox.value = result.password;
            // Try logging in by clicking #m_Content_submitbtn2
            sleep(500).then(() => {
            document.getElementById("m_Content_submitbtn2").click();
            });
        }
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})