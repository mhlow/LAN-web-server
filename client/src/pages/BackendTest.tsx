import { useState } from "react";

function BackendTest() {
    const [backendGetResponse, setBackendGetResponse] = useState<string | null>();
    const [backendPostResponse, setBackendPostResponse] = useState<string>("");
    // const [postData, setPostData] = useState<string>("");

    async function handleTestBackend() {
        // Function to test backend connectivity
        console.log('Testing backend connectivity...');
        try {
            // const response = await fetch('https://api.codetabs.com/v1/proxy?quest=http://localhost:3000/file');
            // https://codetabs.com/cors-proxy/cors-proxy.html
            // Bypass some ad blocker stuff with a CORS proxy
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/file`);
            setBackendGetResponse("a");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type') || '';

            let data: any;

            if (contentType.includes('application/json')) {
                data = await response.json(); // read once as JSON
            } else {
                const text = await response.text(); // read once as text
                // try to parse if it looks like JSON, otherwise keep text
                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }
            }
            console.log('Backend response received:', data);
            setBackendGetResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setBackendGetResponse(`Error: Backend Test error: ${(error as Error).message}`);
        }
    }

    async function writeToBackend(formData: FormData) {
        // Function to write data to backend
        // console.log('Writing data to backend...');
        const formValues = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/write`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Read the response body as text and update state with a string
            const text = await response.text();
            setBackendPostResponse(text);
        } catch (error) {
            setBackendPostResponse(`Error: Backend Write error: ${(error as Error).message}`);
        }
    }


    return (
        <div className="grow bg-green-100">
            <h1>Backend Test Page</h1>
            <p>This page is used to test backend connectivity.</p>

            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700" onClick={handleTestBackend}>
                Test Backend
            </button>
            {backendGetResponse && (
                <div className="mt-4 p-4 bg-white border border-gray-300 rounded">
                    <h2 className="text-lg font-semibold mb-2">Backend Response:</h2>
                    <pre>{backendGetResponse}</pre>
                </div>
            )}

            <div className="mt-8 p-4 bg-yellow-100">
                <form action={writeToBackend}>
                    <h2 className="text-lg font-semibold mb-2">Write Data to Backend</h2>
                    <div className="mb-4">
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={4}
                            placeholder="Enter data to send to backend..."
                            name="textareaData"
                            id="textareaData"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700"
                    >
                        Send to Backend
                    </button>
                </form>
                {backendPostResponse && (
                    <div className="mt-4 p-4 bg-white border border-gray-300 rounded">
                        <h2 className="text-lg font-semibold mb-2">Backend POST Response:</h2>
                        <pre>{backendPostResponse}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BackendTest;