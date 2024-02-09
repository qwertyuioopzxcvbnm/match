import QuestionLayout from "../components/QuestionLayout";
import { useState } from "react";
import Errors from "../components/Errors";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LookingForPage() {
    const values = useSelector((e) => e.userInfo)
    const [errors, setErrors] = useState([])
    const [looking, setLooking] = useState(values.looking || '')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function nextPage() {
        const newErrors = []
        if (!/(Yes|No)/.test(looking)) {
            newErrors.push("No answer selected")
        }

        setErrors(newErrors)
        if (newErrors.length === 0) {
            dispatch({
                type: 'add-user-info',
                value: {
                    looking
                }
            })
            navigate('/question/0')
        }
    }    

    function lastPage() {
        navigate('/gender')
    }

    return <QuestionLayout next={nextPage} back={lastPage}>
        {errors.length > 0 ? <Errors errors={errors} /> : null}
        <div className="w-11/12 self-center mt-2 flex flex-col">
            <p className="text-xl">Are you interested in actually talking with your matches?</p>
            <p className="text-gray-500">This data is private and used to help find a better match</p>
            <div className="flex mt-2 md:self-center">
                <TwoChoice name="Yes" selected={looking === "Yes"} onClick={() => setLooking("Yes")}/>
                <TwoChoice name="No" selected={looking === "No"} onClick={() => setLooking("No")}/>
            </div>
        </div>
    </QuestionLayout>
}

function TwoChoice({name, selected, onClick}) {
    return <div onClick={onClick} className={`border-gray-300 ${selected ? "border-pink-500" : null} flex items-center justify-center border-2 rounded-lg two-choice transition mr-1 md:mr-5 cursor-pointer`}>
        <p className="text-3xl">{name}</p>
    </div>;
}
