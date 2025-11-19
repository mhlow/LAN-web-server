import { useState, useEffect } from "react";

type ResultEntry_t = {
    username: string;
    score: number;
};

function QuizResults() {
    const [results, setResults] = useState<ResultEntry_t[] | null>(null);
    useEffect(() => {
        async function fetchResults() {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/all-quiz-results`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // console.log("Quiz results data:", data);
                // Sort and turn to array based on score
                // Current format is object with username as key and score as value
                let temp = [];
                for (const [username, score] of Object.entries(data)) {
                    temp.push({ username, score: score as number });
                }
                temp.sort((a, b) => b.score - a.score);
                setResults(temp);
                console.log("Sorted quiz results:", temp);
            } catch (error) {
                console.error('Failed to fetch quiz results:', error);
            }
        }

        fetchResults();
    }, []);
    
    

    return (
        <div className="grow flex flex-col bg-orange-600">
            <div className="flex-1 p-8 flex flex-col">
                <b className='text-5xl text-stone-950'>Hahdfgaafhdgadfhas</b>
                <div className="mt-8">
                    {results === null ? (
                        <div>Loading results...</div>
                    ) : (
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((entry, index) => (
                                    <tr key={entry.username} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{entry.username}</td>
                                        <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuizResults;