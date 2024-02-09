import QuestionLayout from "../components/QuestionLayout";
import TextEntry from "../components/TextEntry";
import { FaTiktok, FaInstagram, FaSnapchatGhost } from 'react-icons/fa'
import { useRef, useState, useEffect } from "react";
import Errors from "../components/Errors";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../components/ThemeButton";
import WADaily from '../assets/wadaily.png'
import LoginModal from "../components/LoginModal";

export default function InfoPage() {
    const [errors, setErrors] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false)
    const values = useSelector((e) => e.userInfo)

    useEffect(() => {
        if (!values._id) {
            fetch(`https://wadaily.co/api/user/login`, {
                method: 'POST',
                credentials: 'include',
            }).then(async (e) => {
                if (e.status === 200) {
                    dispatch({
                        type: 'add-user-info',
                        value: (await e.json()).user
                    })
                }
            })
        }
    }, [])

    const ref = useRef()
    async function nextPage() {
        const form = ref.current;
        const formData = new FormData(form)
        const formObject = Object.fromEntries(formData)
        const newErrors = []
        const { exists } = await (await fetch(`/api/emailExists?email=${values.email}`)).json()
        if (exists) {
            newErrors.push("Your email has already been used. Did you fill this out on another device?")
        }

        if (!values._id) {
            newErrors.push("You must connect to WADaily to continue")
        }

        setErrors(newErrors)
        if (newErrors.length === 0) {
            dispatch({
                type: 'add-user-info',
                value: formObject
            })
            navigate('/grades')
        }
    }

    function lastPage() {
        navigate('/')
    }

    return <QuestionLayout next={nextPage} back={lastPage}>
        <p className="self-center mt-4 text-2xl">First off, let's get some info</p>
        {errors.length > 0 ? <Errors errors={errors} /> : null}
        {values._id ? <div className="bg-pink-300 p-3 my-4 text-white">
            <div className={'float-left'}>
                <p className={'text-lg'}>Welcome back, {values.name}</p>
                <p className={'text-sm'}>Synced profile from WADaily</p>
            </div>
            <div className={'float-right'}>
                <img src={WADaily} alt='WADaily logo' className='h-12' />
            </div>
        </div> : <ThemeButton onClick={(e) => {
            e.preventDefault()
            setShowLogin(true)
        }} className={"my-4"}>Connect using WADaily</ThemeButton>}
        <LoginModal visible={showLogin} setVisible={setShowLogin}></LoginModal>
        <form className="w-11/12 self-center mt-2" ref={ref}>
            <p className="mt-2">Add your Social Media accounts</p>
            <TextEntry name="snapchat" icon={FaSnapchatGhost} inlineText="snapchat.com/add/" placeholder="your_username" content={values.snapchat} />
            <TextEntry name="instagram" icon={FaInstagram} inlineText="instagram.com/" placeholder="your_username" content={values.instagram} />
            <TextEntry name="tiktok" icon={FaTiktok} inlineText="tiktok.com/" placeholder="your_username" content={values.tiktok} />
        </form>
    </QuestionLayout>
}