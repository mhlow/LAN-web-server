const express = require('express');
const cors = require('cors');
const fs = require('node:fs');
// Socket stuff
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middlewares
app.use(cors({
    origin: '*'
}));

app.use(express.json());

// --- Socket ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Questions
const QuizStages = ['question', 'answer', 'results'];
let quizQuestionIndex = 0;
let quizStage = QuizStages[0];

function nextStage() {
    const currentStageIndex = QuizStages.indexOf(quizStage);
    if (currentStageIndex < QuizStages.length - 1) {
        quizStage = QuizStages[currentStageIndex + 1];
    } else {
        quizStage = QuizStages[0];
        quizQuestionIndex++;
    }
    io.emit('nextQuestion', { questionIndex: quizQuestionIndex, stage: quizStage });
}

app.post('/api/next-stage', (req, res) => {
    nextStage();
    res.send('Next question emitted');
});

app.post('/api/reset-quiz', (req, res) => {
    quizQuestionIndex = 0;
    quizStage = QuizStages[0];
    io.emit('resetQuiz');
    res.send('Quiz reset emitted');
});

app.get('/api/current-state', (req, res) => {
    res.json({ questionIndex: quizQuestionIndex, stage: quizStage });
});

// --- Routes ---

server.listen(PORT, process.env.IP_ADDRESS, () => {
    console.log(`Server is running on port ${PORT}, all interfaces.`);
});

app.get('/api/', (req, res) => {
    // Create json response
    res.json({ message: 'Hello, world!' });
    
});


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

app.get('/api/quiz-questions', (req, res) => {
    fs.readFile('data/quiz/quiz_questions.json', 'utf8', (err, data) => {
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
