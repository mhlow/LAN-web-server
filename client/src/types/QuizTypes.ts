export type QuizQuestion_t = {
    id: number;
    question: string;
    options: string[];
    time: number;
    correctAnswerIndex: number;
    image?: string;
};

export type QuestionInfo_t = {
    id: number;
    question: string;
    options: string[];
    time: number;
};