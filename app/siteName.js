// Set the sitename anywhere required
// this loads the name from env.json
async function fetchSiteName() {
    const response = await fetch('env.json');
    const data = await response.json();
    return data.SITE_NAME;
}

async function fetchSiteNameAndSet() {
    await new Promise(resolve => {
        const checkHeaderLoaded = setInterval(() => {
            if (document.getElementById('site-name')) {
                clearInterval(checkHeaderLoaded);
                resolve();
            }
        }, 100);
    });

    const siteName = await fetchSiteName();
    document.getElementById('site-name').innerText = siteName;
    document.title = siteName;
}
