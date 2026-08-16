import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../../styles/styles';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard.jsx'
import { AiFillHeart, AiFillStar, AiOutlineShoppingCart, AiOutlineStar, AiOutlineEye } from 'react-icons/ai'
import { getImageUrl } from '../../../../server';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist, addToWishlist } from '../../../redux/actions/wishlist.js';
import Ratings from '../../Products/Ratings.jsx';

const ProductCard = ({ data, isEvent }) => {
    const { wishlist } = useSelector((state) => state.wishlist);

    const dispatch = useDispatch();
    const [click, setClick] = useState(false);
    const [open, setOpen] = useState(false);

    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data))
    };

    const addToWishlistHandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data));
    }

    useEffect(() => {
        if(wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        }else{
            setClick(false);
        }
    },[wishlist]);

    const productPath = isEvent ? `/product/${data?._id}?isEvent=true` : `/product/${data?._id}`;

    return (
        <div className='w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer'>
            <div className="flex justify-end">

            </div>
            <Link to={productPath}>
                <img src={getImageUrl(data?.images?.[0])} alt={data?.name} className='w-full h-[170px] object-contain' />
            </Link>
            <Link to={`/user/${data.shop._id}`}>
                <h5 className={`${styles.shop_name}`}>{data?.shop?.name}</h5>
            </Link>
            <Link to={productPath} onClick={() => window.scrollTo(0, 0)}>
                <h4 className='pb-3 font-[500]'>
                    {data?.name?.length > 40 ? data?.name?.slice(0, 40) + "..." : data?.name}
                </h4>
                <div className='flex'>
                    <Ratings rating={data?.ratings} />
                </div>
                <div className='py-2 flex items-center justify-between'>
                    <div className='flex'>
                        <h5 className={`${styles.productDiscountPrice}`}>
                            {data?.discountPrice}
                            $
                        </h5>
                        <h4 className={`${styles.price}`}>
                            {data?.originalPrice ? data?.originalPrice + "$" : null}
                        </h4>
                    </div>
                    <span className='font-[400] text-[17px] text-[#68d284]'>
                        {data?.sold_out} sold
                    </span>
                </div>
            </Link>

            {/* side options */}
            <div>
                {click ? (
                    <AiFillHeart size={22} className='cursor-pointe absolute right-2 top-5' onClick={() => removeFromWishlistHandler(data)} color={click ? 'red' : "#333"} title="Remove from whistlist" />
                ) : (
                    <AiFillHeart size={22} className='cursor-pointe absolute right-2 top-5' onClick={() => addToWishlistHandler(data)} color={click ? 'red' : "#333"} title="Add to whistlist" />
                )
                }
                    <AiOutlineEye size={22} className='cursor-pointe absolute right-2 top-14' onClick={() => setOpen(!open)} color="#333" title="Quick view" />
                    <AiOutlineShoppingCart size={25} className='cursor-pointe absolute right-2 top-24' onClick={() => setOpen(!open)} color="#444" title="Add to cart" />
                        {
                            open ?  (
                                <ProductDetailsCard open={open} setOpen={setOpen} data={data}/>
                            ) : (null)
                        }
            </div>
        </div>
    )
}

export default ProductCard
