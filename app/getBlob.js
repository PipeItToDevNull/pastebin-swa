window.onload = async function() {
    //console.log("Pathname: ", window.location.pathname); // log the pathname to the console for debug
    const uuid = window.location.pathname.split('/')[1];
    console.log("UUID: ", uuid);
    const response = await fetch(`/api/get/?uuid=${uuid}`);
    console.log(response);

    const contentType = response.headers.get("content-type");
    console.log(contentType)

    if (response.ok) {
        const text = await response.text();
        document.getElementById('blobContent').textContent = text;
    } else {
        const errorMessage = await response.text();
        document.getElementById('blobContent').textContent = `API Error ${response.status}`;
    }
};