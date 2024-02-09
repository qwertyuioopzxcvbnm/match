/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

//This wraps all routes in index.js so that code can be executed on page change
export default function RouteController({children}) {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    //This does not follow hook rules, but like wtv
    //Runs code whenever the location hook updates to set relevant state data
    useEffect(() => {
        if (!/question/.test(location.pathname)) {
            dispatch({
                type: 'set-progress',
                value: 0
            })
        }

        //ensures user hasn't already completed the form on this device (browser-side check only)
        //Also avoids redirecting if already on the final page (no infinite loops!)
        if (window.localStorage.getItem('finished') === 'true' && !/finished/.test(location.pathname)) {
            navigate('/finished')
        }

    }, [location])
    
    return <>{children}</>
}