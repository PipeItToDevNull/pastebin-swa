import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function loadUsage() {
    fetch('USAGE.md')
        .then(response => response.text())
        .then(text => {
            const rawMarkup = marked(text);
            const cleanMarkup = DOMPurify.sanitize(rawMarkup);
            document.getElementById('usage').innerHTML = cleanMarkup;
        });
}
