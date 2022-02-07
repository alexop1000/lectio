function stringToColor(str) {
    // Make string into a number between 0 and 255
    const hash = str.split('').reduce((prevHash, currVal) =>
        ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
    return '#' + ('000000' + hash.toString(16)).slice(-6);

}



(async () => {
    if (window.location.pathname.includes("SkemaNy")) {
        const isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != -1)
        const skema = document.querySelector(".s2skema tbody tr:nth-child(4)");
        const currentWeekday = new Date().getDay();
        const skemaDay = skema.querySelector(`td:nth-child(${currentWeekday + 1})`);
        const skemaBlock = skemaDay.querySelector("div");
        const lectures = skemaBlock.querySelectorAll(".s2skemabrik");
        const allLectures = skema.querySelectorAll("td")
        const skemaNote = document.querySelector(".s2skema tbody tr:nth-child(3)");
        const skemaBar = document.querySelector("#s_m_Content_Content_SkemaNyMedNavigation_skemaprintarea");
        
        var noteToggled = false ;
        var div = document.createElement('div');
        div.classList.add("noteBtnDiv");
        div.innerHTML = "<btn id='noteBtn'>Vis Noter</btn>";
        skemaBar.parentElement.querySelector("div:nth-child(1)").appendChild(div); 
        document.getElementById("noteBtn").addEventListener("click", toggleNote);
        skemaNote.classList.add("hideSkema");


        function toggleNote() {
            skemaNote.classList.toggle("hideSkema");
            if (noteToggled){
                div.querySelector("btn").innerText = "Vis Noter";
                noteToggled = false;
            }
            else {
                div.querySelector("btn").innerText = "Skjul Noter";
                noteToggled = true;
            }
        } 
        
        for (const td of allLectures) {
            const div = td.querySelector("div");
            const lectureBlock = div.querySelectorAll(".s2skemabrik");
            for (const lecture of lectureBlock) {
                try {
                    // Get "Hold" from the lecture data-additionalinfo attribute
                    const hold = lecture.getAttribute("data-additionalinfo").match(/Hold: (.*)/)?.[1] ?? lecture.getAttribute("data-additionalinfo").match(/Elever: (.*)/)?.[1];
                    const colored = stringToColor(hold.trim().split(" ").join("_"));
                    // Make yellow color darker
                    const darker = `rgb(${parseInt(colored.substr(1, 2), 16) - 50}, ${parseInt(colored.substr(3, 2), 16) - 50}, ${parseInt(colored.substr(5, 2), 16) - 50})`;
                    // Set the background color of the lecture to the color of the hold
                    // and the text color to the darker version of the color
                    lecture.querySelector(".s2skemabrikInnerContainer").style.backgroundColor = darker;
                } catch (error) {
                    console.log(error);
                }
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
                    currentTime = new Date(currentTime + "-01:00").getTime();
                }
                else{
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
    }
})()