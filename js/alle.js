(async () => {
    const header = document.querySelector("header[role='banner']");
    header.innerHTML += `<p> Din mor <p>`;

    function fGetXML (skoleId, elevId) {
        var xhttpUrl = "https://www.lectio.dk/lectio/" + skoleId + "/SkemaNy.aspx?type=elev&elevid=" + elevId;
        console.log(xhttpUrl);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            console.log("hahahah0")
          if (this.readyState == 4 && this.status == 200) {
            const skema = xhttp.responseXML.querySelector(".s2skema tbody tr:nth-child(4)");

            const currentDate = new Date()
            const currentWeekday = new Date().getDay();
            const skemaDay = skema.querySelector(`td:nth-child(${currentWeekday + 1})`);
            const skemaBlock = skemaDay.querySelector("div");
            let theEnd = new Date();

            const lectures = skemaBlock.querySelectorAll(".s2skemabrik");
            for (const lecture of lectures){
                if (parseInt( xhttp.responseXML.querySelector(`.s2dayHeader td:nth-child(` + (currentWeekday + 1) + `)`).innerText.split("/")[0].match(/\d+/g)[0]) !== new Date().getDate()) continue;
                const start = lecture.getAttribute("data-additionalinfo").match(/\d+:\d+/)[0]
                const end = lecture.getAttribute("data-additionalinfo").match(/\d+:\d+/g).pop()
                const endTime = new Date(
                    currentDate.getFullYear(), 
                    currentDate.getMonth(), 
                    currentDate.getDate(), 
                    end.split(":")[0], 
                    end.split(":")[1]
                ).getTime();
            }
            
            
          }
        };
        xhttp.open("GET", xhttpUrl, true);
        xhttp.responseType = "document";
        xhttp.send();
      }

    
      fGetXML(681, 42656036028);
})()