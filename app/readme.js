async function loadReadme() {
    // Fetch the URL from data.json
    const response = await fetch('env.json');
    const data = await response.json();
    const readmeUrl = data.readmeUrl;

    // Fetch the README.md file from the URL
    const readmeResponse = await fetch(readmeUrl);
    const text = await readmeResponse.text();

    // Remove the first header
    const lines = text.split('\n');
    if (lines[0].startsWith('#')) {
        lines.shift();
    }
    const modifiedText = lines.join('\n');
    
    // Sanitize and render the markdown content
    document.getElementById('readme').innerHTML = DOMPurify.sanitize(marked.parse(modifiedText));
}

document.addEventListener('DOMContentLoaded', loadReadme);