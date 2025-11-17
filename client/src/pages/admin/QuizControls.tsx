import { useState } from 'react';

function QuizControls() {
    const [currentStage, setCurrentStage] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
    const [inProgress, setInProgress] = useState<boolean | null>(null);

    async function nextSection() {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/next-stage`, { method: 'POST' });
        getCurrentState();
    }

    async function resetQuiz() {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/reset-quiz`, { method: 'POST' });
        getCurrentState();
    }

    async function startQuiz() {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/start-quiz`, { method: 'POST' });
        getCurrentState();
    }

    async function stopQuiz() {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/stop-quiz`, { method: 'POST' });
        getCurrentState();
    }

    async function getCurrentState() {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/current-state`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCurrentQuestion(data.questionIndex);
            setCurrentStage(data.stage);
            setInProgress(data.inProgress);
        } catch (error) {
            console.error('Failed to fetch current state:', error);
        }
    }

    return (
        <div className="grow flex flex-col">
            <div className="p-4 bg-sky-950 text-slate-50">
                <h2 className="text-lg font-semibold">Admin Controls</h2>
            </div>
            <div className="flex-1 p-4 flex flex-col">
                <div className="p-8 flex flex-col bg-amber-300 shadow-md rounded">
                    <div className="text-2xl font-semibold mb-4">
                        {inProgress === null ? 'Loading quiz status...' : inProgress ? 'Quiz In Progress' : 'Quiz Not In Progress'}
                    </div>
                    <div className="mb-4">
                        <b>Current Stage:</b> {currentStage !== null ? currentStage : 'Unknown'}
                    </div>
                    <div>
                        <b>Current Question:</b> {currentQuestion !== null ? currentQuestion : 'Unknown'}
                    </div>
                    <button onClick={getCurrentState} className="my-4 p-4 bg-green-500 hover:bg-green-600 active:bg-green-700 border border-gray-300 rounded text-white">
                        Refresh Stage
                    </button>
                </div>

                <div className="mt-8 flex flex-row bg-amber-100 shadow-md rounded">
                    <button onClick={startQuiz} className=" flex-1 my-4 p-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 border border-gray-300 rounded text-white">
                        Start Quiz
                    </button>
                    <button onClick={stopQuiz} className=" flex-1 my-4 p-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 border border-gray-300 rounded text-white">
                        Stop Quiz
                    </button>
                </div>
                <button onClick={resetQuiz} className="my-4 p-4 bg-red-500 hover:bg-red-600 active:bg-red-700 border border-gray-300 rounded text-white">
                    Reset Quiz
                </button>

                <button onClick={nextSection} className="my-4 p-4 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 border border-gray-300 rounded text-white">
                    Next Stage
                </button>
            </div>
        </div>
    );
}

export default QuizControls;