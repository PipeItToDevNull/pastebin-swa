// Top-level router and page shell for upload and paste views.
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './upload';
import Footer from './footer';
import Paste from './paste';

const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'KittyPost';

// Main app shell with routing between upload and paste views.
const App = () => {
    useEffect(() => {
        document.title = SITE_NAME;
    }, []);

    return (
        <Router>
            <div id="container">
                <div id="header">
                    <h1 id="site_name">
                        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>{SITE_NAME}</a>
                    </h1>
                </div>
                <Routes>
                    <Route path="/:uuid" element={<Paste />} />
                    <Route path="/" element={<Upload />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;