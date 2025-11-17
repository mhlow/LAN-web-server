import { useContext } from 'react';
import { UserContext, type UserContextType } from '../../hooks/UserContext';
import QuizQuestion from './quiz-components/QuizQuestion';
import QuizAnswer from './quiz-components/QuizAnswer';
import QuizAnswered from './quiz-components/QuizAnswered';
import QuizResults from './quiz-components/QuizResults';


function QuizQuestions() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { username }: UserContextType = context;

    if (!username) {
        return (
            <div className="grow flex flex-col">
                <div className="p-4 bg-sky-950 text-slate-50">
                    <h2 className="text-lg font-semibold">Access Denied.</h2>
                </div>
                <div className="flex-1 p-8 flex flex-col bg-amber-50">
                    <p className="text-center text-xl">Please enter a username to access the Quiz.</p>
                    <a href="/quiz-home">Quiz Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="grow flex flex-col">
            <div className="p-4 bg-sky-950 text-slate-50">
                <h2 className="text-lg font-semibold">Welcome to the Quiz Page!</h2>
            </div>
            {/* <QuizQuestion questionText="Where do you see yourself in 5 years time? Why is that?" questionTimer={5} /> */}
            {/* <QuizAnswer questionOptions={["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7", "Option 8"]} /> */}
            {/* <QuizAnswered /> */}
            {/* <QuizResults isCorrect={true} /> */}
        </div>
    );
}

export default QuizQuestions;