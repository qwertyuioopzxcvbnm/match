import QuestionLayout from "../components/QuestionLayout";
import { useState } from "react";
import Errors from "../components/Errors";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function GradesPage() {
    const values = useSelector((e) => e.userInfo)
    const [errors, setErrors] = useState([])
    const [inGrade, setInGrade] = useState(values.inGrade || '')
    const [desiredGrades, setDesiredGrades] = useState(values.desiredGrades || [])
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function nextPage() {
        const newErrors = []
        if (!/[9,10,11,12]th/.test(inGrade)) {
            newErrors.push("No grade selected")
        }

        if (desiredGrades.length === 0) {
            newErrors.push("No desired grade selected")
        }
        setErrors(newErrors)
        if (newErrors.length === 0) {
            dispatch({
                type: 'add-user-info',
                value: {
                    inGrade,
                    desiredGrades
                }
            })
            navigate('/gender')
        }
    }    

    function lastPage() {
        navigate('/info')
    }

    const hasItem = (item) => desiredGrades.includes(item)

    const swapItem = (item) => () => {
        if (!hasItem(item)) {
            setDesiredGrades([...desiredGrades, item])
        } else {
            setDesiredGrades(desiredGrades.filter(e => e !== item))
        }
    }

    return <QuestionLayout next={nextPage} back={lastPage}>
        <p className="self-center mt-4 text-2xl">Next, </p>
        {errors.length > 0 ? <Errors errors={errors} /> : null}
        <div className="w-11/12 self-center mt-2 flex flex-col">
            <p>What grade are you in?</p>
            <div className="flex mt-2 md:self-center">
                <FourChoice name="9th" selected={inGrade === "9th"} onClick={() => setInGrade("9th")}/>
                <FourChoice name="10th" selected={inGrade === "10th"} onClick={() => setInGrade("10th")}/>
                <FourChoice name="11th" selected={inGrade === "11th"} onClick={() => setInGrade("11th")}/>
                <FourChoice name="12th" selected={inGrade === "12th"} onClick={() => setInGrade("12th")}/>
            </div>
            <p className="mt-3">What grade(s) are you interested in?</p>
            <p className="text-xs">Allows multiple to be selected</p>
            <div className="flex mt-2 md:self-center">
                <FourChoice name="9th" selected={hasItem("9th")} onClick={swapItem("9th")}/>
                <FourChoice name="10th" selected={hasItem("10th")} onClick={swapItem("10th")}/>
                <FourChoice name="11th" selected={hasItem("11th")} onClick={swapItem("11th")}/>
                <FourChoice name="12th" selected={hasItem("12th")} onClick={swapItem("12th")}/>
            </div>
        </div>
    </QuestionLayout>
}

function FourChoice({name, selected, onClick}) {
    return <div onClick={onClick} className={`border-gray-300 ${selected ? "border-pink-500" : null} flex items-center justify-center border-2 rounded-lg four-choice transition mr-1 md:mr-5 cursor-pointer`}>
        <p className="text-3xl">{name}</p>
    </div>;
}
