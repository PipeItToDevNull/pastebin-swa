window.onload = async function() {
    const uuid = window.location.pathname.split('/')[1];
    console.log("UUID: ", uuid);
    const response = await fetch(`/api/get/?uuid=${uuid}`);
    console.log(response);

    const contentType = response.headers.get("content-type");
    console.log(contentType);

    if (response.ok) {
        if (contentType === 'text/html') {
            const html = await response.text();
            document.getElementById('blobContent').innerHTML = html;
        } else {
            const text = await response.text();
            document.getElementById('blobContent').textContent = text;
        }
    } else {
        const errorMessage = await response.text();
        document.getElementById('blobContent').textContent = `API Error ${response.status}: ${errorMessage}`;
    }
};
