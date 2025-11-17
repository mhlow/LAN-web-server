

function QuizQuestion({ questionText, questionTimer }: { questionText: string, questionTimer: number }) {
    const valid = questionText.length > 0 && questionTimer > 0;
    if (!valid) {
        return (<div>Invalid question data.</div>);
    }

    return (
        <div className="grow flex flex-col">
            <div className={"flex-1 p-8 flex flex-col bg-amber-100"}>
                <b className='text-5xl text-stone-950'>{questionText}</b>
            </div>
        </div>
    );
}

export default QuizQuestion;