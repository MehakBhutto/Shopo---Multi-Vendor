import React from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';

const Ratings = ({ rating }) => {

    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i <= rating) {
            stars.push(
                <AiFillStar
                    size={20}
                    key={i}
                    color='#f6b100'
                    className=' cursor-pointer'
                />
            );
        } 
        // else if (i === Math.cell(rating) && !Number.isInteger(rating)) {
        //     stars.push(
        //         <BsStarHalf
        //         key={i}
        //         size={17}
        //         color='#f6ba00'
        //         className=' cursor-pointer'
        //         />
        //     );
        // } 
        else {
            stars.push(
                <AiOutlineStar
                key={i}
                size={20}
                color='#f6ba00'
                className=' cursor-pointer'
                />
            );
        }
    }

    return (
        <div className="flex justify-start">
            {stars}
        </div>
    )
}

export default Ratings
