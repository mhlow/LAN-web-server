import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, type UserContextType } from '../../hooks/UserContext';

function QuizHome() {
    const context = useContext(UserContext);
    const navigate = useNavigate();
    if (!context) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { username, login }: UserContextType = context;

    async function handleSubmit(formData: FormData) {
        const formValues = Object.fromEntries(formData.entries());
        console.log('Form submitted with values:', formValues);
        login(formValues.name as string);
        navigate('/quiz');
    }

    console.log('Current user:', username);

    return (
        <div className="grow flex flex-col">
            <div className="p-4 bg-sky-950 text-slate-50">
                <h2 className="text-lg font-semibold">Welcome to the Quiz Page!</h2>
            </div>
            <div className={"flex-1 p-8 flex flex-col" + (username ? ' bg-sky-100' : ' bg-amber-50')}>
                <form className="space-y-4" action={handleSubmit}>
                    <div>
                        <label className="block mb-2 font-medium" htmlFor="name">
                            Input your dog's name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full p-2 border border-gray-300 rounded"
                            autoComplete='off'
                        />

                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default QuizHome;