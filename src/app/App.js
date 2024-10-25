import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { loadUsage } from './usage';
import Footer from './footer';
import Paste from './paste';

const SITE_NAME = process.env.REACT_APP_SITE_NAME;

function App() {
    useEffect(() => {
        loadUsage();
    }, []);

    return (
        <Router>
            <Helmet>
                <title>{SITE_NAME}</title>
            </Helmet>
            <div id="container">
                <div id="header">
                    <h1 id="site_name">{SITE_NAME}</h1>
                </div>
                <Routes>
                    <Route path="/paste/:uuid" element={<Paste />} />
                    <Route path="/" element={<div id="usage">Loading...</div>} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
