const students = [
    { id: 1, name: "Khoa Nguyen" },
    { id: 2, name: "My Tran" },
    { id: 3, name: "Phong Le" },
    { id: 4, name: "Yen Vo" },
    { id: 5, name: "Bao Pham" },
];

const answerKey = [
    { question: 1, correctAnswer: "A", point: 2 },
    { question: 2, correctAnswer: "C", point: 1 },
    { question: 3, correctAnswer: "B", point: 3 },
    { question: 4, correctAnswer: "D", point: 2 },
    { question: 5, correctAnswer: "A", point: 2 },
];

const submissions = [
    {
        studentId: 1,
        submittedAt: "2026-07-10T08:00:00",
        answers: [
            { question: 1, answer: "A" },
            { question: 2, answer: "C" },
            { question: 3, answer: "B" },
            { question: 4, answer: "A" },
            { question: 5, answer: "A" },
        ],
    },
    {
        studentId: 2,
        submittedAt: "2026-07-10T08:05:00",
        answers: [
            { question: 1, answer: "A" },
            { question: 2, answer: "B" },
            { question: 3, answer: "B" },
            { question: 4, answer: "D" },
            { question: 5, answer: "C" },
        ],
    },
    {
        studentId: 3,
        submittedAt: "2026-07-10T07:58:00",
        answers: [
            { question: 1, answer: "A" },
            { question: 2, answer: "C" },
            { question: 3, answer: "B" },
            { question: 4, answer: "D" },
            { question: 5, answer: "A" },
        ],
    },
    {
        studentId: 4,
        submittedAt: "2026-07-10T08:02:00",
        answers: [
            { question: 1, answer: "B" },
            { question: 2, answer: "C" },
        ],
    },
    {
        studentId: 5,
        submittedAt: "2026-07-10T08:01:00",
        answers: [
            { question: 1, answer: "A" },
            { question: 2, answer: "C" },
            { question: 3, answer: "B" },
            { question: 4, answer: "D" },
            { question: 5, answer: "A" },
        ],
    },
];

function gradeExam(students, answerKey, submissions) {
    const rawResults = students.map((student) => {
        const submission = submissions.find(
            (s) =>
                s.studentId === student.id &&
                Object.prototype.hasOwnProperty.call(s, "answers"),
        );

        let score = 0;
        let correctCount = 0;
        const wrongQuestions = [];

        for (const item of answerKey) {
            let studentAnswer = null;

            if (submission) {
                const found = submission.answers.find(
                    (a) => a.question === item.question,
                );
                if (found) studentAnswer = found.answer;
            }

            if (studentAnswer === item.correctAnswer) {
                score += item.point;
                correctCount++;
            } else {
                wrongQuestions.push(item.question);
            }
        }

        wrongQuestions.sort((a, b) => a - b);

        return {
            id: student.id,
            name: student.name,
            score,
            correctCount,
            wrongQuestions,
            _submittedAt: submission ? submission.submittedAt : null,
        };
    });
    const sorted = [...rawResults].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a._submittedAt === null && b._submittedAt === null) return 0;
        if (a._submittedAt === null) return 1;
        if (b._submittedAt === null) return -1;

        return new Date(a._submittedAt) - new Date(b._submittedAt);
    });

    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i].score === sorted[i - 1].score) {
            sorted[i].rank = sorted[i - 1].rank;
        } else {
            sorted[i].rank = i + 1;
        }
    }

    return sorted.map((r) => {
        const finalObj = {};
        const props = {
            id: r.id,
            name: r.name,
            score: r.score,
            correctCount: r.correctCount,
            wrongQuestions: r.wrongQuestions,
            rank: r.rank,
        };

        for (const key of Object.keys(props)) {
            Object.defineProperty(finalObj, key, {
                value: props[key],
                writable: false,
                configurable: false,
                enumerable: true,
            });
        }
        return finalObj;
    });
}

class WrongAnswerIterator {
    constructor(studentResult) {
        this.wrongQuestions = studentResult.wrongQuestions;
    }

    [Symbol.iterator]() {
        const questions = this.wrongQuestions;
        let index = 0;

        return {
            next() {
                if (index < questions.length) {
                    return { value: questions[index++], done: false };
                }
                return { value: undefined, done: true };
            },

            [Symbol.iterator]() {
                return this;
            },
        };
    }
}
