import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import { productData } from '../static/data'

function ProductsPage() {
    const [searchParams] = useSearchParams()
    const categoryData = searchParams.get('category')
    const [data, setData] = useState([])

    useEffect(() => {
        if (!productData?.length) return

        const products = [...productData]
        const filteredProducts = categoryData
            ? products.filter((item) => item.category?.toLowerCase() === categoryData.toLowerCase())
            : products

        const sortedProducts = [...filteredProducts].sort((a, b) => (b.total_sell ?? 0) - (a.total_sell ?? 0))
        setData(sortedProducts)
    }, [categoryData])

    return (
        <div className="text-black">
            <Header activeHeading={3} />
            <br />
            <br />
            <div className={`${styles.section}`}>
                <div className="grid grid-cols-1 gap-[20px] md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                    {
                        data?.map((i, index) => <ProductCard data={i} key={index} />)
                    }
                </div>
                {
                    data?.length === 0 ? (<h1 className='text-center w-full pb-[10px] text-[20px]'>No products found!</h1>) : null
                }
            </div>
        </div>
    )
}

export default ProductsPage