import clsx from "clsx";
import { useState, useEffect } from "react";

export default function Quiz() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [quizLoaded, setQuizLoaded] = useState(false)
    const [userAnswers, setUserAnswers] = useState({})
    const [score, setScore] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [shuffledAnswers, setShuffledAnswers] = useState({})

    function shuffleAnswers(question) {
        const allAnswers = [
            ...question.incorrect_answers,
            question.correct_answer
        ];

        for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }

        return allAnswers;
    }

    async function checkAnswers(formData) {

        if (submitted) {
            setQuizLoaded(false)
            setLoading(true)
            setUserAnswers({});
            setScore(null);
            setSubmitted(false);
            getQuestions();
            return
        }

        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = value;
        }

        console.log("User answers from FormData:", answers);
        setUserAnswers(answers);

        let correctCount = 0;
        questions.forEach((question, index) => {
            const questionKey = `question-${index}`;
            if (answers[questionKey] === question.correct_answer) {
                correctCount++;
            }
        });

        console.log(correctCount)

        setScore(correctCount);
        setSubmitted(true);
    }

    async function getQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
            const data = await response.json()
            setQuestions(data.results)

            const shuffled = {};
            data.results.forEach((question, index) => {
                shuffled[index] = shuffleAnswers(question);
            });
            setShuffledAnswers(shuffled);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setQuizLoaded(true)
        }
    }

    useEffect(() => {
        getQuestions()
    }, []);

    function getAnswerClasses(questionKey, answer, isCorrect) {
        const isSelected = userAnswers[questionKey] === answer;

        return clsx(
            'answer-option',
            {
                'selected': !submitted && isSelected,

                'correct': submitted && isSelected && isCorrect,
                'incorrect': submitted && isSelected && !isCorrect,

                'show-correct': submitted && !isSelected && isCorrect,

                'disabled': submitted,
            }
        );
    }


    function renderQuestions() {
        if (loading) return <p>Loading questions...</p>;
        if (questions.length === 0) return <p>No questions available.</p>;

        return questions.map((question, index) => {
            const answers = shuffledAnswers[index] || shuffleAnswers(question);
            const questionKey = `question-${index}`;

            return (
                <div className="question-card" key={index}>
                    <h3 dangerouslySetInnerHTML={{ __html: question.question }} />

                    <div className="answers-list">
                        {answers.map((answer, answerIndex) => {
                            const isCorrect = answer === question.correct_answer;
                            const answerClasses = getAnswerClasses(questionKey, answer, isCorrect);

                            return (
                                <div key={answerIndex} className={answerClasses}>
                                    <input
                                        type="radio"
                                        name={questionKey}
                                        id={`q${index}-a${answerIndex}`}
                                        value={answer}
                                        disabled={submitted}
                                        defaultChecked={userAnswers[questionKey] === answer}
                                    />
                                    <label htmlFor={`q${index}-a${answerIndex}`}>
                                        <span dangerouslySetInnerHTML={{ __html: answer }} />
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    }

    return (
        <section className="quiz-section">
            <form action={checkAnswers} className="quiz-form">
                {renderQuestions()}
                {submitted && <p>Your scored {score}/{questions.length} correct answers</p>}
                {quizLoaded && <button>{submitted ? "Play again" : "Check answers"}</button>}
            </form>
        </section>
    );
}