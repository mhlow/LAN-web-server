import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BackendTest from './pages/BackendTest';
import Home from './pages/Home';
import QuizHome from './pages/quiz/QuizHome';
import QuizQuestions from './pages/quiz/QuizQuestions';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz-home" element={<QuizHome />} />
                <Route path="/quiz" element={<QuizQuestions />} />

                <Route path="/backend-test" element={<BackendTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;