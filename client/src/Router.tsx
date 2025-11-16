import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import BackendTest from './pages/BackendTest';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/backend-test" element={<BackendTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;