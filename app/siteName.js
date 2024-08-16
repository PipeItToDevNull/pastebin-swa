// Set the sitename anywhere required
// this loads the name from env.json
async function fetchSiteName() {
    const response = await fetch('env.json');
    const data = await response.json();
    return data.SITE_NAME;
}

// Set the site name using the returned string
fetchSiteName().then(siteName => {
    document.getElementById('site-name').innerText = siteName;
    document.title = siteName;
});