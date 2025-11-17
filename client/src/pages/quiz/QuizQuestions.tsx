import { useState, useContext, useEffect } from 'react';
import { UserContext, type UserContextType } from '../../hooks/UserContext';
import type { QuizQuestion_t } from '../../types/QuizTypes';
import QuizQuestion from './quiz-components/QuizQuestion';
import QuizAnswer from './quiz-components/QuizAnswer';
import QuizAnswered from './quiz-components/QuizAnswered';
import QuizResults from './quiz-components/QuizResults';

import { io, type Socket } from 'socket.io-client';

type QuizStage_t = 'question' | 'answer' | 'answered' | 'results';

function QuizQuestions() {
    // https://www.reddit.com/r/node/comments/rw9h9i/socket_io_multiple_connections_in_react/
    // --- SOCKET SETUP ---
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        if (!socket) {
            setSocket(io(`${import.meta.env.VITE_SERVER_URL}`));
        }
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    // --- SOCKET LISTENERS ---
    useEffect(() => {
        if (!socket) return;

        socket.on("nextQuestion", ({ questionIndex, stage }) => {
            setCurrentQuestionIndex(questionIndex);
            setQuizStage(stage);
            console.log("Received question change to index:", questionIndex, "stage:", stage);
        })

        socket.on("resetQuiz", () => {
            setCurrentQuestionIndex(0);
            setQuizStage('question');
            console.log("Received quiz reset");
        })

        return () => {
            socket.off("nextQuestion");
            socket.off("resetQuiz");
        }
    }, [socket]);


    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { username }: UserContextType = context;

    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion_t[]>([]); // Placeholder for quiz questions state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStage, setQuizStage] = useState<QuizStage_t>('question');



    useEffect(() => {
        // Fetch quiz questions from the server
        async function fetchQuizQuestions() {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz-questions`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setQuizQuestions(data.questions);
                // Convert to array
                let questionsArray: QuizQuestion_t[] = [];
                for (const q of data.questions) {
                    questionsArray.push(q);
                }
            } catch (error) {
                console.error('Failed to fetch quiz questions:', error);
            }
        }

        fetchQuizQuestions();
    }, []);


    if (quizQuestions.length === 0) {
        return (
            <div className="grow flex flex-col">
                <div className="p-4 bg-sky-950 text-slate-50">
                    <h2 className="text-lg font-semibold">Loading Quiz Questions...</h2>
                </div>
            </div>
        );
    }

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
            {
                quizStage === 'question' ? (
                    <QuizQuestion questionText={quizQuestions[currentQuestionIndex].question} />
                ) : quizStage === 'answer' ? (
                    <QuizAnswer questionOptions={quizQuestions[currentQuestionIndex].options} />
                ) : quizStage === 'answered' ? (
                    <QuizAnswered />
                ) : quizStage === 'results' ? (
                    <QuizResults isCorrect={true} />
                ) : (
                    <div>Invalid quiz stage.</div>
                )
            }

            {/* <QuizQuestion questionText={quizQuestions[currentQuestionIndex].question} /> */}
            {/* <QuizAnswer questionOptions={quizQuestions[currentQuestionIndex].options} /> */}
            {/* <QuizAnswered /> */}
            {/* <QuizResults isCorrect={true} /> */}
        </div>
    );
}

export default QuizQuestions;