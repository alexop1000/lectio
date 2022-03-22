pages.forside = (async () => {
    const skema = await first("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(2)");
    const undervisning = await first("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(1)");
    const forsideBoks = await first("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(1)");

    forsideBoks.classList.remove("forsideZoomed");
    forsideBoks.classList.add("forsideBoks");

    undervisning.remove();
    skema.remove();
    forsideBoks.appendChild(skema);
    forsideBoks.appendChild(undervisning);

})