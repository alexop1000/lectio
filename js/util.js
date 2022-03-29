const pages = {};
const find = async (selector, num) => {
    const found = document.querySelectorAll(selector);
    if (found.length && found.length > (num || 0)) {
        return num ? found[num] : found;
    }
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const found = document.querySelectorAll(selector);
                    if (found.length && found.length > (num || 0)) {
                        observer.disconnect();
                        resolve(num ? found[num] : found);
                    }
                }
            });
        });
        observer.observe(document, { childList: true, subtree: true });
    });
};

// Get the first element using the find function and a selector string
const first = async (selector, then) => {
    return new Promise(async resolve => {
        const found = await find(selector);
        if (then) then(found[0]);
        resolve(found[0]);
    })
};

const cachedValues = {}
const awaitAction = async (action, key) => { return new Promise(resolve => chrome.runtime.sendMessage({ action: action, key: key }, resolve)) };

const cacheBackend = async (key, toGet, timeout) => {
	return new Promise(async resolve => {
		if (toGet === null) {
			resolve(null)
			return
		}
		cachedValues[key] = {
			time: Date.now() + timeout,
			value: await toGet()
		}
		chrome.runtime.sendMessage({
			action: "cache",
			key: key,
			value: cachedValues[key]
		}, resolve);
	});
}

const getBackend = async (key, toGet, timeout) => {
	return new Promise(async resolve => {
		if (!cachedValues[key]) {
			cachedValues[key] = await awaitAction("get", key);
		}
		if (!toGet && !cachedValues[key]) resolve(null);
		if (!cachedValues[key]) {
			resolve(await cacheBackend(key, toGet, timeout))
			return
		}
		if ((Date.now() - cachedValues[key].time) < timeout) {
			resolve(cachedValues[key].value)
		} else {
			if (!toGet) resolve(null);
			resolve(await cacheBackend(key, toGet, timeout));
		}
	});
}

const getStorage = async(index, callback) => {
    chrome.storage.sync.get(index, callback);
}

const pGetStorage = async (index) => {
    return new Promise(async (resolve, reject) => {
        // const response = await 
        chrome.storage.local.get(index, (result) => {
            resolve(result[index]);
        });
        // if firefox
        // if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
        //    resolve(response[index]);
        // }
    });
}

const localGet = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

const localSet = async (key, value) => {
    chrome.storage.local.set({ [key]: value });
}

const setStorage = async (index, value) => {
    chrome.storage.local.set({ [index]: value });
}

const defaultSettings = {
    "Visuals": {
        "Dark Mode": {
            default: false,
        },
    }
}
const getSetting = async (setting) => {
    return new Promise(async resolve => {
        let storageSettings = await pGetStorage("settings")
        if (!storageSettings) {
            storageSettings = {};
        }
        if (storageSettings[setting] == null) {
            Object.keys(defaultSettings).forEach(async (category) => {
                if (storageSettings?.[category]?.[setting]) resolve(storageSettings[category][setting]);
                if (defaultSettings[category][setting]) resolve(defaultSettings[category][setting].default);
            })
        } else {
            resolve(storageSettings[setting])
        }
    })
}

const setSetting = async (setting, value) => {
    return new Promise(async resolve => {
        let storageSettings = await pGetStorage("settings")
        if (!storageSettings) {
            storageSettings = {};
        }
        storageSettings[setting] = value;
        setStorage("settings", storageSettings)
        resolve(true)
    })
}
//for formatting timers like fricounter, or "ledig"-counter 
const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor(time  / (1000 * 60 * 60) % 24);
    const minutes = Math.floor(time / (1000 * 60) % 60);
    const seconds = Math.floor(time / 1000 % 60);
    let string = "";
    //shows "dage" as "dag" if its value is one
    if (days == 1) {
        string += `${days} dag, `;
    } else if (days > 0) {
        string += `${days} dage, `;
    }

    //shows "timer" as "time" if its value is one
    if (hours == 1) {
        string += `${hours} time`;
    } else if (hours > 0) {
        string += `${hours} timer`;
    } else if (days > 0) {
        string += ` og `;
    }

    //shows "minutter" as "minut" if its value is one
    if (minutes == 1) {
        string += `, ${minutes} minut og `;
    } else if (minutes > 0) {
        string += `, ${minutes} minutter og `;
    } else if (hours > 0||days > 0) {
        string += `, og `;
    }

    //shows "sekunder" as "sekund" if its value is one
    if (seconds == 1) {
        string += `${seconds} sekund`;
    } else {
        string += `${seconds} sekunder`;
    }
    return string;
}
