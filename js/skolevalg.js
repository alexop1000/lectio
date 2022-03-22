(async () => {
    if (window.location.href == "https://www.lectio.dk/") {
        let lectioLogo = await first("tbody tr td img")

        var newLectioLogo = new Image(333, 105);
        
        newLectioLogo.src = browser.runtime.getURL('images/lectio_logo.png');
        lectioLogo.parentElement.appendChild(newLectioLogo);
        lectioLogo.style.display = "none";
    }
})()