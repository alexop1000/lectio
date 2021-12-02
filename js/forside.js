(async () => {
    if (window.location.href.includes("forside")) {

        const skema = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(2)");
        const undervisning = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(2) section:nth-child(1)");
        const denRigtigeBoks = document.querySelector("#s_m_outerContentFrameDiv div:nth-child(3) div:nth-child(1)")
        const copiedSkema = skema.cloneNode(true);
        const copiedUndervisning = undervisning.cloneNode(true);
        undervisning.remove();
        denRigtigeBoks.classList.add("sejBoks");
        denRigtigeBoks.appendChild(skema);
        denRigtigeBoks.appendChild(copiedUndervisning);
        console.log(window.location.href);

        for (let i = 0; i < 3; i++) {
            
        }



    }
})()