// Upload page: sends textarea content to the API and redirects to the paste URL.
import { useState, useCallback } from 'react';

// Upload page component with textarea state and submit behavior.
const Upload = () => {
    const [content, setContent] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Keeps textarea state synchronized with user input.
    const handleChange = useCallback((e) => {
        setContent(e.target.value);
    }, []);

    // Sends paste content to the API and redirects to the returned URL.
    const upload = useCallback(async (e) => {
        e.preventDefault();
        // Check if the content is empty
        if (!content.trim()) {
            alert('The text box is empty. Please enter some content before pasting.');
            return;
        }
        setIsUploading(true);
        try {
            const response = await fetch('/api/upload', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/markdown',
                },
                body: content,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const uploadUrl = await response.text();

            // Redirect to the URL returned by the API
            window.location.href = uploadUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            setIsUploading(false); // Re-enable button if there's an error
        }
    }, [content]);

    return (
        <div id="uploadBlock">
            <form onSubmit={upload}>
                <textarea
                    className="textarea"
                    value={content}
                    onChange={handleChange}
                    placeholder="Enter your markdown content here..."
                    rows={Math.max(10, content.split('\n').length)}
                />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Paste'}
                </button>
            </form>
        </div>
    );
};

export default Upload;