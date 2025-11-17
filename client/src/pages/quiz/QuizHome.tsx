import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, type UserContextType } from '../../hooks/UserContext';
import { io, type Socket } from 'socket.io-client';

function QuizHome() {
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

        socket.on("startQuiz", () => {
            navigate('/quiz');
        })

        return () => {
            socket.off("startQuiz");
        }
    }, [socket]);

    const context = useContext(UserContext);
    const navigate = useNavigate();
    if (!context) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { username, login, logout }: UserContextType = context;

    async function handleSubmit(formData: FormData) {
        const formValues = Object.fromEntries(formData.entries());
        login(formValues.name as string);
    }

    useEffect(() => {
        // Check if quiz is already in progress
        async function checkQuizInProgress() {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz-in-progress`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const inProgress = Number(await response.text());
                if (inProgress) {
                    navigate('/quiz');
                }
            } catch (error) {
                console.error('Failed to check quiz in progress:', error);
            }
        }
        checkQuizInProgress();
    }, [navigate]);

    return (
        <div className="grow flex flex-col">
            <div className="p-4 bg-sky-950 text-slate-50">
                <h2 className="text-lg font-semibold">Welcome to the Quiz Page!</h2>
            </div>
            {username ? (
                <div className="grow mb-4 flex flex-col justify-center items-center bg-amber-100 drop-shadow-md p-4 rounded">
                    <p className="mb-2 text-5xl">Welcome <strong>{username}</strong>.</p>
                    <button
                        className="px-4 py-2 bg-fuchsia-900 text-white rounded hover:bg-fuchsia-600 active:bg-fuchsia-700"
                        onClick={logout}
                    >Logout</button>
                </div>
            ) : (
                <div className={"flex-1 p-8 flex flex-col" + (username ? ' bg-sky-100' : ' bg-amber-50')}>
                    <form className="space-y-4" action={handleSubmit}>
                        <div>
                            <label className="block mb-2 font-medium" htmlFor="name">
                                Give me one word that describes you and one that describes someone else here:
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
            )}
        </div>
    );
}

export default QuizHome;