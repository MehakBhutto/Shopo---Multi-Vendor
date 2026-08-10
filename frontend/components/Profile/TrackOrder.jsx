import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getAllOrdersOfUser } from '../../redux/actions/order';

const TrackOrder = () => {

    const { orders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user?._id))
    }, [dispatch, user?._id]);

    useEffect(()=>{},[orders])
    const data = orders && orders.find((item) => item?._id === id);

    return (
        <div className="w-full h-[80vh] flex items-center justify-center">
            <>
                {
                    data && data?.status === 'Processing' ? (
                        <h1 className='text-center text-[20px]'>
                            Your Order is processing in shop..
                        </h1>
                    ) : (
                        data?.status === "Transferred to delivery partner" ? (
                            <h1 className='text-center text-[20px]'>
                                Your Order is on the way for delievery partner..
                            </h1>
                        ) : (
                            data?.status === "Shipping" ? (
                                <h1 className='text-center text-[20px]'>
                                    Your Order is coming with our delievery partner..
                                </h1>
                            ) : (
                                data?.status === "Received" ? (
                                    <h1 className='text-center text-[20px]'>
                                        Your Order is in the city. Our delievery man will deliever it..
                                    </h1>
                                ) : (
                                    data?.status === "On the way" ? (
                                        <h1 className='text-center text-[20px]'>
                                            Our delievery man is going to deliever your order..
                                        </h1>
                                    ) : (
                                        data?.status === "Delivered" ? (
                                            <h1 className='text-center text-[20px]'>
                                                Your Order is Delivered
                                            </h1>
                                        ) : (
                                            data?.status === "Processing refund" ? (
                                                <h1 className='text-center text-[20px]'>
                                                    Your refund is Processing
                                                </h1>
                                            ) : (
                                                data?.status === "Refund Success" ? (
                                                    <h1 className='text-center text-[20px]'>
                                                        Your Refund is Success
                                                    </h1>
                                                ) : (
                                                    null
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                }
            </>
        </div>
    )
}

export default TrackOrder
