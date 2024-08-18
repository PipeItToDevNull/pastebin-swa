// Fetch the README.md file from GitHub
fetch('https://raw.githubusercontent.com/PipeItToDevNull/pastebin-swa/main/Readme.md')
.then(response => response.text())
.then(text => {
    // Remove the first header
    const lines = text.split('\n');
    if (lines[0].startsWith('#')) {
        lines.shift();
    }
    const modifiedText = lines.join('\n');
    
    // Sanitize and render the markdown content
    document.getElementById('content').innerHTML = DOMPurify.sanitize(marked.parse(modifiedText));
});