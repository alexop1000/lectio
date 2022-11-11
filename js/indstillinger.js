pages.indstillinger = (async() => {
	first("#contenttable", async e => {
		e = e.parentElement;
		e.innerHTML = `
		<div class="pageHeader">
			<div id="MainTitle" class="maintitle" role="heading" aria-level="1">Lectio Master</div>
		</div>
		<div class="lectio-master ls-content">
		</div>`;
		document.title = "Lectio Master - Indstillinger";

		// Gå igennem alle default settings
		Object.entries(defaultSettings).forEach(async ([category, settings]) => {
			const categoryDiv = document.createElement("div");
			categoryDiv.classList.add("category");
			categoryDiv.innerHTML = `
			<div class="categoryHeader">
				<h2>${category}</h2>
			</div>
			<div class="lectio-master-category">
			</div>`;

			const categoryBody = categoryDiv.querySelector(".lectio-master-category");

			// Gå igennem alle settings i kategorien
			Object.entries(settings).forEach(async ([setting, settingObj]) => {
				const settingDiv = document.createElement("div");
				settingDiv.classList.add("setting");
				settingDiv.innerHTML = `
				<div class="settingHeader">
					<h3>${setting}</h3>
				</div>
				<div class="settingBody">
				</div>`;

				const settingBody = settingDiv.querySelector(".settingBody");

				// Boolean settings type
				if (typeof settingObj.default == "boolean") {
					const checkbox = document.createElement("input");
					checkbox.type = "checkbox";
					checkbox.checked = await getSetting(setting);
					checkbox.addEventListener("change", async e => {
						setSetting(setting, e.target.checked);
					});
					const description = document.createElement("p");
					description.innerText = settingObj.description;

					settingBody.appendChild(checkbox);
					settingBody.appendChild(description);
				}

				categoryBody.appendChild(settingDiv);
			});

			e.querySelector(".ls-content").appendChild(categoryDiv);	
		})
	})
})