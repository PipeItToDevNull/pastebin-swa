// Set the sitename anywhere required
// this loads the name from env.json
document.addEventListener('DOMContentLoaded', async () => {
    async function fetchSiteName() {
        const response = await fetch('env.json');
        const data = await response.json();
        return data.SITE_NAME;
    }

    fetchSiteName().then(siteName => {
        document.getElementById('site-name').innerText = siteName;
        document.title = siteName;
    });
});