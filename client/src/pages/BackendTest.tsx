import { useState } from "react";

function BackendTest() {
    const [backendResponse, setBackendResponse] = useState<string | null>();

    async function handleTestBackend() {
        // Function to test backend connectivity
        console.log('Testing backend connectivity...');
        try {
            // const response = await fetch('https://api.codetabs.com/v1/proxy?quest=http://localhost:3000/file');
            // https://codetabs.com/cors-proxy/cors-proxy.html
            // Bypass some ad blocker stuff with a CORS proxy
            console.log('Fetching from backend URL:', `${import.meta.env.VITE_SERVER_URL}/api/file`);
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/file`);
            setBackendResponse("a");
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
            setBackendResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setBackendResponse(`Error: Backend Test error: ${(error as Error).message}`);
        }
    }


    return (
        <div className="grow bg-green-100">
            <h1>Backend Test Page</h1>
            <p>This page is used to test backend connectivity.</p>

            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700" onClick={handleTestBackend}>
                Test Backend
            </button>
            {backendResponse && (
                <div className="mt-4 p-4 bg-white border border-gray-300 rounded">
                    <h2 className="text-lg font-semibold mb-2">Backend Response:</h2>
                    <pre>{backendResponse}</pre>
                </div>
            )}
        </div>
    );
}

export default BackendTest;