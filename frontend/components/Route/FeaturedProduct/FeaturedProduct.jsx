import React, { useEffect } from 'react'
import styles from '../../../styles/styles'
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard'
import { productData } from '../../../static/data'
import ProductCard from '../ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../../redux/actions/product'

const FeaturedProduct = () => {

    const { allproducts } = useSelector((state) => state.product);

    return (
        <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading}`}>
                    <h1 className='pt-[25px]'>Featured Products</h1>
                </div>
                <div className='grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]'>
                    {
                        allproducts && allproducts.map((i, index) => <ProductCard data={i} key={index} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default FeaturedProduct
