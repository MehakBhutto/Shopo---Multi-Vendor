import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/styles'
import CountDown from "./CountDown.jsx"

export default function EventCard({ data, endDate, active }){
    if (!data) {
        return null
    }

    const productName = data.name.replace(/\s+/g, "-");
    const productImage = Array.isArray(data.image_Url)
        ? data.image_Url[0]?.url
        : data.image_Url;

    return (
        <div className={`mb-12 flex w-full flex-col rounded-lg bg-white p-6 shadow-sm lg:flex-row lg:p-14 ${active ? "unset" : "mb-12"}`}>
            <div className="mb-8 flex w-full shrink-0 justify-center lg:mb-0 lg:w-[46%] lg:justify-end">
                <img
                    src={productImage}
                    alt={data.name}
                    className="max-h-[320px] w-auto max-w-full object-contain lg:max-h-[380px]"
                />
            </div>
            <div className="flex w-full flex-col justify-center gap-1 lg:w-[54%] lg:max-w-xl lg:pl-2">
                <h2 className={`${styles.productTitle}`}>{data.name}</h2>
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                    {data.description}
                </p>
                <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    {data.price ? (
                        <h5 className="font-[500] text-[18px] text-[#d55b45] line-through">
                            {data.price}$
                        </h5>
                    ) : null}
                    <h5 className="font-Roboto text-[20px] font-bold text-[#333]">{data.discount_price}$</h5>
                    <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">{data.total_sell} Sold</span>
                </div>
                <div className="mt-6">
                    <CountDown endDate={endDate} />
                </div>
                <Link to={`/product/${productName}`} className={`${styles.button} mt-6 rounded-[4px]`}>
                    <span className="text-[#fff]">See Details</span>
                </Link>
            </div>
        </div>
    )
}
