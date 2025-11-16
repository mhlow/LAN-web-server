import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BackendTest from './pages/BackendTest';
import Home from './pages/Home';
import QuizHome from './pages/quiz/QuizHome';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<QuizHome />} />


                <Route path="/backend-test" element={<BackendTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;