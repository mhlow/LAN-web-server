import Image1 from '../../../assets/quiz_images/image1.png';
import Integral from '../../../assets/quiz_images/integral.png';
import Stevie from '../../../assets/quiz_images/Stevie.jpg';

function QuizQuestion({ questionText, imagePath, answer }: { questionText: string, imagePath?: string, answer?: string }) {
    let image = undefined;
    if (imagePath === 'integral.png') {
        image = Integral;
    } else if (imagePath === 'image1.png') {
        image = Image1;
    } else if (imagePath === 'Stevie.jpg') {
        image = Stevie;
    }

    const valid = questionText.length > 0;
    if (!valid) {
        return (<div>Invalid question data.</div>);
    }
    console.log("QuizQuestion imagePath:", imagePath);
    if (answer && answer === '1') {
        console.log("Rendering answer view");
        return (
            <div className="grow flex flex-col">
                <div className={"flex-1 p-8 flex flex-col bg-amber-100"}>
                    <b className='text-5xl text-stone-950'>{questionText}</b>
                    {imagePath && (
                        <div className="mt-4 flex justify-center">
                            <img src={image} alt="Quiz related" className="max-h-96 rounded shadow-md" />
                        </div>
                    )}
                    <b className='text-3xl text-stone-950 mt-8'>Answer NOW YOU MFS</b>
                </div>
            </div>
        );
    }

    return (
        <div className="grow flex flex-col">
            <div className={"flex-1 p-8 flex flex-col bg-amber-100"}>
                <b className='text-5xl text-stone-950'>{questionText}</b>
                {imagePath && (
                    <div className="mt-4 flex justify-center">
                        <img src={image} alt="Quiz related" className="max-h-96 rounded shadow-md" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizQuestion;