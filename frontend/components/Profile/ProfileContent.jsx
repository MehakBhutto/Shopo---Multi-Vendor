import React, { useState, useEffect } from 'react';
import { backend_url, server } from '../../../server';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import styles from '../../styles/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { MdOutlineTrackChanges } from 'react-icons/md';
import { deleteUserAddress, updateUserAddress, updateUserInformation } from '../../redux/actions/user';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { Country, State, City } from 'country-state-city';
import axios from 'axios';
import { getAllOrdersOfUser } from '../../redux/actions/order';

const ProfileContent = ({ active }) => {
    const { user, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInformation(name, email, phoneNumber, password));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatar(file);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.put(`${server}/user/update-avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            window.location.reload();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update avatar");
        }
    };

    useEffect(() => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPhoneNumber(user?.phoneNumber || "");
    }, [user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <div className='w-full px-2 md:px-8'>
            {/* Profile Info */}
            {active === 1 && (
                <>
                    <div className="flex justify-center w-full my-6">
                        <div className="relative">
                            <img
                                src={`${backend_url}${user?.avatar}`}
                                alt="Avatar"
                                className='w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]'
                            />
                            {/* Clickable Camera Badge linked to hidden input */}
                            <label
                                htmlFor="avatar-input"
                                className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] hover:bg-gray-300 transition-colors"
                            >
                                <AiOutlineCamera size={18} />
                            </label>
                            <input
                                type="file"
                                id="avatar-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="w-full px-5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className='block pb-2 text-sm font-medium'>Full Name</label>
                                    <input type="text" className={`${styles.input}`} value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className='block pb-2 text-sm font-medium'>Email Address</label>
                                    <input type="email" className={`${styles.input}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className='block pb-2 text-sm font-medium'>Phone Number</label>
                                    <input type="tel" className={`${styles.input}`} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                                </div>
                                <div>
                                    <label className='block pb-2 text-sm font-medium'>Enter your password</label>
                                    <input type="password" className={`${styles.input}`} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </div>

                            <button type="submit" className="w-full md:w-[250px] h-[40px] border border-[#3a24bc] text-center text-[#3a24bc] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24bc] hover:text-white transition-all duration-300">
                                Update
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/* Orders */}
            {active === 2 && (
                <div className="w-full pt-4">
                    <AllOrder userId={user._id}/>
                </div>
            )}

            {/* Refund */}
            {active === 3 && (
                <div className="w-full pt-4">
                    <AllRefundOrders userId={user._id}/>
                </div>
            )}

            {/* Track Order */}
            {active === 5 && (
                <div className="w-full pt-4">
                    <TrackOrder  userId={user._id}/>
                </div>
            )}
            {/* Payment Method */}
            {active === 6 && (
                <div className="w-full pt-4">
                    <ChangePassword />
                </div>
            )}
            {/* user Address */}
            {active === 7 && (
                <div className="w-full pt-4">
                    <Address />
                </div>
            )}
        </div>
    );
};

const AllOrder = ({ userId }) => {

    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            dispatch(getAllOrdersOfUser(userId));
        }
    }, [dispatch, userId]);

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
                    <Link to={`/user/order/${params.id}`}>
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
        <div className="w-full bg-white rounded-md shadow-sm">
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                // initialState={{
                //   pagination: { paginationModel: { pageSize: 10 } },
                // }}
                disableRowSelectionOnClick
                autoHeight
            />
        </div>
    );
};

const AllRefundOrders = ({userId}) => {

    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            dispatch(getAllOrdersOfUser(userId));
        }
    }, [dispatch, userId]);

    const eligibleOrders = orders  && orders.filter((item) => item.status === "Processing refund");

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
                    <Link to={`/user/order/${params.id}`}>
                        <Button>
                            <AiOutlineArrowRight size={20} />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const rows = [];
    eligibleOrders && eligibleOrders.forEach((item) => {
        rows.push({
            id: item._id,
            itemsQty: item.cart.length,
            total: "US$ " + item.totalPrice,
            status: item.status,
        });
    });

    return (
        <div className="w-full bg-white rounded-md shadow-sm">
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                // initialState={{
                //   pagination: { paginationModel: { pageSize: 10 } },
                // }}
                disableRowSelectionOnClick
                autoHeight
            />
        </div>
    );
};

const TrackOrder = ({userId}) => {
    
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            dispatch(getAllOrdersOfUser(userId));
        }
    }, [dispatch, userId]);

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
                    <Link to={`/user/track/order/${params.id}`}>
                        <Button>
                            <MdOutlineTrackChanges size={20} />
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
        <div className='pl-8 pt-1'>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                autoHeight
            />
        </div>
    )
}

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordChangeHandler = async (e) => {
        e.preventDefault();

        await axios.put(`${server}/user/update-user-password`, {
            oldPassword,
            newPassword,
            confirmPassword
        }, {
            withCredentials: true
        }).then((res) => {
            toast.success(res.data.message);
            setOldPassword("");
            setConfirmPassword("");
            setNewPassword("");
        });
    }

    return (
        <div className="w-full px-5">
            <div className="flex w-full items-center justify-center mb-10">
                <h1 className='block  text-[25px] font-[600] text-[#000000ba] pb-2'>
                    Change Password
                </h1>
            </div>

            <div className="w-full">
                <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col items-center">
                    <div className="w-[100%] md:w-[50%]">
                        <label className="block pb-2">
                            Enter your old password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-[100%] md:w-[50%]">
                        <label className="block pb-2">
                            Enter your new password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-[100%] md:w-[50%]">
                        <label className="block pb-2">
                            Enter your confirm password
                        </label>
                        <input
                            type="password"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-full pb-2 flex justify-center">
                        <button type="submit" className="w-full md:w-[250px] h-[40px] border border-[#3a24bc] text-center text-[#3a24bc] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24bc] hover:text-white transition-all duration-300">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Address = () => {

    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [addressType, setAddressType] = useState("");
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.user);

    const addressTypeData = [
        {
            name: "Default",
        },
        {
            name: "Home",
        },
        {
            name: "Office",
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here

        if (addressType === "" || country === "" || city === "" || address1 === "" || zipCode === "") {
            toast.error("Please fill all the required fields");
        } else {
            dispatch(updateUserAddress(address1, address2, city, country, zipCode, addressType));
            toast.success("User address updated successfully!");
            setOpen(false)
            setCountry("");
            setCity("");
            setAddress1("");
            setAddress2("");
            setZipCode("");
            setAddressType("");
        }
    };

    const handleDelete = async (item) => {
        await dispatch(deleteUserAddress(item._id))
        toast.success("User address deleted Successfully!")
    };

    useEffect(() => {
    }, [user])

    return (
        <div className="w-full px-5">
            {
                open && (

                    <div className='fixed w-full h-screen bg-[#0000004b] right-0 top-0 flex items-center justify-center'>
                        <div className='w-[50%] h-[80vh] bg-white rounded shadow relative !overflow-y-scroll'>
                            <div className="w-full flex justify-end p-3">
                                <RxCross1
                                    size={25}
                                    className='cursor-pointer'
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                            <h1 className='font-Poppins text-center text-[25px]'>Add New Address</h1>
                            <div className='w-full'>
                                <form aria-required={true} onSubmit={handleSubmit}>
                                    {/* Form fields would go here */}
                                    <div className="w-full block p-8">
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Country</label>
                                            <select className={`${styles.input} w-full`} value={country} onChange={(e) => setCountry(e.target.value)}>
                                                <option className="block pb-2" value="">Choose your country</option>
                                                {Country && Country.getAllCountries().map((item) => (
                                                    <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-full pb-2">
                                            <label className="block pb-2">City</label>
                                            <select className={`${styles.input} w-full`} value={city} onChange={(e) => setCity(e.target.value)}>
                                                <option className="block pb-2" value="">Choose your city</option>
                                                {City && City.getCitiesOfCountry(country).map((item) => (
                                                    <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Address1</label>
                                            <input
                                                type="address"
                                                placeholder="Enter your address1"
                                                value={address1}
                                                onChange={(e) => setAddress1(e.target.value)}
                                                className={`${styles.input} w-full`}
                                            />
                                        </div>
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Address2</label>
                                            <input
                                                type="address"
                                                placeholder="Enter your address2"
                                                value={address2}
                                                onChange={(e) => setAddress2(e.target.value)}
                                                className={`${styles.input} w-full`}
                                            />
                                        </div>
                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Zip Code</label>
                                            <input
                                                type="number"
                                                placeholder="Enter your zip code"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                                className={`${styles.input} w-full`}
                                            />
                                        </div>

                                        <div className="w-full pb-2">
                                            <label className="block pb-2">Address Type</label>
                                            <select className={`${styles.input} w-full`} value={addressType} onChange={(e) => setAddressType(e.target.value)}>
                                                <option className="block pb-2" value="">Choose your address type</option>
                                                {addressTypeData && addressTypeData.map((item) => (
                                                    <option className="block pb-2" key={item.name} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-full pb-2">
                                            <input
                                                type="submit"
                                                className={`${styles.input} !rounded-md mt-5 cursor-pointer`}
                                                required
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className="flex w-full items-center justify-between">
                <h1 className='text-[25px] font-[600] text-[#000000ba] pb-2'>
                    My Addresses
                </h1>
                <div className={`${styles.button} !rounded-md`}
                    onClick={() => setOpen(true)}>
                    <span className='text-[#fff]'>Add New</span>
                </div>
            </div>
            <br />
            {user && user.address.map((item, index) => (
                <>
                    <div key={index} className="w-full bg-white h-[70px] flex items-center px-3 shadow justify-between pr-1">
                        <div className="flex items-center">
                            <h5 className='pl-5 font-[600]'>{item.addressType}</h5>
                        </div>
                        <div className="pl-8 flex items-center">
                            <h6>{item.address1} {item.address2}, {item.city}</h6>
                        </div>
                        <div className="pl-8 flex items-center">
                            <h6>{user.phoneNumber}</h6>
                        </div>
                        <div className='min-w-[10%] flex items-center justify-between pl-8'>
                            <AiOutlineDelete
                                size={25}
                                className='cursor-pointer'
                                onClick={() => handleDelete(item)}
                            />
                        </div>
                    </div>
                    <br />
                </>
            ))}
            {user && user.address.length === 0 && (
                <h5 className='text-center pt-8 text-[18px]'>No address found!</h5>
            )}
        </div>
    )
}

export default ProfileContent;
