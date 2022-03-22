


pages.alle = (async () => {

	chrome.storage.local.get(["light"], (result) => {
		if (result.light) document.body.classList.add("light-theme")
	})
	chrome.storage.local.get(["fri"], async (result) => {
		if (result.fri) {
			const fGetXML = async (skoleId, elevId) => {
				const response = await getBackend("skemaEnd", async () => {
					return new Promise(async res2 => {
						var xhttpUrl = "https://www.lectio.dk/lectio/" + skoleId + "/SkemaNy.aspx?type=elev&elevid=" + elevId;
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function () {
							if (this.readyState == 4 && this.status == 200) {
								const skema = xhttp.responseXML.querySelector(".s2skema tbody tr:nth-child(4)");
				
								const currentDate = new Date()
								const currentWeekday = new Date().getDay();
								const skemaDay = skema.querySelector(`td:nth-child(${currentWeekday + 1})`);
								const skemaBlock = skemaDay.querySelector("div");
								let theEnd = new Date();
				
								const lectures = skemaBlock.querySelectorAll(".s2skemabrik:not(.s2cancelled)");
								for (const lecture of lectures) {
									if (parseInt(xhttp.responseXML.querySelector(`.s2dayHeader td:nth-child(` + (currentWeekday + 1) + `)`).innerText.split("/")[0].match(/\d+/g)[0]) !== new Date().getDate()) continue;
									//   const start = lecture.getAttribute("data-additionalinfo").match(/\d+:\d+/)[0]
									const end = lecture.getAttribute("data-additionalinfo").match(/\d+:\d+/g).pop()
									const endTime = new Date(
										currentDate.getFullYear(),
										currentDate.getMonth(),
										currentDate.getDate(),
										end.split(":")[0],
										end.split(":")[1]
									).getTime();
									theEnd = endTime
								}
								res2(theEnd)
							}
						}
						xhttp.open("GET", xhttpUrl, true);
						xhttp.responseType = "document";
						xhttp.send();
					})
				}, 1000 * 60 * 60)
				const headerNav = await first("header[role='banner'] nav");
				headerNav.innerHTML += `<p class="fricount">Du har fri om <strong id="fritid"></strong> <p>`;
				setInterval(() => {
					const timeUntilDate = response - (new Date())
					let htmlToApply = `${Math.floor(timeUntilDate / (1000 * 60 * 60 * 24))} dage, ${Math.floor(timeUntilDate / (1000 * 60 * 60) % 24)} timer og ${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter`;
					if (timeUntilDate < 1000 * 60 * 60 * 24) {
						htmlToApply = `${Math.floor(timeUntilDate / (1000 * 60 * 60))} timer, ${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter og ${Math.floor(timeUntilDate / 1000 % 60)} sekunder`;
					}
					if (timeUntilDate < 1000 * 60 * 60) {
						htmlToApply = `${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter og ${Math.floor(timeUntilDate / 1000 % 60)} sekunder`;
					}
					document.getElementById("fritid").innerText = htmlToApply;
				}, 1000)
			}
		
			const location = window.location.href;
			fGetXML(location?.split("/")?.[4], location?.split("?elevid=")?.[1]?.split("&")[0] ?? location?.split("&elevid=")?.[1]?.split("&")?.[0]);
		}
	})

	chrome.storage.local.get(["antiAFK"], (result) => {
		if (result.antiAFK) {
			setInterval(() => {
				const afkAlert = document.querySelector("div.ui-dialog.ui-corner-all.ui-widget")
				if (afkAlert != null){
					window.location.reload()
				}
			}, 5000)
		}
	})
	first(".lectioToolbar .floatLeft", e => {
		const btn = document.createElement("div")
		btn.classList.add("button")
		btn.innerHTML = `
		<div class="button">
		<a href="/lectio/${window.location.href?.split("/")?.[4]}/ledige" data-role="button" tabindex="0" id="m_kontaktLink">Ledige Lokaler</a></div>
		`
		e.appendChild(btn)
	})
})