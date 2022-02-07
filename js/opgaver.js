// Function for sorting an HTML table
const sortTable = (table, col, reverse) => {
	const tb = table.tBodies[0];
	const store = [];
	for (let i = 1, len = tb.rows.length; i < len; i++) {
		const row = tb.rows[i];
		const sortnr = new Date(
			formatDate((row.cells[col].textContent || row.cells[col].innerText)
				)
		).getTime() - new Date().getTime()
		store.push([sortnr, row]);
	}
	store.sort((a, b) => {
		if (a[0] < 0 && b[0] > 0) return -1;
		if (a[0] > 0 && b[0] < 0) return 1;
		if (a[0] < b[0]) return 1;
		if (a[0] > b[0]) return -1;
		return 0;
	});
	if (reverse) {
		store.reverse();
	}
	for (let i = 0, len = store.length; i < len; i++) {
		tb.appendChild(store[i][1]);
	}
	delete store;
}
const formatDate = (date) => {
	//// Formats the date from dd/mm-yyyy hh:mm to yyyy-mm-ddThh:mm:ss+01:00 
	let dateNums = date.replace(/^(\d{1,})\/(\d{1,})-(\d{3,}) (\d{1,}):(\d{1,})$/gm, "$3-$2-$1T$4:$5:00+01:00").split(/([-T])/g);
	if (dateNums[2] < 10){
		dateNums[2] =  "0" + dateNums[2];
	}
	if (dateNums[4] < 10){
		dateNums[4] =  "0" + dateNums[4];
	}
	return dateNums.join("");
} 
(async () => {
	if (window.location.href.includes("/OpgaverElev.aspx") || window.location.href.includes("/spoergeskema/spoergeskema_rapport.aspx")) {
		// Sort the elements in the opgaver table by date with newest first
		sortTable(document.querySelector("table"), 3, true);
		const opgaver = document.querySelectorAll("tr");
		for (const opgave of opgaver) {
			let date = opgave.querySelector("td:nth-child(4)")
			if (!date) continue;
			//makes sure only the text of first child is used
			child = date.firstChild;
			texts = [];
			while (child) {
				if (child.nodeType == 3) {
					texts.push(child.data);
				}
				child = child.nextSibling;
			}
			date = texts.join("");
			

			const origDate = date;
			date = formatDate(date);

			const updateCount = () => {
				const timeUntilDate = new Date(date).getTime() - new Date().getTime();

				if (timeUntilDate > 0) {
					let htmlToApply = `\n${Math.floor(timeUntilDate / (1000 * 60 * 60 * 24))} dage, ${Math.floor(timeUntilDate / (1000 * 60 * 60) % 24)} timer og ${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter`;
					if (timeUntilDate < 1000 * 60 * 60 * 24) {
						htmlToApply = `\n${Math.floor(timeUntilDate / (1000 * 60 * 60))} timer, ${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter og ${Math.floor(timeUntilDate / 1000 % 60)} sekunder`;
					}
					if (timeUntilDate < 1000 * 60 * 60) {
						htmlToApply = `\n${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter og ${Math.floor(timeUntilDate / 1000 % 60)} sekunder`;
					}
					// Make it red if the time until date is less than 1 day
					if (timeUntilDate < 1000 * 60 * 60 * 24) {
						htmlToApply = `<span style="color: red">${htmlToApply}</span>`;
					}
					// Make it orange if the time until date is less than 4 days
					if (timeUntilDate < 1000 * 60 * 60 * 24 * 4) {
						htmlToApply = `<span style="color: orange">${htmlToApply}</span>`;
					} else {
						htmlToApply = `<span style="color: green">${htmlToApply}</span>`;
					}
					opgave.querySelector("td:nth-child(4)").innerHTML = `${origDate}<br>${htmlToApply}`;
				}
			}
			updateCount();
			setInterval(updateCount, 1000);
		}
	}
})()