import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
    const [content, setContent] = useState('');

    const upload = async (e) => {
        e.preventDefault();
        try {
            // Create a Blob with the markdown content and the correct MIME type
            const blob = new Blob([content], { type: 'text/markdown' });

            // Send the blob directly with the correct Content-Type header
            const response = await axios.put('/api/upload', blob, {
                headers: {
                    'Content-Type': 'text/markdown',
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

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
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default Upload;