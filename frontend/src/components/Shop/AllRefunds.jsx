import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProductsShop } from '../../redux/actions/product';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import Loader from '../Layout/Loader';
import { Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { getAllOrdersOfShop } from '../../redux/actions/order';

const AllRefunds = () => {

    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        if (seller._id) {
            dispatch(getAllOrdersOfShop(seller._id));
        }
    }, [dispatch, seller._id]);

    useEffect(()=>{},[orders]);

    const refundOrders = orders && orders.filter((item) => item?.status.toLowerCase().includes('refund'))

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
    refundOrders && refundOrders.forEach((item) => {
        rows.push({
            id: item._id,
            itemsQty: item.cart.length,
            total: "US$ " + item.totalPrice,
            status: item.status,
        });
    });

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className='w-full mx-8 pt-1 mt-10 bg-white'>
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
                )
            }
        </>
    )
}

export default AllRefunds
