import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { deleteProduct, getAllProductsShop } from '../../redux/actions/product';
import Loader from '../Layout/Loader';
import { Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import styles from '../../styles/styles';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import { server } from '../../../server';
import { toast } from 'react-toastify';

const AllCoupouns = () => {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [minAmount, setMinAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [coupouns, setCoupouns] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);

    const { products } = useSelector((state) => state.product);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!seller?._id) {
            return;
        }

        setIsLoading(true);
        axios.get(`${server}/coupoun/get-coupoun/${seller._id}`,
            {withCredentials: true}
        ).then((res) => {
            setIsLoading(false);
            console.log(res.data);
            setCoupouns(res.data.coupounCodes)
        }).catch((err) => {
            setIsLoading(false);
        })
    }, [seller?._id]);

    useEffect(() => {
        if (seller?._id) {
            dispatch(getAllProductsShop(seller._id));
        }
    }, [dispatch, seller?._id]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
        window.location.reload();
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        await axios.post(`${server}/coupoun/create-coupoun-code`, 
            { name, value, seller, minAmount, maxAmount, selectedProducts,}, 
            {withCredentials: true})
        .then((res) => {
            toast.success("Coupoun code created successfully!");
            setOpen(false);
            window.location.reload();
        }).catch((e) => {
            toast.error(e.response.data.message);
        })
    };

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

    coupouns && coupouns.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            price: item.value + " %",
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
                        <div className="w-full flex justify-end mr-3 mb-3">
                            <div className={`${styles.button} !w-max !h-[48px] px-2 !rounded-[5px]`}
                                onClick={() => setOpen(true)}>
                                <span className="text-white">Create Coupoun Code</span>
                            </div>
                        </div>
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
                        {
                            open && (
                                <div className="fixed top-0 left-0 w-full h-screen z-[20000] bg-[#00000062] flex items-center justify-center ">
                                    <div className="md:w-[50%] w-[90%] h-[80vh] bg-white rounded-md shadow relative p-3 overflow-y-scroll">
                                        <div className="w-full flex justify-end">
                                            <RxCross1
                                                size={27}
                                                className='cursor-pointer'
                                                onClick={() => setOpen(false)}
                                            />
                                        </div>
                                        <h5 className="text-[28px] font-Poppins text-center">Create Coupoun Code</h5>
                                        {/* create coupoun code */}
                                        <form onSubmit={handleSubmit} aria-required={true}>
                                            <br />
                                            <div>
                                                <label className="pb-2">
                                                    Name <span className="text-red-500">*</span>
                                                    <input
                                                        type="text"
                                                        name='name'
                                                        value={name}
                                                        className='mt-2 appearance-none block w-full h-[35px] px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder='Enter your coupoun code name...'
                                                        required
                                                    />
                                                </label>
                                            </div>
                                            <br />
                                            <div>
                                                <label className="pb-2">
                                                    Discount Percentage <span className="text-red-500">*</span>
                                                    <input
                                                        type="number"
                                                        name='value'
                                                        value={value}
                                                        className='mt-2 appearance-none block w-full h-[35px] px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                        onChange={(e) => setValue(e.target.value)}
                                                        placeholder='Enter your coupoun code value...'
                                                        required
                                                    />
                                                </label>
                                            </div>
                                            <br />
                                            <div>
                                                <label className="pb-2">
                                                    Max Amount <span className="text-red-500">*</span>
                                                    <input
                                                        type="number"
                                                        name='value'
                                                        value={minAmount}
                                                        className='mt-2 appearance-none block w-full h-[35px] px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                        onChange={(e) => setMinAmount(e.target.value)}
                                                        placeholder='Enter your coupoun code min amount...'
                                                        required
                                                    />
                                                </label>
                                            </div>
                                            <br />
                                            <div>
                                                <label className="pb-2">
                                                    Max Amount <span className="text-red-500">*</span>
                                                    <input
                                                        type="number"
                                                        name='value'
                                                        value={maxAmount}
                                                        className='mt-2 appearance-none block w-full h-[35px] px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                        onChange={(e) => setMaxAmount(e.target.value)}
                                                        placeholder='Enter your coupoun code max amount...'
                                                        required
                                                    />
                                                </label>
                                            </div>
                                            <br />
                                            <div>
                                                <label className="pb-2">
                                                    Selected Product <span className="text-red-500">*</span>
                                                </label>
                                                <select className='w-full mt-2 border h-[35px] rounded-[5px]'
                                                    value={selectedProducts} onChange={(e) => setSelectedProducts(e.target.value)}>
                                                    <option value="">Choose a selected Products</option>
                                                    {
                                                        products && products.map((i) => (
                                                            <option value={i.name} key={i.name}>
                                                                {i.name}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <br />
                                            <div>
                                                <input
                                                    type="submit"
                                                    value={"Create"}
                                                    className='mt-2 appearance-none block w-full h-[35px] px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                    required
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

export default AllCoupouns
