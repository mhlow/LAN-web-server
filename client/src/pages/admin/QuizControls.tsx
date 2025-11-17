import { useState } from 'react';

function QuizControls() {
    const [currentStage, setCurrentStage] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);

    async function nextSection() {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/next-stage`, { method: 'POST' });
        getCurrentState();
    }

    async function resetQuiz() {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/reset-quiz`, { method: 'POST' });
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