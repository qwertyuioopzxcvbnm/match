/* eslint-disable react-hooks/exhaustive-deps */
import QuestionLayout from "../components/QuestionLayout";
import { useEffect, useState } from "react";
import Errors from "../components/Errors";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function QuestionPage() {
    const params = useParams()
    const navigate = useNavigate();

    const questionNumber = parseInt(params.q)
    const questions = useSelector((e) => e.questions)

    const question = questions[questionNumber]    

    const questionResponse = useSelector((e) => e.questionResponses[question?.id])
    const [errors, setErrors] = useState([])
    const [choice, setChoice] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        if (questions.length === 0 || questionNumber > questions.length) {
            return navigate('/')
        }
        setChoice(questionResponse);
        dispatch({
            type: 'set-progress',
            value: Math.round(((questionNumber + 1) / questions.length) * 100)
        })
    }, [params])

    useEffect(() => {
        if (question !== undefined) {
            dispatch({
                type: 'add-answer',
                id: question.id,
                value: choice
            })
        }
    }, [choice])

    function nextPage() {
        const newErrors = []
        if (typeof choice != 'number') {
            newErrors.push("You need to select an answer choice")
        }
        setErrors(newErrors)
        if (newErrors.length === 0) {
            if (questions.length <= questionNumber + 1) {
                setChoice('')
                navigate('/finished')
            } else {
                setChoice('')
                navigate(`/question/${questionNumber + 1}`)
            }
        }
    }    

    function lastPage() {
        if (questionNumber - 1 < 0) {
            navigate('/looking-for')
        } else {
            navigate(`/question/${questionNumber - 1}`)
        }
    }


    return <QuestionLayout next={nextPage} back={lastPage}>
        {errors.length > 0 ? <Errors errors={errors} /> : null}
        <div className="w-11/12 self-center mt-5">
            <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-pink-500 flex items-center justify-center shrink-0">
                    <p className="text-white text-2xl">{questionNumber + 1}</p>
                </div>
                <p className="text-xl ml-2">{question?.title}</p>
            </div>
            {question?.responses.map(r => <QuestionAnswer key={r.id} text={r.title} selected={choice === r.id} onClick={() => setChoice(r.id)}/>)}
        </div>
    </QuestionLayout>
}

function QuestionAnswer({text, selected, onClick}) {
    return <div onClick={onClick} className={`text-lg box-border transition p-2 border-2 rounded-lg border-gray-300 mb-2 w-full cursor-pointer ${selected ? "border-pink-500" : null}`}>
        <p>{text}</p>
    </div>
}