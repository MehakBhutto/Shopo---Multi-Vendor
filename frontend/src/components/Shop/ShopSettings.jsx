import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getImageUrl, server } from '../../../server';
import { AiOutlineCamera } from 'react-icons/ai';
import styles from '../../styles/styles';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShopSettings = () => {

    const { seller } = useSelector((state) => state.seller);
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState(seller?.name);
    const [description, setDescription] = useState(seller?.description || "");
    const [address, setAddress] = useState(seller?.address);
    const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber);
    const [zipCode, setZipCode] = useState(seller?.zipCode);

    const handleImageChange = async (e) => {
        e.preventDefault()

        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();

        formData.append("file", file);

        await axios.put(`${server}/shop/update-shop-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        }).then((res) => {
            console.log(res.data);
            toast.success('Avatar updated successfully!');
            window.location.reload()
        })
            .catch((e) => toast.error(e.response.data.message))
    };

    const updateHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.put(
                `${server}/shop/update-seller-info`,
                { name, description, address, phoneNumber, zipCode },
                { withCredentials: true }
            );
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };


    return (
        <div className='w-full min-h-screen flex flex-col items-center'>
            <div className="flex w-full sm:w-[80%] flex-col justify-center my-10">
                <div className="w-full flex items-center justify-center">
                    <div className="relative">
                        <img
                            src={avatar ? URL.createObjectURL(avatar) : getImageUrl(seller?.avatar)}
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

                {/* shop info */}
                <form
                    onSubmit={updateHandler}
                    aria-required={true}
                    className="flex flex-col items-center"
                >

                    <div className="w-[100%] md:w-[50%]">
                        <div className='w-full'>
                            <label className="block pl-2">
                                Shop Name
                            </label>
                        </div>
                        <input
                            type="text"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <br />

                    <div className="w-[100%] md:w-[50%]">
                        <div className='w-full'>
                            <label className="block pl-2">
                                Shop Description
                            </label>
                        </div>
                        <input
                            type="text"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={description}
                            placeholder={seller?.description ? seller?.description : "Enter your Shop Description"}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <br />
                    <div className="w-[100%] md:w-[50%]">
                        <div className='w-full'>
                            <label className="block pl-2">
                                Shop Address
                            </label>
                        </div>
                        <input
                            type="text"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={address}
                            placeholder={seller?.address ? seller?.address : "Enter your Shop Address!"}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <br />

                    <div className="w-[100%] md:w-[50%]">
                        <div className='w-full'>
                            <label className="block pl-2">
                                Shop Phone Number
                            </label>
                        </div>
                        <input
                            type="number"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={phoneNumber}
                            placeholder={seller?.phoneNumber ? seller?.phoneNumber : "Enter your Shop Phone Number!"}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <br />

                    <div className="w-[100%] md:w-[50%]">
                        <div className='w-full'>
                            <label className="block pl-2">
                                Shop Zip Code
                            </label>
                        </div>
                        <input
                            type="number"
                            className={`${styles.input} !w-full mb-4 md:mb-0`}
                            value={zipCode}
                            placeholder={seller?.zipCode ? seller?.zipCode : "Enter your Shop Zip Code!"}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w-full pb-2 flex justify-center">
                        <button
                            type="submit"
                            className="w-full md:w-[250px] h-[40px] border border-[#3a24bc] text-center text-[#3a24bc] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24bc] hover:text-white transition-all duration-300">
                            Update
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ShopSettings
