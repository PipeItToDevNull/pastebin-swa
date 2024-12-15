import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './upload';
import Footer from './footer';
import Paste from './paste';

const SITE_NAME = process.env.REACT_APP_SITE_NAME;

const App = () => (
    <Router>
        <Helmet>
            <title>{SITE_NAME}</title>
        </Helmet>
        <div id="container">
            <div id="header">
                <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1 id="site_name">{SITE_NAME}</h1>
                </a>
            </div>
            <Routes>
                <Route path="/:uuid" element={<Paste />} />
                <Route path="/" element={<Upload />} />
            </Routes>
            <Footer />
        </div>
    </Router>
);

export default App;