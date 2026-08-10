import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { backend_url, server } from '../../../server'
import styles from '../../styles/styles'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ShopInfo = ({ isOwner }) => {

    const { products } = useSelector((state) => state.product);
    const { seller } = useSelector((state) => state.seller);

    const logoutHandler = async () => {
        await axios.get(`${server}/shop/logout`, { withCredentials: true });
        window.location.reload();
    };

    const totalReviewsLength = products && products.reduce((acc, product) => acc + product.reviews.length, 0)

    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);

    const averageRating = totalRatings / totalReviewsLength || 0;


    useEffect(() => { }, [products])
    return (
        <div>
            <div className='w-full py-5'>
                <div className="w-full flex items-center justify-center">
                    <img src={`${backend_url}${products?.[0]?.shop?.avatar || seller?.avatar}`} alt=""
                        className='w-[150px] h-[150px] object-cover rounded-full'
                    />
                </div>
                <h3 className="text-center py-2 text-[20px]">
                    {products?.[0]?.shop?.name || seller?.name}
                </h3>
                <p className='text-[16px] text-[#000000a6] p-[10px] flex items-center'>
                    {products?.[0]?.shop?.description || seller?.description}
                </p>
            </div>
            <div className="p-3">
                <h5 className='font-[600]'>Address</h5>
                <h4 className='text-[#000000a6]'>
                    {products?.[0]?.shop?.address || seller?.address}
                </h4>
            </div>
            <div className="p-3">
                <h5 className='font-[600]'>Phone Number</h5>
                <h4 className='text-[#000000a6]'>
                    {products?.[0]?.shop?.phoneNumber || seller?.phoneNumber}
                </h4>
            </div>
            <div className="p-3">
                <h5 className='font-[600]'>Total Products</h5>
                <h4 className='text-[#000000a6]'>
                    {products?.length}
                </h4>
            </div>
            <div className="p-3">
                <h5 className='font-[600]'>Shop Ratings</h5>
                <h4 className='text-[#000000a6]'>
                    {averageRating}/5
                </h4>
            </div>
            <div className="p-3">
                <h5 className='font-[600]'>Joined On</h5>
                <h4 className='text-[#000000a6]'>
                    {products?.[0]?.shop?.createdAt.slice(0, 10) || seller?.createdAt.slice(0, 10)}
                </h4>
            </div>
            {
                isOwner && (
                    <div className="py-3 px-4">
                        <Link to={`/dashboard-settings`}>
                            <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                                <span className='text-white'>Edit Shop</span>
                            </div>
                        </Link>
                        <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                            onClick={logoutHandler}
                        >
                            <span className='text-white'>Log Out</span>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ShopInfo
