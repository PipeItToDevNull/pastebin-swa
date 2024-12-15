import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
    const [content, setContent] = useState('');

    const upload = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/upload', { content });
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