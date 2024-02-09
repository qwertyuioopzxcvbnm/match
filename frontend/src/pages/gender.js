import QuestionLayout from "../components/QuestionLayout";
import { FaMars, FaVenus, FaGenderless } from "react-icons/fa";
import { useState } from "react";
import Errors from "../components/Errors";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function GenderPage() {
    const values = useSelector((e) => e.userInfo)
    const [errors, setErrors] = useState([])
    const [gender, setGender] = useState(values.gender || '')
    const [desiredGenders, setDesiredGenders] = useState(values.desiredGenders || [])
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function nextPage() {
        const newErrors = []

        if (gender === '') {
            newErrors.push("No gender selected")
        }

        if (desiredGenders.length === 0) {
            newErrors.push("No desired genders selected")
        }
        
        setErrors(newErrors)
        if (newErrors.length === 0) {
            dispatch({
                type: 'add-user-info',
                value: {
                    gender,
                    desiredGenders
                }
            })
            navigate('/looking-for')
        }
    }    

    function lastPage() {
        navigate('/grades')
    }

    const hasItem = (item) => desiredGenders.includes(item)

    const swapItem = (item) => () => {
        if (!hasItem(item)) {
            setDesiredGenders([...desiredGenders, item])
        } else {
            setDesiredGenders(desiredGenders.filter(e => e !== item))
        }
    }


    return <QuestionLayout next={nextPage} back={lastPage}>
        <p className="self-center mt-4 text-2xl">One last thing</p>
        {errors.length > 0 ? <Errors errors={errors} /> : null}
        <div className="w-11/12 self-center mt-2 flex flex-col">
            <p>I identify as a </p>
            <div className="flex mt-2 md:self-center">
                <ThreeChoiceBox name="Man" selected={gender === "man"} onClick={() => setGender("man")}>
                    <FaMars />
                </ThreeChoiceBox>
                <ThreeChoiceBox name="Woman" selected={gender === "woman"} onClick={() => setGender("woman")}>
                    <FaVenus />
                </ThreeChoiceBox>
                <ThreeChoiceBox name="Other" selected={gender === "other"} onClick={() => setGender("other")}>
                    <FaGenderless />
                </ThreeChoiceBox>
            </div>
            <p className="mt-3">I'm looking for a</p>
            <p className="text-xs">Allows multiple to be selected</p>
            <div className="flex mt-2 md:self-center">
                <ThreeChoiceBox name="Man" selected={hasItem("man")} onClick={swapItem("man")}>
                    <FaMars />
                </ThreeChoiceBox>
                <ThreeChoiceBox name="Woman" selected={hasItem("woman")} onClick={swapItem("woman")}>
                    <FaVenus />
                </ThreeChoiceBox>
                <ThreeChoiceBox name="Other" selected={hasItem("other")} onClick={swapItem("other")}>
                    <FaGenderless />
                </ThreeChoiceBox>
            </div>
        </div>
    </QuestionLayout>
}

function ThreeChoiceBox({name, selected, onClick, children}) {
    return <div onClick={onClick} className={`border-gray-300 ${selected ? "border-pink-500" : null} flex flex-col items-center justify-center border-2 rounded-lg three-choice transition mr-1 md:mr-5 cursor-pointer`}>
        <div className="text-5xl">
            {children}
        </div>
        <p>{name}</p>
    </div>;
}
