import Layout from "../components/Layout";
import Butterknife from "../assets/butterknife.jpg"
import ThemeButton from "../components/ThemeButton";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function StartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const questions = await fetch('/api/questions')
            dispatch({
                type: 'set-questions',
                value: await questions.json()
            })
            setTimeout(() => setLoading(false), 500)
        })();
    }, [])

    return <Layout className="bg-gradient-to-r from-pink-500 to-pink-300 justify-center">
        <div className="self-center flex flex-col items-center w-11/12 md:w-10/12 bg-white rounded-xl py-8 md:py-16 drop-shadow-lg">
            {loading ? <>
                <p className="mb-3">Loading assets</p>
                <Loader />
            </> : <>
                <img src={Butterknife} alt="butterknife logo" className="w-5/6 md:w-96" />
                <p className="text-2xl my-3">Matchmaker Survey</p>
                <ThemeButton className={'rounded-lg'} onClick={() => navigate('/info')}>Start Here</ThemeButton>
                <p className="mt-2 mx-5 text-center">This survey closes at 11:59PM on Feb 13, 2023.</p>
            </>}
        </div>
        <Footer />
    </Layout>
}