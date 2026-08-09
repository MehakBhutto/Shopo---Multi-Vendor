import React from 'react'
import { RxCross1 } from 'react-icons/rx';
import { BsCartPlus } from 'react-icons/bs'
import styles from '../../styles/styles';
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { backend_url } from '../../../server';
import { removeFromWishlist } from '../../redux/actions/wishlist';

const Wishlist = ({ setOpenWishList }) => {
    const { wishlist } = useSelector((state) => state.wishlist);

    return (
        <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20'>
            <div className="fixed top-0 right-0 min-h-full w-[25%] min-w-[320px] bg-white flex flex-col shadow-sm">
                {
                    wishlist && wishlist.length === 0 ? (
                        <div className="w-full h-screen flex items-center justify-center">
                            <div className="flex w-full items-center justify-center">
                                <div className="flex w-full justify-end pt-5 px-5 fixed top-3 right-3">
                                    <RxCross1
                                        size={25}
                                        className='cursor-pointer'
                                        onClick={() => setOpenWishList(false)}
                                    />
                                </div>
                                <h5>Wishlist is Empty!</h5>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex w-full justify-end pt-5 pr-5">
                                <RxCross1
                                    size={25}
                                    className='cursor-pointer'
                                    onClick={() => setOpenWishList(false)} />
                            </div>
                            <div className={`${styles.normalFlex} p-4`}>
                                <AiOutlineHeart size={25} />
                                <h5 className='pl-2 text-[20px] font-[500]'>
                                    {wishlist?.length || 0} items
                                </h5>
                            </div>

                            <div className='flex-1 overflow-y-auto border-t'>
                                {
                                    wishlist && wishlist.map((item, index) => (
                                        <CartSingle key={index} data={item} />
                                    ))
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

const CartSingle = ({ data }) => {

    const dispatch = useDispatch();

    const removeFromWishListhandler = (data) => {
        dispatch(removeFromWishlist(data))
    }

    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                <RxCross1
                    onClick={() => removeFromWishListhandler(data)}
                    size={13}
                    className="cursor-pointer"
                />
                <img src={`${backend_url}${data?.images?.[0]}`} alt={data?.name} className='w-[80px] h-[80px] ml-2 rounded-[5px] object-contain' />
                <div className='pl-[5px] flex-1'>
                    <h2 className='text-sm font-medium'>{data?.name}</h2>
                    <h4 className='font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto'>
                        USD{data?.discountPrice || data?.price || 0}
                    </h4>
                </div>
                <div>
                    <BsCartPlus size={20} className='cursor-pointer' title="Add to Cart" />
                </div>
            </div>
        </div>
    )
}

export default Wishlist
