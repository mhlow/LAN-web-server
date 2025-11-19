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
let quizInProgress = false;

function nextStage() {
    const currentStageIndex = QuizStages.indexOf(quizStage);
    if (currentStageIndex < QuizStages.length - 1) {
        quizStage = QuizStages[currentStageIndex + 1];
    } else {
        quizStage = QuizStages[0];
        quizQuestionIndex++;
        if (quizQuestionIndex >= getTotalQuestions()) {
            io.emit('quizEnded');
            quizInProgress = false;
            quizQuestionIndex = 0;
            quizStage = QuizStages[0];
            return;
        }
    }
    io.emit('nextQuestion', { questionIndex: quizQuestionIndex, stage: quizStage });
}

function getTotalQuestions() {
    const data = fs.readFileSync('data/quiz/quiz_questions.json', 'utf8');
    const questions = JSON.parse(data).questions;
    return questions.length;
}

app.post('/api/start-quiz', (req, res) => {
    console.log('Starting quiz');
    io.emit('startQuiz');
    quizInProgress = true;
    res.send('Start quiz emitted');
});

app.post('/api/stop-quiz', (req, res) => {
    io.emit('stopQuiz');
    quizInProgress = false;
    res.send('Stop quiz emitted');
});

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
    res.json({ questionIndex: quizQuestionIndex, stage: quizStage, inProgress: quizInProgress });
});

app.get('/api/quiz-in-progress', (req, res) => {
    res.send(quizInProgress);
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

app.post('/api/submit-quiz-answer', (req, res) => {
    const answerData = req.body;
    console.log('Received quiz answer:', answerData);
    const questionIndex = quizQuestionIndex;
    // Create file if not exists
    const answersFilePath = `data/user_scores/quiz_answers_q${questionIndex}.json`;
    if (!fs.existsSync(answersFilePath)) {
        fs.writeFileSync(answersFilePath, JSON.stringify([]));
    }
    // Store in the format [{ username: string, answer: any }]
    const existingData = JSON.parse(fs.readFileSync(answersFilePath, 'utf8'));
    // console.log('Existing data:', existingData);
    // Override if username exists
    const existingIndex = existingData.findIndex(entry => entry.username === answerData.username);
    if (existingIndex !== -1) {
        existingData[existingIndex] = answerData;
    } else {
        existingData.push(answerData);
    }
    // console.log('Updated data:', existingData);
    fs.writeFileSync(answersFilePath, JSON.stringify(existingData, null, 2));
    
    res.send('Quiz answer received');
});

app.post('/api/quiz-answers', (req, res) => {
    const questionIndex = quizQuestionIndex;
    const username = req.body.username;
    const answersFilePath = `data/user_scores/quiz_answers_q${questionIndex}.json`;

    const correctAnswer = getCorrectAnswer(questionIndex);
    console.log(username);

    if (!fs.existsSync(answersFilePath)) {
        res.json([]);
        return;
    }
    // If the username exists in the answers file, check if their answer is correct
    const existingData = JSON.parse(fs.readFileSync(answersFilePath, 'utf8'));
    const userEntry = existingData.find(entry => entry.username === username);
    if (userEntry) {
        const isCorrect = userEntry.answer === correctAnswer ? 1 : 0;
        res.send(isCorrect.toString());
    } else {
        res.send('0');
    }
});

function getCorrectAnswer(questionIndex) {
    const answersFilePath = `data/quiz/quiz_questions.json`;
    const data = fs.readFileSync(answersFilePath, 'utf8');
    const questions = JSON.parse(data).questions;
    // Returns the index of the correct answer
    console.log(questions);
    
    const options = questions[questionIndex].options;
    const answer = questions[questionIndex].answer;
    return options.indexOf(answer);
}

// --- Results ---
app.post('/api/quiz-results', (req, res) => {
    const username = req.body.username;
    const totalQuestions = getTotalQuestions();
    let score = 0;
    for (let i = 0; i < totalQuestions; i++) {
        const answersFilePath = `data/user_scores/quiz_answers_q${i}.json`;
        if (!fs.existsSync(answersFilePath)) {
            continue;
        }
        const existingData = JSON.parse(fs.readFileSync(answersFilePath, 'utf8'));
        const userEntry = existingData.find(entry => entry.username === username);
        if (userEntry) {
            const correctAnswer = getCorrectAnswer(i);
            if (userEntry.answer === correctAnswer) {
                score++;
            }
        }
    }
    res.json({ score, totalQuestions });
});

app.get('/api/all-quiz-results', (req, res) => {
    const totalQuestions = getTotalQuestions();
    const userScores = {};
    for (let i = 0; i < totalQuestions; i++) {
        const answersFilePath = `data/user_scores/quiz_answers_q${i}.json`;
        if (!fs.existsSync(answersFilePath)) {
            continue;
        }
        const existingData = JSON.parse(fs.readFileSync(answersFilePath, 'utf8'));
        for (const entry of existingData) {
            if (!userScores[entry.username]) {
                userScores[entry.username] = 0;
            }
            const correctAnswer = getCorrectAnswer(i);
            if (entry.answer === correctAnswer) {
                userScores[entry.username]++;
            }
        }
    }
    res.json(userScores);
});