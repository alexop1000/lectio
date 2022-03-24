
for (const category of Object.values(defaultSettings)) {
    for (const setting in category) {
        const nameWithNoSpace = setting.replace(/\s/g, "");
        const settingElement = document.createElement("li");
        settingElement.innerHTML = `
            <input type="checkbox" name="${nameWithNoSpace}" id="${nameWithNoSpace}" checked="checked">
            <label for="${nameWithNoSpace}">${setting}</label>
        `;
        document.querySelector("ul").appendChild(settingElement);
        getSetting(setting).then((result) => {
            document.getElementById(nameWithNoSpace).checked = result;
        })
        document.getElementById(nameWithNoSpace).addEventListener("change", (e) => {
            setSetting(setting, e.target.checked);
        })
    }
}