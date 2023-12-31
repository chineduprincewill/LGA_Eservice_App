import React, { useState, useRef, useEffect } from "react";
import { OtpResend } from "../apis/noAuthActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const CountdownTimer = ({ user_id }) => {

    const [resending, setResending] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);
 
    // The state for our timer
    const [timer, setTimer] = useState();
 
    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const resendOtp = () => {
        const data = {
            user_id
        }

        OtpResend(data, setSuccess, setError, setResending);
    }
 
    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                    ":" +
                    (minutes > 9
                        ? minutes
                        : "0" + minutes) +
                    ":" +
                    (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };
 
    const clearTimer = (e) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer("00:00:00");
 
        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };
 
    const getDeadTime = () => {
        let deadline = new Date();
 
        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    };


    if(error !== null){
        toast.error('There is an error!');
        setError(null);
    }

    if(success !== null){
        toast.info(success?.message);
        setSuccess(null);
        clearTimer(getDeadTime());
    }
 
    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible
 
    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);
 
    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button
    //const onClickReset = () => {
    //  clearTimer(getDeadTime());
    //};

    return (
        <div className="bg-gray-100 p-4 rounded-md text-green-700">
            {
                timer !== "00:00:00" ? 
                    <span>{timer}</span> : 
                    (
                        resending ? <span className="text-blue-900">Resending...</span>
                        :
                        <span className="text-blue-900 cursor-pointer" onClick={() => resendOtp()}>Resend OTP</span>) 
            }
            <ToastContainer />
        </div>
    )
}

export default CountdownTimer
