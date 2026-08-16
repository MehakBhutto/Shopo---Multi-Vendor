import React, { useState, useEffect } from 'react'
import { productData } from '../../static/data'
import ProductCard from '../Route/ProductCard/ProductCard'
import { Link, useParams } from 'react-router-dom'
import styles from '../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsShop } from '../../redux/actions/product'
import { getImageUrl } from '../../../server'
import Ratings from '../Products/Ratings'
import { getAllEventsShop } from '../../redux/actions/event'

const ShopProfileData = ({ isOwner }) => {

    const { products } = useSelector((state) => state.product);
    const { seller } = useSelector((state) => state.seller);
    const { events } = useSelector((state) => state.event);

    const { id } = useParams();

    const [active, setActive] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(id))
        dispatch(getAllEventsShop(seller?._id))
    }, [dispatch, seller?._id]);

    useEffect(() => {},[events])

    console.log(events)
    const allReviews = products && products.map((product) => product.reviews).flat();

    return (
        <div className='w-full'>
            <div className="flex w-full items-center justify-between">
                <div className='w-full flex'>
                    <div className="flex items-center"
                        onClick={() => setActive(1)}
                    >
                        <h5 className={`font-[600] text-[20px] ${active === 1 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px] `}>
                            Shop Products
                        </h5>
                    </div>

                    <div className="flex items-center"
                        onClick={() => setActive(2)}
                    >
                        <h5 className={`font-[600] text-[20px] ${active === 2 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px]`}>
                            Running Events
                        </h5>
                    </div>

                    <div className="flex items-center"
                        onClick={() => setActive(3)}
                    >
                        <h5 className={`font-[600] text-[20px]  cursor-pointer pr-[20px] ${active === 3 ? "text-red-500" : "text-[#333]"}`}>
                            Shop Reviews
                        </h5>
                    </div>
                </div>
                <div>
                    {
                        isOwner && (
                            <div>
                                <Link to="/dashboard">
                                    <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                                        <span className='text-[#fff]'>Go Dashboard</span>
                                    </div>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>

            <br />
            {
                active === 1 && (
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20p] mb-12 border">
                        {
                            products &&
                            products.map((i, index) => (
                                <ProductCard data={i} key={index} isShop={true}/>
                            ))
                        }
                    </div>
                )
            }

            {
                active === 2 && (
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20p] mb-12 border">
                        {
                            events &&
                            events.map((i, index) => (
                                <ProductCard data={i} key={index} isShop={true} isEvent={true}/>
                            ))
                        }
                    </div>
                )
            }

            {
                active === 3 && (
                    <div className="w-full">
                        {
                            products && allReviews.map((item, index) => (
                                <div className='w-full flex my-4'>
                                    <img 
                                    className='w-[50px] h-[50px] rounded-full'
                                    src={getImageUrl(item?.user?.avatar)}
                                    alt="" 
                                    />
                                    <div className="pl-2">
                                        <div className="flex w-full items-center gap-2">
                                            <h1 className="font-[600]">
                                            {item?.user?.name}
                                        </h1>
                                        <Ratings rating={item.rating}/>

                                        <p className='text-[#000000a7] text-[13px]'>
                                            {item?.createdAt ? item?.createdAt?.slice(0,10) : "2 days ago"}
                                        </p>
                                        </div>
                                        <p className="font-[400] text-[#0000000a7]">
                                            {item?.comment}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ShopProfileData
