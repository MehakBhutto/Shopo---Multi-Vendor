import React, { useEffect, useState } from 'react'

const CountDown = ({ endDate = '2026-12-31T23:59:59' }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endDate))
        }, 1000)

        return () => clearInterval(timer);
    }, [endDate]);

    function calculateTimeLeft(date) {
        const difference = +new Date(date) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft
    }

    const timeComponents = Object.keys(timeLeft).map((interval) => {
        return (
            <span key={interval} className='mr-2 text-[#275ad2]'>
                {timeLeft[interval]} {interval} {""}
            </span>)
    })
    return (
        <div>
            {timeComponents.length ? (
                timeComponents
            ) : (
                <span className='text-[red] text-[25px]'>Time's Up</span>
            )}
        </div>
    )
}


export default CountDown
