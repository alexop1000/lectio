pages.login = (async () => {
    let autoLoginCheckbox = document.createElement("input");
    autoLoginCheckbox.type = "checkbox";
    autoLoginCheckbox.id = "autoLoginCheckbox";
    const autoLoginCheckboxLabel = document.createElement("label");
    autoLoginCheckboxLabel.htmlFor = "autoLoginCheckbox";
    autoLoginCheckboxLabel.innerText = "Auto Login";
    const passBox = (await first("#m_Content_passwordtr")).parentElement
    passBox.insertBefore(autoLoginCheckbox, passBox.querySelector("tr:nth-child(4)"));
    passBox.insertBefore(autoLoginCheckboxLabel, passBox.querySelector("tr:nth-child(5)"));
    const passwordbox = document.getElementById("password");
    const usernamebox = document.getElementById("username");
    // When passwordbox or usernamebox lost focus
    passwordbox.addEventListener("blur", () => {
        if (autoLoginCheckbox.checked) {
            // Save the password in chrome.storage
            chrome.storage.local.set({
                password: passwordbox.value
            }, () => {
                console.log("Password saved");
            });
        }
    })
    usernamebox.addEventListener("blur", () => {
        if (autoLoginCheckbox.checked) {
            // Save the username in chrome.storage
            chrome.storage.local.set({
                username: usernamebox.value
            }, () => {
                console.log("Username saved");
            });
        }
    })
    // When the autoLoginCheckbox is checked also save both username and password
    autoLoginCheckbox.addEventListener("change", () => {
        if (autoLoginCheckbox.checked) {
            chrome.storage.local.set({
                password: passwordbox.value,
                username: usernamebox.value,
                checked: true
            }, () => {
                console.log("Password and username saved");
            });
        } else {
            chrome.storage.local.set({
                checked: false
            }, () => {
                console.log("Auto login unchecked");
            });
        }
    })
    // Get the username and password from chrome.storage
    chrome.storage.local.get(["username", "password", "checked"], (result) => {
        // If the username and password are not empty
        if (result.username && result.password) {
            // Set the username and password
            usernamebox.value = result.username;
            passwordbox.value = result.password;
            // Try logging in by clicking #m_Content_submitbtn2
            if (result.checked) document.getElementById("m_Content_submitbtn2").click();
        }
        // If the autoLoginCheckbox is checked
        if (result.checked) {
            // Check the autoLoginCheckbox
            autoLoginCheckbox.checked = true;
        }
    });
})