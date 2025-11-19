import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BackendTest from './pages/BackendTest';
import Home from './pages/Home';
import QuizHome from './pages/quiz/QuizHome';
import QuizQuestions from './pages/quiz/QuizQuestions';
import QuizControls from './pages/admin/QuizControls';
import QuizHost from './pages/admin/QuizHost';
import QuizResults from './pages/admin/QuizResults';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz-home" element={<QuizHome />} />
                <Route path="/quiz" element={<QuizQuestions />} />

                <Route path="/admin/quiz-controls" element={<QuizControls />} />
                <Route path="/admin/quiz-host" element={<QuizHost />} />
                <Route path="/admin/quiz-results" element={<QuizResults />} />
                <Route path="/backend-test" element={<BackendTest />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;