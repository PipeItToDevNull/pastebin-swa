window.onload = async function() {
    const uuid = window.location.pathname.split('/')[1];
    console.log("UUID: ", uuid);

    const response = await fetch(`/api/get/?uuid=${uuid}`);
    console.log(response);

    const contentType = response.headers.get("content-type");
    console.log("Content Type: ", contentType);

    if (response.ok) {
        const text = await response.text();
        if (contentType === 'text/html; charset=utf-8') {
            console.log("Rendering: HTML");
            document.getElementById('blobContent').innerHTML = txt;
        } else if (contentType === 'text/markdown; charset=utf-8') {
            console.log("Rendering: Markdown");
            const html = marked(text);
            document.getElementById('blobContent').innerHTML = html;
        } else {
            console.log("Rendering: Plain text");
            document.getElementById('blobContent').textContent = text;
        }
    } else {
        const errorMessage = await response.text();
        document.getElementById('blobContent').textContent = `API Error ${response.status}: ${errorMessage}`;
    }
};
