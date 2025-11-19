import { useContext } from "react";
import { UserContext } from '../../../hooks/UserContext';

function QuizAnswerMulti({ questionOptions, setNextStage }: { questionOptions: string[]; setNextStage: () => void; }) {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { username } = context;
    const valid = questionOptions.length > 0;
    if (!valid) {
        return (<div>Invalid question data.</div>);
    }

    // Cannot do this dynamically in Tailwind, Tailwind reads FULL class names at build time
    const colours = [
        'bg-red-500 hover:bg-red-600 active:bg-red-700',
        'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
        'bg-green-500 hover:bg-green-600 active:bg-green-700',
        'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
        'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
        'bg-pink-500 hover:bg-pink-600 active:bg-pink-700',
        'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700',
        'bg-gray-500 hover:bg-gray-600 active:bg-gray-700'
    ];

    async function handleAnswer(optionIndex: number) {
        // You can add logic here to submit the answer to the server
        // For example, using fetch to POST the answer
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/submit-quiz-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: optionIndex, username }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit answer');
            }
            setNextStage();
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
        setNextStage();
    }

    return (
        <div className="grow flex flex-col">
            <div className={"flex-1 p-2 flex flex-col bg-amber-50"}>
                <div className="flex-1 grid grid-cols-2 gap-2 items-stretch flex flex-col">
                    {questionOptions.map((option, index) => (
                        <button key={index} className={`flex-1 p-4 ${colours[index % colours.length]} border border-gray-300 rounded text-left`} onClick={() => handleAnswer(index)}>
                            <b className="text-2xl flex justify-center">{option}</b>
                        </button>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default QuizAnswerMulti;