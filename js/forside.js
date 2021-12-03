(async () => {
    if (window.location.href.includes("forside")) {

        const skema = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(2)");
        const undervisning = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(1)");
        const forsideBoks = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(1)")
        const copiedSkema = skema.cloneNode(true);
        const copiedUndervisning = undervisning.cloneNode(true);
        undervisning.remove();
        forsideBoks.classList.add("forsideBoks");
        forsideBoks.appendChild(skema);
        forsideBoks.appendChild(copiedUndervisning);

    }
})()