import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/styles';

const DropDown = ({ categoriesData, setDropDown }) => {

    const navigate = useNavigate();

    const submitHandle = (i) => {
        navigate(`/products?category=${encodeURIComponent(i.title)}`);
        setDropDown(false);
    }

    return (
        <div className='pb-4 w-[270px] bg-[#fff] absolute left-0 top-[60px] z-30 rounded-b-md shadow-sm overflow-hidden'>
            {
                categoriesData && categoriesData.map((i) => (
                    <div
                        key={i.id}
                        className={`${styles.normalFlex} px-4 py-3 cursor-pointer hover:bg-[#f5f5f5]`}
                        onClick={() => submitHandle(i)}
                    >
                        <img src={i.image_Url} className='w-[28px] h-[28px] object-cover rounded-full select-none' alt={i.title} />
                        <h3 className='ml-3 text-sm font-[500] text-[#333] select-none'>{i.title}</h3>
                    </div>
                ))
            }
        </div>
    )
}

export default DropDown