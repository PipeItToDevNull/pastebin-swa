// Pull the README_URL variable from env.json
fetch('env.json')
.then(response => response.json())
.then(data => {
    const readmeUrl = data.README_URL;
    return fetch(readmeUrl);
})
.then(response => response.text())
.then(text => {
    // Remove the first header
    const lines = text.split('\n');
    if (lines[0].startsWith('#')) {
        lines.shift();
    }
    const modifiedText = lines.join('\n');

    // Sanitize and render the markdown content
    document.getElementById('readme').innerHTML = DOMPurify.sanitize(marked.parse(modifiedText));
})
.catch(error => console.error('Error loading README:', error));