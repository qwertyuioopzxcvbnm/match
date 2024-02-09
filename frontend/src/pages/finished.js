import Layout from "../components/Layout";
import Butterknife from "../assets/butterknife.jpg"
import Check from "../assets/check.png"
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import Errors from "../components/Errors";
import { Link } from "react-router-dom";

export default function FinishedPage() {
    const [status, setStatus] = useState('loading')
    const [errors, setErrors] = useState([])
    //gives all data from internal redux state for final preparation and sending
    const internalData = useSelector(e => e)
    const dataToSend = {
        responses: internalData.questionResponses,
        info: internalData.userInfo
    }

    useEffect(() => {
        //run this code as an async function
        (async () => {
            //ensure user hasn't already finished survey on this device
            if (window.localStorage.getItem('finished') === "true") {
                setStatus('submitted')
                return;
            }
            const newErrors = []
            //did user load initial questions correctly?
            if (internalData.questions?.length === 0) newErrors.push("Your browser has not loaded any questions. Please navigate to the homepage and try again")
            //Did user fill out all questions?
            if (internalData.questions?.length !== Object.keys(internalData.questionResponses)?.length) newErrors.push("You appear to be missing some responses. Please navigate back through the form to find missing questions")
            //Is there an attached name and email?
            if (!internalData.userInfo.name || !internalData.userInfo.email) newErrors.push("Your name or email is missing. Please fill this in")
            //Are grade and gender information supplied
            if (!internalData.userInfo.inGrade || internalData.desiredGrades?.length === 0 || !internalData.userInfo.gender || internalData.desiredGenders?.length === 0) newErrors.push("Your grade or gender preferences are missing. Please fill these in")
            setErrors(newErrors)
            //if no errors, start upload process
            if (newErrors.length === 0) {
                try {
                    //send to API on backend, see backend/index.js
                    const submit = await fetch('/api/results', {
                        method: 'post',
                        body: JSON.stringify(dataToSend),
                        headers: {
                            "content-type": "application/json"
                        }
                    })
                    //server validates form and returns status (ensures no duplicate emails/faulty data)
                    if (submit.status === 200) {
                        setStatus('success')
                        //persists finished data
                        window.localStorage.setItem('finished', true)
                    } else {
                        setStatus('error')
                        setErrors([`Server error: ${(await submit.json()).message}`])
                    }
                } catch (e) {
                    //catch API errors and display if necessary
                    setStatus('error')
                    setErrors([e.toString()])
                }
            } else {
                //sets status to error if errors array is > 0
                setStatus('error')
            }
        })();
    //empty array tells react to only run this code on component load
    //imo stupid but read useEffect docs if u r confused
    }, [])

    return <Layout className="bg-gradient-to-r from-pink-500 to-pink-300 justify-center">
        <div className="self-center flex flex-col items-center w-11/12 md:w-10/12 bg-white rounded-xl py-8 md:py-20 drop-shadow-lg">
        {errors.length > 0 ? <Errors errors={errors} /> : null}
        {(status === 'success' || status === 'submitted') && <>
            <img src={Butterknife} alt="butterknife logo" className="w-1/2 md:w-96" />
            <img src={Check} alt="checkmark" className="h-28 my-3" />
            <p className="text-3xl my-2">{status === 'success' ? "You're done!" : "You already submitted!"}</p>
            <p className="mx-6 my-2">Expect to see your results in your email in the coming days…</p>
        </>}
        {status === 'loading' && <><p className="mb-3">Uploading your responses</p><Loader /></>}
        {status === 'error' && <Link to="/">Return to first page</Link>}
        </div>
        <Footer />
    </Layout>
}