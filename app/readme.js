// Fetch the README.md file from GitHub
fetch('https://raw.githubusercontent.com/PipeItToDevNull/pastebin-swa/main/Readme.md')
    .then(response => response.text())
    .then(text => {
        const html = marked.parse(text);
        document.getElementById('readme').innerHTML = html;
    });