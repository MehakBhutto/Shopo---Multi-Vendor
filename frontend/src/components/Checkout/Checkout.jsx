import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/styles';
import { Country, City } from 'country-state-city';
import { useSelector } from 'react-redux';
import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import axios from 'axios';
import { server } from '../../../server';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { user } = useSelector((state) => state.user);
    const { cart } = useSelector((state) => state.cart);

    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [userInfo, setUserInfo] = useState(false);
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState(null);
    const [coupounCode, setCoupounCode] = useState("");
    const [discountPrice, setDiscountPrice] = useState(null);
    const [coupounCodeData, setCoupounCodeData] = useState(null);
    const navigate = useNavigate();

    const paymentSubmit = () => {
        if( !address1 ||
            !zipCode ||
            !country ||
            !city ){
            return toast.error("Please choose your delievery address!")
        }
        const shippingAddress = {
            address1,
            address2,
            zipCode,
            country,
            city
        };

        const orderData = {
            cart,
            totalPrice,
            subTotalPrice,
            shipping,
            discountPrice,
            shippingAddress,
            user
        }

        //update local with the updated orders arraayy
        localStorage.setItem("latestOrder", JSON.stringify(orderData));
        navigate('/payment')
    };

    const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

    // this is shipping cost variable 
    const shipping = subTotalPrice * 0.1;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = coupounCode;

        await axios.get(`${server}/coupoun/get-coupoun-value/${name}`)
        .then((res) => {
            const shopId =  res.data?.coupounCode?.shop?._id;
            const coupounCodeValue = res.data?.coupounCode?.value;

            if(res.data.coupounCode){
                const isCoupounValid = cart && cart.filter((item) => item.shopId === shopId);

                if(isCoupounValid.length === 0) {
                    setCoupounCode("");
                    return toast.error("Coupoun code is not valid for this shop")
                }
                
                const eligiblePrice = isCoupounValid.reduce(
                    (acc, item) => acc + item.qty * item.discountPrice, 0
                );

                const discountPrice = (
                    (eligiblePrice * coupounCodeValue) / 100
                );
                setDiscountPrice(discountPrice)
                setCoupounCodeData(res.data.coupounCode);
                setCoupounCode("");
            }
        }).catch((e) => toast.error(e.response?.data?.message))
    };

    const discountPercentage = coupounCodeData ? discountPrice : '';

    const totalPrice = coupounCodeData 
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2) 
    : (subTotalPrice + shipping).toFixed(2);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => { }, [user]);

    return (
        <div className='w-full flex flex-col items-center py-8'>
            <div className="w-[90%] lg:w-[70%] block md:flex">
                <div className="w-full md:w-[65%]">
                    <ShippingInfo
                        user={user}
                        country={country}
                        setCountry={setCountry}
                        city={city}
                        setCity={setCity}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        address1={address1}
                        setAddress1={setAddress1}
                        address2={address2}
                        setAddress2={setAddress2}
                        zipCode={zipCode}
                        setZipCode={setZipCode}
                    />
                </div>
                <div className='w-full md:w-[35%] md:mt-0 mt-8'>
                    <CartData
                        handleSubmit={handleSubmit}
                        totalPrice={totalPrice}
                        shipping={shipping}
                        subTotalPrice={subTotalPrice}
                        coupounCode={coupounCode}
                        setCoupounCode={setCoupounCode}
                        discountPercentage={discountPercentage}
                    />
                </div>
            </div>
            <div className={`${styles.button} w-[150px] md:w-[280px]`} onClick={paymentSubmit}>
                <h5 className='text-white'>Go to Payment</h5>
            </div>
        </div>
    )
}

const ShippingInfo = ({
    user,
    country,
    setCountry,
    city,
    setCity,
    userInfo,
    setUserInfo,
    address1,
    setAddress1,
    address2,
    setAddress2,
    zipCode,
    setZipCode, }) => {

    return (
        <div className='w-full md:w-[95%] bg-white rounded-md p-5 pb-8'>
            <h5 className='text-[18px] font-[500]'>Shipping Address</h5>
            <br />
            <form>
                <div className='w-full flex pb-3'>
                    <div className='w-[50%]'>
                        <label className='blc pb-2'>Full Name</label>
                        <input
                            type="text"
                            value={user && user.name}
                            className={`${styles.input} !w-[95%]`}
                            required
                        />
                    </div>
                    <div className='w-50%'>
                        <label className='block pb-2'>Email Address</label>
                        <input
                            type="text"
                            className={`${styles.input}`}
                            value={user && user.email}
                            required
                        />
                    </div>
                </div>

                <div className='w-full flex pb-3'>
                    <div className='w-[50%]'>
                        <label className='block pb-2'>Phone Number</label>
                        <input
                            type="number"
                            className={`${styles.input} !w-[95%]`}
                            value={user && user.phoneNumber}
                            required />
                    </div>
                    <div className='w-50%'>
                        <label className='block pb-2'>Zip Code</label>
                        <input
                            type="number"
                            className={`${styles.input}`}
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='w-full flex pb-3'>
                    <div className='w-[50%]'>
                        <label className='block pb-2'>  Country</label>
                        <select
                            className='w-[98%] border h-[40px] rounded-[5px]'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}>
                            <option className='block pb-2' vlaue="">Choose Your country</option>
                            {Country && Country.getAllCountries().map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='w-50%'>
                        <label className='block pb-2'>City</label>
                        <select
                            className='w-[98%] border h-[40px] rounded-[5px]'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}>
                            <option className='block pb-2' vlaue="">Choose Your city </option>
                            {City.getCitiesOfCountry(country).map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='w-full flex pb-3'>
                    <div className='w-[50%]'>
                        <label className='block pb-2'>Address1</label>
                        <input
                            type="address"
                            className={`${styles.input} !w-[95%]`}
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            required
                        />
                    </div>
                    <div className='w-50%'>
                        <label className='block pb-2'>Address2</label>
                        <input
                            type="address"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            className={`${styles.input}`}
                        />
                    </div>
                </div>
                <br />
            </form>
            <h5
                className='text-[18px] cursor-pointer inline-block'
                onClick={() => setUserInfo(!userInfo)}>
                Choose From Saved Address {!userInfo ? (<FiChevronUp className='!inline-block'/>) : (<FiChevronDown className='!inline-block'/>)}
            </h5>
            {
                userInfo && (
                    <div>
                        {
                            user?.address?.map((item, index) => (
                                <div key={index} className="w-full flex mt-1">
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        value={item.addressType}
                                        onChange={(e) => setAddress1(item.address1) ||
                                            setAddress2(item.address2) ||
                                            setZipCode(item.zipCode) ||
                                            setCountry(item.country) ||
                                            setCity(item.city)
                                        }
                                    />
                                    <h2>{item.addressType}</h2>
                                </div>
                            ))
                        }
                    </div>
                )
            }

        </div>
    )
}

const CartData = ({
    handleSubmit,
    totalPrice,
    shipping,
    subTotalPrice,
    coupounCode,
    setCoupounCode,
    discountPercentage
}) => {
    return (
        <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
                <h3 className="text-[16p] font-[400] tet-[#000000a4]">subtotal:</h3>
                <h5 className='text-[18px] font-[600]'>${subTotalPrice}</h5>
            </div>
            <br />
            <div className='flex justify-between'>
                <h3 className='text-[16px] font-[400] text-[#000000a4]'>shipping:</h3>
                <h5 className='text-[18px] font-[600]'>{shipping}</h5>
            </div>
            <br />
            <div className='flex justify-between border-b pb-3'>
                <h3 className='text-[16px] font-[400] text-[#000000a4]'>Discount:</h3>
                <h5 className='text-[18px] font-[600]'>- {discountPercentage ? "$" + discountPercentage.toString() : null}</h5>
            </div>
            <h5 className='text-[18px] font-[600] text-end pt-3'>${totalPrice}</h5>
            <br />
            <form onSubmit={handleSubmit}>
                <input type="text"
                    className={`${styles.input} h-[40px] pl-2`}
                    placehlder="Coupoun code"
                    value={coupounCode}
                    onChange={(e) => setCoupounCode(e.target.value)}
                    required />
                <input type="submit" value="Apply code"
                    className={`w-full h-[40p] border border-[#f63b60] text-[3f63b60] rounded-[3px] mt-8 cursor-pointer`}
                    required />
            </form>
        </div>
    )
}
export default Checkout
