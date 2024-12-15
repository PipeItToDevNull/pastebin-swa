import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './upload';
import Footer from './footer';
import Paste from './paste';

const SITE_NAME = process.env.REACT_APP_SITE_NAME;

function App() {
    return (
        <Router>
            <Helmet>
                <title>{SITE_NAME}</title>
            </Helmet>
            <div id="container">
                <div id="header">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h1 id="site_name">{SITE_NAME}</h1>
                    </Link>
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
