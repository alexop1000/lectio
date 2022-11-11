const contentScripts = {
    alle: { matches: ["^"], css: [] },
    beskeder: { matches: ["/beskeder2.aspx"] },
    forside: { matches: ["/forside.aspx"] },
    karakter: { matches: ["^/grades"] },
    ledige: { matches: ["/ledige"] },
    login: { matches: ["/login.aspx"] },
    opgaver: { matches: ["/OpgaverElev.aspx", "/spoergeskema/spoergeskema_rapport.aspx"] },
    skema: { matches: ["/SkemaNy.aspx"] },
    indstillinger: { matches: ["/lectio_master"] },
}
const isValidPage = (page) => {
    return contentScripts?.[page].matches.some((match) => {
        return new RegExp(match, "i").test(window.location.pathname);
    });
}
const injectCss = (page) => {
    const css = typeof page == "object" && page || contentScripts[page].css;
    if (css) {
        css.forEach((file) => {
            const link = document.createElement("link");
            link.href = chrome.runtime.getURL(file);
            link.type = "text/css";
            link.rel = "stylesheet";
            (document.head || document.documentElement).appendChild(link);
        });
    }
}
const currentPage = Object.keys(contentScripts).find(isValidPage);
Object.keys(contentScripts).forEach(async (page) => {
    if (isValidPage(page) && (self === top || contentScripts[page].all_frames)) {
        pages[page].apply()
        injectCss(page);
    }
});
if (self === top) {
    
    getSetting("Dark Mode").then((enabled) => {
        if (enabled) {
            injectCss(["css/main.css"])
        } else {
            injectCss(["css/normal.css"])
        }
    });
}