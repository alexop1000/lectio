pages.beskeder = (async () => {
    if (window.location.href.includes("/beskeder2.aspx")) {
        // const fGetXML = async (skoleId, elevId) => {
        // 	await getBackend("skemaEnd", async () => {
        // 		return new Promise(async res2 => {
        // 			var xhttpUrl = "https://www.lectio.dk/lectio/" + skoleId + "/beskeder2.aspx?type=&elevid=" + elevId + "&selectedfolderid=-70";
        // 			console.log(xhttpUrl);
        // 			var xhttp = new XMLHttpRequest();
        // 			xhttp.onreadystatechange = function() {
        // 				if (this.readyState == 4 && this.status == 200) {
        //                     const doc = xhttp.responseXML;
        //                     const holder = doc.querySelector("#s_m_Content_Content_threadGV_ctl00")
        //                     for (const tr of holder.querySelectorAll("tr")) {
        //                         const sender = tr.querySelector("td:nth-child(6)")
        //                         if (sender?.textContent?.includes?.("(") || !sender) continue;
        //                         const realElement = document.querySelector(`span[title="${sender.firstChild.title}"]:not(.lcm)`)
        //                         realElement.classList.add("lcm")
        //                         realElement.parentElement.nextSibling.firstChild.classList.add("lcm")
        //                         realElement.parentElement.parentElement.querySelector(".buttonlink").firstChild.style = "color:red !important;"
        //                     }
        //                 }
        //             }
        //             xhttp.open("GET", xhttpUrl, true);
        // 			xhttp.responseType = "document";
        //             xhttp.send();
        //         })
        //     })
        // }
        
        // const location = window.location.href;
        // fGetXML(location.split("/")[4], location?.split("?elevid=")?.[1]?.split("&")[0] ?? location.split("&elevid=")[1].split("&")[0]);
        
        // const doc = xhttp.responseXML;
        const holder = await first("#s_m_Content_Content_threadGV_ctl00");
        const clonedRow = holder.cloneNode(true);

        for (const tr of holder.querySelectorAll("tr")) {
            const sender = tr.querySelector("td:nth-child(6)");
            if (sender && sender?.textContent?.includes?.("(")) {
                const realElement = await first(`span[title="${sender.firstChild.title}"]`);
                realElement.parentElement.parentElement.remove();
            }
        }
        for (const tr of clonedRow.querySelectorAll("tr")) {
            const sender = tr.querySelector("td:nth-child(6)");
            if (sender?.textContent?.includes?.("(") || !sender) continue;
            sender.parentElement.remove();
        }

        const folderLabel = await first("#s_m_Content_Content_MessageFolderLabel")
        if (folderLabel.innerText == "Indbyggede grupper") folderLabel.innerText = "Alle beskeder";
        const originalTekst = folderLabel.innerText
        folderLabel.innerText += " - Elev Beskeder";
        const clonedLabel = folderLabel.parentElement.parentElement.cloneNode(true);
        folderLabel.innerText = originalTekst + " - Lærer Beskeder";
        holder.parentElement.appendChild(clonedLabel);

        clonedRow.querySelector("tbody").firstChild.remove();
        holder.parentElement.appendChild(clonedRow);
        
        //Change name of Indbyggede grupper to Alle beskeder
        const beskedKatagorier = await first("#s_m_Content_Content_ListGridSelectionTree");
        beskedKatagorier.querySelector("div[lec-node-id='-30'] .TreeNode-title").innerText = "Alle beskeder";
    }
})