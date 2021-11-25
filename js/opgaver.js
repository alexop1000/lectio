// Function for sorting an HTML table
const sortTable = (table, col, reverse) => {
	const tb = table.tBodies[0];
	const store = [];
	for (let i = 1, len = tb.rows.length; i < len; i++) {
		const row = tb.rows[i];
		const sortnr = new Date(
			(row.cells[col].textContent || row.cells[col].innerText)
				.replace(/^(\d{1,})\/(\d{1,})-(\d{3,}) (\d{1,}):(\d{1,})$/gm, "$2/$1-$3 $4:$5")
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

(async () => {
	if (window.location.href.includes("OpgaverElev")) {
		// Sort the elements in the opgaver table by date with newest first
		sortTable(document.querySelector("table"), 3, true);
		const opgaver = document.querySelectorAll("tr");
		for (const opgave of opgaver) {
			let date = opgave.querySelector("td:nth-child(4)")
			if (!date) continue;
			date = date.innerText;
			const origDate = date;
			// Make the date from dd/mm-yyyy hh:mm to mm/dd-yyyy hh:mm
			date = date.replace(/^(\d{1,})\/(\d{1,})-(\d{3,}) (\d{1,}):(\d{1,})$/gm, "$2/$1-$3 $4:$5");
			const updateCount = () => {
				const timeUntilDate = new Date(date).getTime() - new Date().getTime();
				if (timeUntilDate > 0) {
					let htmlToApply = `\n${Math.floor(timeUntilDate / (1000 * 60 * 60 * 24))} dage, ${Math.floor(timeUntilDate / (1000 * 60 * 60) % 24)} timer og ${Math.floor(timeUntilDate / (1000 * 60) % 60)} minutter`;
					if (timeUntilDate < 1000 * 60 * 60 * 24) {
						htmlToApply = `\n${Math.floor(timeUntilDate / (1000 * 60 * 60))} timer og ${Math.floor(timeUntilDate / 1000 % 60)} sekunder`;
					}
					if (timeUntilDate < 1000 * 60 * 60) {
						htmlToApply = `\n${Math.floor(timeUntilDate / 1000 % 60)} sekunder`;
					}
					// Make it red if the time until date is smaller than 1 day
					if (timeUntilDate < 1000 * 60 * 60 * 24) {
						htmlToApply = `<span style="color: red">${htmlToApply}</span>`;
					}
					// Make it orange if the time until date is smaller than 4 days
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