import React, { useState, useEffect }  from 'react'
import { productData } from '../../../static/data';
import styles from '../../../styles/styles';
import ProductCard from '../ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../../redux/actions/product';

const BestDeals = () => {

    const [data, setData] = useState([]);
    const { allproducts } = useSelector((state) => state.product);

    useEffect(() => {
      const firstFive = allproducts?.slice(0,5);
      setData(firstFive);
    }, [allproducts])

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Best Deals</h1>
      </div>
      <div className='grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]'>
        {
          data && data.map((i, index)=> (
            <ProductCard data={i} key={index}/>
          ))
        }
      </div>

    </div>
  )
}

export default BestDeals
