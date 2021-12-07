(async () => {
    if (window.location.href.includes("forside")) {

        const skema = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(2)");
        const undervisning = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(1)");
        const forsideBoks = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(1)");

        if (forsideBoks.clientHeight > 850) {
            forsideBoks.classList.add("forsideZoomed");
            forsideBoks.classList.remove("forsideNonzoomed");
        }
        else {
            forsideBoks.classList.add("forsideNonzoomed");
            forsideBoks.classList.remove("forsideZoomed");
        }
        forsideBoks.classList.add("forsideBoks");

        undervisning.remove();
        skema.remove();
        forsideBoks.appendChild(skema);
        forsideBoks.appendChild(undervisning);
    }
})()