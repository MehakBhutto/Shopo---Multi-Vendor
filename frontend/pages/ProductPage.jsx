import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'
import { useParams, useSearchParams } from 'react-router-dom'

function ProductPage() {
    const [data, setData] = useState([]);
    const { allproducts } = useSelector((state) => state.product);
    const [searchParams] = useSearchParams();
    const categoryData = searchParams.get("category");
    
    useEffect(() => {
        if (!allproducts) return;

        if (categoryData === null) {
            const sortedProducts = [...allproducts].sort((a, b) => (b.total_sell ?? 0) - (a.total_sell ?? 0));
            setData(sortedProducts);
        } else {
            const filteredProducts = allproducts.filter((i) => i.category === categoryData);
            setData(filteredProducts);
        }
    }, [allproducts, categoryData]); 

    return (
        <div className="text-black">
            <Header activeHeading={3} />
            <br />
            <br />
            <div className={`${styles.section}`}>
                <div className="grid grid-cols-1 gap-[20px] md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                    {
                        // 3. Changed from products?.map to data?.map
                        data && data.map((i, index) => <ProductCard data={i} key={index} />)
                    }
                </div>
                {data.length === 0 && (
                    <h1 className="text-center w-full pb-[100px] text-[20px]">
                        No products found!
                    </h1>
                )}
            </div>
        </div>
    )
}

export default ProductPage
