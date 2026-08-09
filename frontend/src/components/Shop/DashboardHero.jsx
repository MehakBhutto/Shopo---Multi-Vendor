import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai'
import styles from '../../styles/styles'
import { Link } from 'react-router-dom'
import { MdBorderClear } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material'
import { getAllOrdersOfShop } from '../../redux/actions/order'
import { getAllProductsShop } from '../../redux/actions/product'

const DashboardHero = () => {

    const dispatch = useDispatch();

    const { seller } = useSelector((state) => state.seller);
    const { orders } = useSelector((state) => state.order);
    const { products } = useSelector((state) => state.product);

    const [deliveredOrder, setDeliveredOrder] = useState(null);

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
        dispatch(getAllProductsShop(seller._id));
    }, [dispatch, seller._id]);

    useEffect(() => {
        if (orders) {
            const orderData = orders.filter((item) => item.status === "Delivered");
            setDeliveredOrder(orderData);
        }
    }, [orders]);

    const totalEarningWithoutTax = deliveredOrder && deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);

    const serviceCharge = totalEarningWithoutTax * 0.1;
    const availableBalance = totalEarningWithoutTax - serviceCharge.toFixed(2);

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                // FIXED: Replaced params.getValue with direct row parameter check
                return params.row.status === "Delivered" ? 'text-green-600' : "text-red-600";
            },
        },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7 },
        { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 0.8 },
        {
            field: "action",
            headerName: "Actions",
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.id}`}>
                        <Button>
                            <AiOutlineArrowRight size={20} />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const rows = [];

    orders && orders.forEach((item) => {
        rows.push({
            id: item._id,
            itemsQty: item.cart.length,
            total: "US$ " + item.totalPrice,
            status: item.status,
        });
    });

    return (
        <div className='w-full p-8'>
            <h3 className='text-[22px] font-Poppns pb-2'>Overview</h3>
            <div className="w-full block md:flex items-center justify-between">
                <div className="w-full mb-4 md:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className='flex items-center'>
                        <AiOutlineMoneyCollect
                            size={30}
                            className='mr-2'
                            fill='#00000085'
                        />
                        <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#0000085]`}>
                            Account balance <span className='text-[16px]'>(with 10% service)</span>
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] !font-[500]">
                        ${availableBalance}
                    </h5>
                    <Link to={`/dashboard-withdraw-money`}>
                        <h5 className='pt-4 pl-2 text-[#077f9c]'>
                            Withdraw Money
                        </h5>
                    </Link>
                </div>

                <div className="w-full mb-4 md:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className='flex items-center'>
                        <MdBorderClear
                            size={30}
                            className='mr-2'
                            fill='#00000085'
                        />
                        <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#0000085]`}>
                            All Orders
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] !font-[500]">
                        {orders && orders.length}
                    </h5>
                    <Link to={`/dashboard-orders`}>
                        <h5 className='pt-4 pl-2 text-[#077f9c]'>
                            View Orders
                        </h5>
                    </Link>
                </div>

                <div className="w-full mb-4 md:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className='flex items-center'>
                        <AiOutlineMoneyCollect
                            size={30}
                            className='mr-2'
                            fill='#00000085'
                        />
                        <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#0000085]`}>
                            All Products
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] !font-[500]">
                        {products && products.length}
                    </h5>
                    <Link to={`/dashboard-products`}>
                        <h5 className='pt-4 pl-2 text-[#077f9c]'>
                            View Products
                        </h5>
                    </Link>
                </div>
            </div>

            <br />

            <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
            <div className="w-full min-h-[45vh] bg-white rounded">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    // initialState={{
                    //   pagination: { paginationModel: { pageSize: 10 } },
                    // }}
                    pageSize={10}
                    disableRowSelectionOnClick
                    autoHeight
                />
            </div>
        </div>
    )
}

export default DashboardHero
