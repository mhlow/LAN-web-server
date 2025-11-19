

function QuizResults({ isCorrect }: { isCorrect: boolean | null; }) {

    return (
        <div className="grow flex flex-col">
            <div className={"flex-1 p-8 flex flex-col " + (isCorrect ? "bg-green-300" : "bg-red-500")}>
                <b className='text-5xl text-stone-950'>{isCorrect ? "Correct!" : "Incorrect!"}</b>
            </div>
        </div>
    );
}

export default QuizResults;