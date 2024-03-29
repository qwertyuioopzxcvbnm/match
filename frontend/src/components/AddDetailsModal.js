import { useRef } from "react";
import Modal from "./Modal";

export default function AddDetailsModal({visible, setVisible, loginUser, number}) {
    const name = useRef()
    const email = useRef()

    async function submitDetails() {
        const nameVal = name.current.value
        const emailVal = email.current.value + "@woodward.edu"

        loginUser({
            id: number,
            name: nameVal,
            email: emailVal
        })

        setVisible(false)
    }

    return (visible && <Modal>
        <p className="text-2xl">Set up</p>
        <p className="mb-1">We&apos;ll need some extra details to register you</p>
        <p>Your Name</p>
        <input type="text" ref={name} className="w-full border-2 mb-2 border-gray-300 rounded-md p-2 dark:bg-gray-900" />
        <p>Your Woodward Email</p>
        <div className="flex items-center border-2 rounded-md border-gray-300 dark:bg-gray-900">
            <input type="text" ref={email} className="0 p-2 w-max outline-none dark:bg-gray-900" />
            <p className="mx-3">@woodward.edu</p>
        </div>
        <button className="mt-3" onClick={submitDetails}>Complete setup</button>
    </Modal>)
}