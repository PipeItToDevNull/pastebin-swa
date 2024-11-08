import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';

const PastePage = () => {
    const { uuid } = useParams();
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlobContent = async () => {
            try {
                const response = await fetch(`/api/get/?uuid=${uuid}`);
                const contentType = response.headers.get("content-type");
                setContentType(contentType);

                if (response.ok) {
                    const text = await response.text();
                    if (contentType === 'text/html; charset=utf-8') {
                        setContent(text);
                    } else if (contentType === 'text/markdown; charset=utf-8') {
                        setContent(marked.parse(text));
                    } else {
                        setContent(text);
                    }
                } else {
                    const errorMessage = await response.text();
                    setError(`API Error ${response.status}: ${errorMessage}`);
                }
            } catch (error) {
                setError(`Fetch Error: ${error.message}`);
            }
        };

        fetchBlobContent();
    }, [uuid]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id="blobContent" dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default PastePage;
