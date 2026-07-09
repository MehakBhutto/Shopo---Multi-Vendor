import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import { productData } from '../static/data'
import ProductCard from '../components/Route/ProductCard/ProductCard'

function BestSellingPage(){
    const [data, setData] = useState([])
    useEffect(() => {
        if (!productData?.length) return
        const d = [...productData].sort((a, b) => (b.total_sell ?? 0) - (a.total_sell ?? 0))
        setData(d)
    }, [])

    return (
        <div className="text-black">
            <Header activeHeading={2} />
            <br />
            <br />
            <div className={`${styles.section}`}>
                <div className="grid grid-cols-1 gap-[20px] md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                    {
                        data?.map((i, index) => <ProductCard data={i} key={index} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default BestSellingPage