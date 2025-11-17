

function QuizAnswerMulti({ questionOptions }: { questionOptions: string[] }) {
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

    return (
        <div className="grow flex flex-col">
            <div className={"flex-1 p-2 flex flex-col bg-amber-50"}>
                <div className="flex-1 grid grid-cols-2 gap-2 items-stretch flex flex-col">
                    {questionOptions.map((option, index) => (
                        <button key={index} className={`flex-1 p-4 ${colours[index % colours.length]} border border-gray-300 rounded text-left`}>
                            {option}
                        </button>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default QuizAnswerMulti;