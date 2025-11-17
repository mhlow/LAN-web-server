export type QuizQuestion = {
    id: number;
    question: string;
    options: string[];
    time: number;
    correctAnswerIndex: number;
};

export type QuestionInfo = {
    id: number;
    question: string;
    options: string[];
    time: number;
};