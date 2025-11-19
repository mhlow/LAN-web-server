import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import QuizAnswered from '../quiz/quiz-components/QuizAnswered';
import QuizResults from '../quiz/quiz-components/QuizResults';
import QuizAnswer from '../quiz/quiz-components/QuizAnswer';
import QuizQuestion from '../quiz/quiz-components/QuizQuestion';
import type { QuizQuestion_t } from '../../types/QuizTypes';

type QuizStage_t = 'question' | 'answer' | 'answered' | 'results';

function QuizHost() {
    const navigate = useNavigate();
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
            console.log(stage);
        })

        socket.on("resetQuiz", () => {
            setCurrentQuestionIndex(0);
            setQuizStage('question');
            console.log("Received quiz reset");
        })

        socket.on("startQuiz", () => {
            setQuizInProgress(true);
            console.log("Received quiz started");
        })

        socket.on("stopQuiz", () => {
            setQuizInProgress(false);
            console.log("Received quiz stopped");
        })

        socket.on("quizEnded", () => {
            setQuizInProgress(false);
            navigate('/quiz-home');
        })

        return () => {
            socket.off("nextQuestion");
            socket.off("resetQuiz");
            socket.off("quizStopped");
        }
    }, [socket]);

    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion_t[]>([]); // Placeholder for quiz questions state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStage, setQuizStage] = useState<QuizStage_t>('question');
    const [quizInProgress, setQuizInProgress] = useState<boolean | null>(null);

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
                console.log("ASDF", data.questions);
            } catch (error) {
                console.error('Failed to fetch quiz questions:', error);
            }
        }

        async function fetchCurrentState() {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/current-state`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCurrentQuestionIndex(data.questionIndex);
                setQuizStage(data.stage);
                setQuizInProgress(data.inProgress);
            } catch (error) {
                console.error('Failed to fetch current state:', error);
            }
        }

        fetchQuizQuestions();
        fetchCurrentState();
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

    if (quizInProgress === false) {
        return (
            <div className="grow flex flex-col">
                <div className="p-4 bg-sky-950 text-slate-50">
                    <h2 className="text-lg font-semibold">Quiz Not In Progress.</h2>
                </div>
                <div className="flex-1 p-8 flex flex-col bg-amber-50">
                    <p className="text-center text-xl">The quiz is currently not in progress. Please wait for the admin to start the quiz.</p>
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
                (quizStage === 'question') ? (
                    <QuizQuestion questionText={quizQuestions[currentQuestionIndex].question} imagePath={quizQuestions[currentQuestionIndex].image} />
                ) : (quizStage === 'answer' || quizStage === 'answered') ? (
                    <QuizQuestion questionText={quizQuestions[currentQuestionIndex].question} imagePath={quizQuestions[currentQuestionIndex].image} answer='1' />
                ) : quizStage === 'results' ? (
                    <div className="grow flex flex-col">
                        <div className="flex-1 p-8 flex flex-col">
                            <b className='text-5xl text-stone-950'>Hi guys check if youre correct thanks</b>
                        </div>
                    </div>
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

export default QuizHost;