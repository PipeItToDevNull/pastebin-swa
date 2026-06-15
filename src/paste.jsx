// Paste page: fetches, interprets, and renders paste content by UUID.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Paste view component that fetches and renders content for the current UUID.
const PastePage = () => {
    const { uuid } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Retrieves paste data and converts markdown to HTML when needed.
        const fetchPasteContent = async () => {
            try {
                const response = await fetch(`/api/download?uuid=${uuid}`);
                const responseContentType = response.headers.get('content-type');

                if (response.ok) {
                    const text = await response.text();
                    if (responseContentType === 'text/html; charset=utf-8') {
                        setContent(DOMPurify.sanitize(text));
                    } else if (responseContentType === 'text/markdown; charset=utf-8') {
                        setContent(DOMPurify.sanitize(marked.parse(text)));
                    } else {
                        setContent(text);
                    }
                } else {
                    const errorMessage = await response.text();
                    setError(`${response.status}: ${errorMessage}`);
                }
            } catch (err) {
                setError(`Fetch Error: ${err.message}`);
            }
        };

        fetchPasteContent();
    }, [uuid]);

    if (error) {
        return (
            <div id="errorBlock">
                <p>{error}</p>
                <img className="errorImage" src="/404.png" alt="404 Error" />
            </div>
        );
    }
    return (
        // skipcq: JS-0440 - content is sanitized with DOMPurify before HTML injection.
        <div id="pasteContent" dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default PastePage;
