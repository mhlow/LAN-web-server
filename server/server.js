const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.listen(PORT, process.env.IP_ADDRESS, () => {
    console.log(`Server is running on port ${PORT}, all interfaces.`);
});

app.get('/api/', (req, res) => {
    // Create json response
    res.json({ message: 'Hello, world!' });
    
});

const fs = require('node:fs');

app.get('/api/file', (req, res) => {
    fs.readFile('hello.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send('Error parsing JSON');
            return;
        }

        res.send(jsonData);
    });
});

app.post('/api/write', (req, res) => {
    const jsonData = JSON.stringify(req.body, null, 2);
    fs.writeFile('hello.json', jsonData, err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing file');
            return;
        }
        res.send('File written successfully');
    });
});

app.post('/api/submit-user', (req, res) => {
    // implement later
});
