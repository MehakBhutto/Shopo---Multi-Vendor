import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProductsShop } from '../../redux/actions/product';
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import Loader from '../Layout/Loader';
import { Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { deleteEvent, getAllEventsShop } from '../../redux/actions/event';

const AllEvents = () => {

    const { events, isLoading } = useSelector((state) => state.event);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllEventsShop(seller._id));
        }
    }, [dispatch, seller?._id]);

    const handleDelete = (id) => {
        dispatch(deleteEvent(id));
        // window.location.reload();
    }

    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: 'Name',
            minWidth: 100,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: 'Price',
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "stock",
            headerName: 'Stock',
            type: "number",
            minWidth: 80,
            flex: 0.5,
        },
        {
            field: "sold",
            headerName: 'Sold Out',
            type: "number",
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: "preview",
            headerName: 'Preview',
            type: "number",
            minWidth: 100,
            flex: 0.8,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/product/${params.id}`}>
                            <Button>
                                <AiOutlineEye size={20} />
                            </Button>
                        </Link>
                    </>
                )
            }
        },
        {
            field: "Delete",
            headerName: 'Delete',
            type: "number",
            minWidth: 120,
            flex: 0.8,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                        onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </Button>
                    </>
                )
            }
        },
    ];

    const rows = [];

    events && events.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            price: "US$" + item.discountPrice,
            stock: item.stock,
            sold: 10,
        })
    })

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

export default AllEvents
