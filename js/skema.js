(async () => {
    if (window.location.pathname.includes("SkemaNy")) {
        const skema = document.querySelector(".s2skema tbody tr:nth-child(4)");
        const currentWeekday = new Date().getDay();
        const skemaDay = skema.querySelector(`td:nth-child(${currentWeekday + 1})`);
        const skemaBlock = skemaDay.querySelector("div");
        const lectures = skemaBlock.querySelectorAll(".s2skemabrik");
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
                const currentTime = new Date().getTime();
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