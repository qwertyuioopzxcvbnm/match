import Layout from "./Layout";
import Butterknife from "../assets/butterknife.jpg"
import ThemeButton from "./ThemeButton";
import { useSelector } from "react-redux";

export default function QuestionLayout({children, next, back}) {
    const progress = useSelector((state) => state.progressBar || 0);

    return <Layout>
        <img src={Butterknife} alt="butterknife logo" className="mt-3 w-64 self-center" />
        <hr className="mt-3"></hr>
        <div className="flex flex-col max-w self-center ">
            {children}
        </div>
        <footer className="mt-auto">
            <div className="w-full h-6 shadow-inner">
                <div className="bg-pink-300 h-full text-right text-white text-sm pr-2 transition-all" style={{width: `${Math.max(progress, 12)}%`}}>{`${progress}%`}</div>
            </div>
            <div>
                <ThemeButton className="w-3/12 border-r-2 border-pink-400" onClick={back}>«</ThemeButton>
                <ThemeButton className="w-9/12" onClick={next}>{progress === 100 ? "Finish and Submit" : "Next"}</ThemeButton>
            </div>
        </footer>
    </Layout>
}