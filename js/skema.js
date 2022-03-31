function stringToColor(str) {
    // Make string into a number between 0 and 255
    const hash = str.split('').reduce((prevHash, currVal) =>
        ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
    return '#' + ('000000' + hash.toString(16)).slice(-6);
}

// Call a function every time an element with selector is found
const on = async (selector, callback) => {
    const finished = [];
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const found = document.querySelectorAll(selector);
                for (let i = 0; i < found.length; i++) {
                    if (!finished.includes(found[i])) {
                        finished.push(found[i]);
                        callback(found[i], i);
                    }
                }
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });
    find(selector).then((found) => {
        for (let i = 0; i < found.length; i++) {
            if (!finished.includes(found[i])) {
                finished.push(found[i]);
                callback(found[i], i);
            }
        }
    });
};
const hexToRGB = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}
const RGBToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const invertColor = (bg) => {
    bg = parseInt(Number(bg.replace('#', '0x')), 10)
    bg = ~bg
    bg = bg >>> 0
    bg = bg & 0x00ffffff
    bg = '#' + bg.toString(16).padStart(6, "0")

    return bg
}
const lightenDarkenColor = (color, amount) => {
    let colorWithoutHash = color.replace("#", "")
    if (colorWithoutHash.length === 3) {
        colorWithoutHash = colorWithoutHash
            .split("")
            .map(c => `${c}${c}`)
            .join("")
    }

    const getColorChannel = substring => {
        let colorChannel = parseInt(substring, 16) + amount
        colorChannel = Math.max(Math.min(255, colorChannel), 0).toString(16)

        if (colorChannel.length < 2) {
            colorChannel = `0${colorChannel}`
        }

        return colorChannel
    }

    const colorChannelRed = getColorChannel(colorWithoutHash.substring(0, 2))
    const colorChannelGreen = getColorChannel(colorWithoutHash.substring(2, 4))
    const colorChannelBlue = getColorChannel(colorWithoutHash.substring(4, 6))

    return `#${colorChannelRed}${colorChannelGreen}${colorChannelBlue}`
}
pages.skema = (async () => {
    const isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != -1)
    const skema = await first(".s2skema tbody tr:nth-child(4)");
    const currentWeekday = new Date().getDay();
    const skemaFarver = await getSetting("Skema Farver");
    await first(".s2skema tbody tr:nth-child(4) td:nth-child(2)");
    if (skemaFarver) {
        const savedColors = (await localGet("skemaFarver")) || {};
        on(".s2skema tbody tr:nth-child(4) td .s2skemabrik", async (lecture, i) => {
            try {
                // Get "Hold" from the lecture data-additionalinfo attribute
                const hold = lecture.getAttribute("data-additionalinfo").match(/Hold: (.*)/)?.[1];
                const getIndex = () => {
                    return new Promise(resolve => {
                        const all = document.querySelectorAll("#s_m_Content_Content_holdElementLinkList a");
                        [...all].forEach((link, i) => {
                            if (link.textContent.trim() === hold) {
                                resolve(i)
                            } else if (all.length == i + 1) {
                                resolve(20)
                            }
                        });
                    })
                }
                let holdIndex = await getIndex();
                const colored = savedColors[hold] ?? "#fff";
                if(!savedColors[hold]) {
                    const color = RGBToHex((90 + (holdIndex+1) % 5 * 40), (130 + (holdIndex+1) % 3 * 60), (150 + (holdIndex+1) % 2 * 100));
                    // if a lesson already has that color, try again
                    if(Object.values(savedColors).includes(color)) {
                        return;
                    }
                    savedColors[hold] = color;
                    await localSet("skemaFarver", savedColors);
                }
                const darker = lightenDarkenColor(colored, -50);
                //const colored = stringToColor((hold ?? lecture.getAttribute("data-additionalinfo"))?.trim());
                //const darker = `rgb(${parseInt(colored.substr(1, 2), 16) - 50}, ${parseInt(colored.substr(3, 2), 16) - 50}, ${parseInt(colored.substr(5, 2), 16) - 50})`;

                lecture.querySelector(".s2skemabrikInnerContainer").style.backgroundColor = darker;
                lecture.querySelector(".s2skemabrikInnerContainer").classList.add("modulcolor");

                const changed = lecture.querySelector(".s2changed")
                if (changed) {
                    changed.style.color = invertColor(colored);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    const skemaDay = await first(`.s2skema tbody tr:nth-child(4) td:nth-child(${currentWeekday + 1})`);
    const skemaBlock = skemaDay.querySelector("div");
    const lectures = skemaBlock.querySelectorAll(".s2skemabrik");
    const skemaNote = await first(".s2skema tbody tr:nth-child(3)");
    const skemaBar = await first("#s_m_Content_Content_SkemaNyMedNavigation_skemaprintarea");

    var noteToggled = false;
    var div = document.createElement('div');
    div.classList.add("noteBtnDiv");
    div.innerHTML = "<btn id='noteBtn'>Vis Noter</btn>";
    skemaBar.parentElement.querySelector("div:nth-child(1)").appendChild(div);
    document.getElementById("noteBtn").addEventListener("click", toggleNote);
    skemaNote.classList.add("hideSkema");


    function toggleNote() {
        skemaNote.classList.toggle("hideSkema");
        if (noteToggled) {
            div.querySelector("btn").innerText = "Vis Noter";
            noteToggled = false;
        }
        else {
            div.querySelector("btn").innerText = "Skjul Noter";
            noteToggled = true;
        }
    }

    for (const lecture of lectures) {
        if (parseInt(document.querySelector(`.s2dayHeader td:nth-child(` + (currentWeekday + 1) + `)`).innerText.split("/")[0].match(/\d+/g)[0]) !== new Date().getDate()) continue;
        const start = lecture.getAttribute("data-additionalinfo").match(/\d+:\d+/)[0]
        const end = lecture.getAttribute("data-additionalinfo").match(/\d+:\d+/g).pop()
        const currentDate = new Date();
        const startTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            start.split(":")[0],
            start.split(":")[1]
        ).getTime();
        const endTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            end.split(":")[0],
            end.split(":")[1]
        ).getTime();
        const currentTimeElement = document.createElement("div");
        const currentTimePercentage = document.createElement("div");
        currentTimeElement.addEventListener("mouseover", () => {
            currentTimePercentage.style.display = "block";
        });
        currentTimeElement.addEventListener("mouseout", () => {
            currentTimePercentage.style.display = "none";
        });
        currentTimePercentage.style.display = "none";
        const updateLecture = () => {
            // Check if the current time is within the lecture
            let currentTime = new Date();
            if (isFirefox) {
                //currentTime = new Date(currentTime + "-01:00").getTime(); // vintertid
                currentTime = new Date().getTime(); // sommertid
            }
            else {
                currentTime = new Date().getTime();
            }
            if (currentTime >= startTime && currentTime <= endTime) {
                // Make a line that is at the current time between the start and end time. The start time being the top of the "lecture" element and the end time being the bottom.
                const lectureWidth = lecture.offsetWidth;
                const lectureHeight = lecture.offsetHeight;
                const lectureTop = lecture.offsetTop;
                const lectureLeft = lecture.offsetLeft;
                const currentTimeTop = lectureTop + ((currentTime - startTime) / (endTime - startTime)) * lectureHeight;
                currentTimeElement.style.width = `${lectureWidth}px`;
                currentTimeElement.style.height = `3px`;
                currentTimeElement.style.top = `${currentTimeTop}px`;
                currentTimeElement.style.left = `${lectureLeft}px`;
                currentTimeElement.style.backgroundColor = "red";
                currentTimeElement.style.position = "absolute";
                currentTimeElement.style.zIndex = "2";
                currentTimeElement.style.opacity = "0.8";
                currentTimeElement.style.display = "block";
                skemaBlock.appendChild(currentTimeElement);
                // On hover show % done
                currentTimePercentage.style.width = `${lectureWidth}px`;
                currentTimePercentage.style.height = `${lectureHeight}px`;
                currentTimePercentage.style.top = `${lectureTop}px`;
                currentTimePercentage.style.left = `${lectureLeft}px`;
                currentTimePercentage.style.backgroundColor = "red";
                currentTimePercentage.style.position = "absolute";
                currentTimePercentage.style.zIndex = "1";
                currentTimePercentage.style.opacity = "0.8";
                currentTimePercentage.style.color = "white";
                currentTimePercentage.style.fontSize = "1.5em";
                currentTimePercentage.style.textAlign = "center";
                currentTimePercentage.innerHTML = `${((currentTime - startTime) / (endTime - startTime) * 100).toFixed(2)}%`;
                skemaBlock.appendChild(currentTimePercentage);
            } else {
                currentTimePercentage.style.display = "none";
                currentTimeElement.style.display = "none";
            }
        }
        updateLecture();
        setInterval(updateLecture, 1000);

    }
})