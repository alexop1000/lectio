const formatTime = (time) => {
    const hours = Math.floor(time  / (1000 * 60 * 60));
    const minutes = Math.floor(time / (1000 * 60) % 60);
    const seconds = Math.floor(time / 1000 % 60);
    let string = "";
    if (hours > 0) string += `${hours} time(r), `;
    if (minutes > 0) string += `${minutes} minutter og `;
    string += `${seconds} sekunder`;
    return string;
}
pages.ledige = (async () => {
    const skoleTal = window.location.href?.split("/")?.[4]
    if (!skoleTal) return;
    const fGetXML = async (xhttpUrl) => {
        return new Promise(async res => {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    res(xhttp.responseXML)
                }
            }
            xhttp.open("GET", xhttpUrl, true);
            xhttp.responseType = "document";
            xhttp.send();
        })
    }
    fGetXML("https://www.lectio.dk/lectio/" + skoleTal + "/FindSkema.aspx?type=lokale").then(async xml => {
        const lokaler = [...xml.querySelector(".ls-columnlist").childNodes].map(e => [e.textContent, e.firstChild.href])
        const ledigeholder = document.createElement("section")
        ledigeholder.className = "island  mediumBlock mediumBlockHeight"
        ledigeholder.innerHTML = `
            <div role="heading" class="islandHeaderContainer">
                <span class="islandHeader">Ledige Lokaler</span>
            </div>
            <div id="s_m_Content_Content_skemaIsland_pa" class="islandContent">
                
            </div>
        `
        document.querySelector("#m_outerContentFrameDiv").innerHTML = ``
        document.querySelector("#m_outerContentFrameDiv").appendChild(ledigeholder)
        let i = 0
        for (const [name, skemaLink] of lokaler) {
            const allowedEmojis = ["🔵","🟣","🔴","🟡","🟢","🟠"]
            if (!allowedEmojis.some(e => name.includes(e))) continue;
            const lokaleSkema = await fGetXML(skemaLink);
            const currentWeekday = new Date().getDay();
            const skemaDay = lokaleSkema.querySelector(`.s2skema tbody tr:nth-child(4) td:nth-child(${currentWeekday + 1})`);
            const skemaBlock = skemaDay.querySelector("div");
            const lectures = skemaBlock.querySelectorAll(".s2skemabrik");
            let ledigt = true;
            let nextOccupied = false;
            for (const lecture of lectures) {
                if (parseInt(lokaleSkema.querySelector(`.s2dayHeader td:nth-child(` + (currentWeekday + 1) + `)`).innerText.split("/")[0].match(/\d+/g)[0]) !== new Date().getDate()) continue;
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
                // Check if next lecture is occupied
                if (startTime > currentDate.getTime() && typeof(nextOccupied) == "boolean") {
                    nextOccupied = startTime;
                }
                // Check if current time is within start and end time
                if (startTime <= currentDate.getTime() && currentDate.getTime() <= endTime) {
                    ledigt = false;
                    break;
                }
            }
            if (!ledigt) continue;
            let newI = i++
            ledigeholder.querySelector(".islandContent").innerHTML +=`
            <div style="padding-left: 0.5em" role="heading" aria-level="4" id="content-${newI}">
                <a href="${skemaLink}" class="s2skemabrik s2bgbox s2brik lec-context-menu-instance" style="word-wrap:break-word;" title="">
                    <div class="s2skemabrikInnerContainer">
                        <div class="s2skemabrikcontent">${name} ${nextOccupied ? "<strong>- Optaget om " + formatTime(nextOccupied - Date.now())+"</strong>" : ""}</div>
                    </div>
                </a>
            </div>`
            if (nextOccupied) {
                setInterval(() => {
                    const nextOccupiedElement = document.querySelector(`#content-${newI} strong`)
                    nextOccupiedElement.textContent = `- Optaget om ${formatTime(nextOccupied - Date.now())}`
                }, 1000)
            }

        }
    })
})
