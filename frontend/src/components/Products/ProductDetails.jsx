import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from 'react-icons/ai'
import { getImageUrl, server } from '../../../server';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsShop } from '../../redux/actions/product';
import { addToCart } from '../../redux/actions/cart';
import { toast } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../../redux/actions/wishlist';
import Ratings from './Ratings';
import axios from 'axios';

const ProductDetails = ({ data }) => {
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { wishlist } = useSelector((state) => state.wishlist);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { cart } = useSelector((state) => state.cart);
    const { products } = useSelector((state) => state.product);

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }

    const incrementCount = () => {
        setCount(count + 1)
    }

    const handleMessageSubmit = async () => {

        if (isAuthenticated) {
            const groupTitle = data._id + user._id;
            const userId = user?._id;
            const sellerId = data.shop._id

            await axios.post(`${server}/conversation/create-new-conversation`, {
                groupTitle, userId, sellerId
            }).then((res) => {
                navigate(`/inbox`);
                toast.success(res?.data?.message);
            }).catch((e) => {
                toast.error(e?.response?.data?.message);
            });

        } else {
            toast.error("Please login to create a conversation!")
        }

    };

    const addtoCartHandler = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id);
        if (isItemExists) {
            toast.error('Item is already in cart')
        } else {
            if (data.stock < count) {
                toast.error("Product stock limited")
            } else {
                const cartData = { ...data, qty: count };
                dispatch(addToCart(cartData));
                toast.success("Item added to cart successfully");
            }
        }
    }

    const removeFromWishListhandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data))
    }

    const addToWishListhandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data));
    }

    const totalReviewsLength = products && products.reduce((acc, product) => acc + product.reviews.length, 0)

    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);

    const averageRating = totalRatings / totalReviewsLength || 0;

    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === data?._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist, data]);

    return (
        <div className='bg-white'>
            {
                data ? (
                    <div className={`${styles.section} w-[90%] md:w-[80%] min-h-[calc(100vh-200px)] py-5`}>
                        <div className="w-full py-5">
                            <div className="block w-full md:flex">
                                <div className='w-full md:w-[50%]'>
                                    <img src={getImageUrl(data?.images?.[select])} alt="" className='w-[80%]' />
                                    <br />
                                    <div className="w-full flex">
                                        {data.images.length > 0 ? data.images.map((image, index) => (
                                            <div key={`${image}-${index}`} className={`${select === index ? "border" : ""} cursor-pointer`}>
                                                <img
                                                    src={getImageUrl(image)}
                                                    alt=""
                                                    className="h-[200px]"
                                                    onClick={() => setSelect(index)}
                                                />
                                            </div>
                                        )) : null}
                                    </div>
                                </div>
                                <div className="w-full md:w-[50%]">
                                    <h1 className={`${styles.productTitle}`}>{data.name}</h1> <br />
                                    <p>{data.description}</p>
                                    <div className="flex pt-3">
                                        <h4 className={`${styles.productDiscountPrice}`}>{data.discountPrice}$</h4>
                                        <h3 className={`${styles.price}`}>{data.originalPrice ? data.originalPrice + "$" : null}</h3>
                                    </div>
                                    <div className="flex items-center mt-12 justify-between pr-3">
                                        <div>
                                            <button
                                                className='bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out'
                                                onClick={decrementCount}>
                                                -
                                            </button>
                                            <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[8px]">{count}</span>
                                            <button className='bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out'
                                                onClick={incrementCount}>
                                                +
                                            </button>
                                        </div>
                                        <div>
                                            {click ? (
                                                <AiFillHeart
                                                    size={30}
                                                    className="cursor-pointer"
                                                    onClick={() => removeFromWishListhandler(data)}
                                                    color={click ? "red" : "#333"}
                                                    title="Remove from wishlist"
                                                />
                                            ) : (
                                                <AiOutlineHeart
                                                    size={30}
                                                    className="cursor-pointer"
                                                    onClick={() => { addToWishListhandler(data), setClick(true) }}
                                                    color={click ? "red" : "#333"}
                                                    title="Add to wishlist"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                                        onClick={() => addtoCartHandler(data._id)}>
                                        <span className='text-white flex items-center'>
                                            Add to Cart <AiOutlineShoppingCart className="ml-1" />
                                        </span>
                                    </div>
                                    <div className="flex items-center pt-8">
                                        <img className='w-[50px] h-[50px] rounded-full mr-2' src={getImageUrl(data?.shop?.avatar)} alt="" />
                                        <div className='pr-8'>
                                            <h3 className={`${styles.shop_name} !py-1 !pt-3 cursor-pointer`} onClick={() => navigate(`/user/${data.shop._id}`)}>
                                                {data.shop.name}
                                            </h3>
                                            <h5 className='pb-3 text-[15px]'>
                                                ({averageRating}/5) Ratings
                                            </h5>
                                        </div>
                                        <div className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`} onClick={handleMessageSubmit}>
                                            <span className='text-white flex items-center text-[16px]'>
                                                Send Message <AiOutlineMessage className='ml-1' />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ProductDetailsInfo data={data} dispatch={dispatch} totalReviewsLength={totalReviewsLength} averageRating={averageRating} />
                        <br />
                        <br />
                    </div>
                ) : null
            }
        </div>
    )
}

const ProductDetailsInfo = ({ data, dispatch, totalReviewsLength, averageRating }) => {
    const { products } = useSelector((state) => state.product);
    const [active, setActive] = useState(1);

    useEffect(() => {
        dispatch(getAllProductsShop(data.shop._id));
    }, [dispatch])

    return (
        <div className='bg-[#f5f6fb] px-3 md:px-10 py-2 rounded h-auto'>
            <div className="w-full flex justify-between border-b pt-10 p-2">
                <div className='relative'>
                    <h5 onClick={() => setActive(1)} className={`text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer md:text-[20px]`}>
                        Product Details
                    </h5>
                    {active === 1 ? (
                        <div className={`${styles.active_indicator}`}></div>
                    ) : null}
                </div>
                <div className='relative'>
                    <h5 onClick={() => setActive(2)} className={`text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer md:text-[20px]`}>
                        Product Reviews
                    </h5>
                    {active === 2 ? (
                        <div className={`${styles.active_indicator}`}></div>
                    ) : null}
                </div>
                <div className='relative'>
                    <h5 onClick={() => setActive(3)} className={`text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer md:text-[20px]`}>
                        Seller Information
                    </h5>
                    {active === 3 ? (
                        <div className={`${styles.active_indicator}`}></div>
                    ) : null}
                </div>
            </div>
            {
                active === 1 ? (
                    <>
                        <p className='py-2 text-[18px] leading-8 pb-10 whitespace-pre-line'>
                            {data.description}
                        </p>

                    </>
                ) : null
            }
            {
                active === 2 ?
                    (
                        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-auto">
                            {
                                data && data.reviews.map((item, index) => (
                                    <div className="w-full flex my-2">
                                        <img src={getImageUrl(item.user.avatar)} className='w-[50px] h-[50px] rounded-full' />
                                        <div className='pl-2'>
                                            <div className="w-full flex items-center">
                                                <h1 className='mr-3 font-[500]'>{item?.user.name}</h1>
                                                <Ratings rating={data?.ratings} />
                                            </div>
                                            <p>{item.comment}</p>
                                        </div>
                                    </div>
                                ))
                            }

                            <div className="w-full flex justify-center">
                                {
                                    data && data.reviews.length === 0 && (
                                        <h5>No Reviews have for this product!</h5>
                                    )
                                }
                            </div>
                        </div>
                    ) : null
            }
            {
                active === 3 && (
                    <div className="w-full block md:flex p-5">
                        <div className="w-full md:w-[50%]">
                            <div className="flex items-center">
                                <img className='w-[50px] h-[50px] rounded-full' src={getImageUrl(data?.shop?.avatar)} alt="" />
                                <div className='pl-3'>
                                    <h3 className={styles.shop_name}>
                                        {data.shop.name}
                                    </h3>
                                    <h5 className='pb-2 text-[15px]'>
                                        ({averageRating}/5) Ratings
                                    </h5>
                                </div>
                            </div>
                            <p className='pt-2'>
                                {data.shop.description}
                            </p>
                        </div>
                        <div className="w-full md:w-[50%] mt-5 md:mt-0 md:flex flex-col items-end">
                            <div className="text-left">
                                <h5 className="font-[600]">
                                    Joined on: <span className='font-[500]'>{data.shop?.createdAt?.slice(0, 10)}</span>
                                </h5>
                                <h5 className="font-[600] pt-3">
                                    Total Products: <span className='font-[500]'>{products?.length}</span>
                                </h5>
                                <h5 className="font-[550] pt-3">
                                    Total Reviews: <span className='font-[500]'>{data.reviews.length}</span>
                                </h5>
                                <Link to={`/user/${data.shop._id}`}>
                                    <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                                        <h4 className='text-white'>Visit Shop</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ProductDetails
