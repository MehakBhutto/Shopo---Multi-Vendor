import React from 'react'
import { Link } from "react-router-dom";
import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineTwitter, } from "react-icons/ai";
import { footerSupportLinks, footerCompanyLinks, footerProductLinks } from "../../static/data.jsx";

export default function Footer() {
    return (
        <>
            <div className="flex justify-between md:flex md:justify-between md:items-center sm:px-12 px-7 bg-[#342ac8] py-7">
                <h1 className='lg:text-4xl text-3xl text-black md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5'>
                    <span className='text-[#56d879]'>Subscribe</span> us to get news <br /> events and offers!
                </h1>
                <div className='flex my-[10px]'>
                    <input type="text" required placeholder='Enter your email...'
                        className='bg-white text-gray-800 sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none' />
                    <button className='bg-[#56d879] hover:bg-teal-500 duration-300 px-5 py-2.5 rounded-md text-white md:w-auto w-full'>
                        Submit
                    </button>
                </div>
            </div>
            <div className="bg-[#000] text-white">

                <footer className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 py-16 sm:text-center">
                    <ul className='px-5 text-center sm:text-start flex sm:block flex-col items-center'>
                        <h1 className='text-bold text-3xl text-heading tracking-widest font-bold bg-white/50 rounded px-4 py-4 font-italic'><img src="https://shopo-next.vercel.app/assets/images/logo.svg" alt="" /></h1>
                        <br />
                        <p>The home and elements needed to create beautiful product.</p>
                        <div className="flex items-center mt-[15px]">
                            <AiFillFacebook
                                size={25}
                                style={{ marginLeft: "15px", cursor: "pointer" }}
                            />
                            <AiOutlineTwitter
                                size={25}
                                style={{ marginLeft: "15px", cursor: "pointer" }}
                            />
                            <AiFillInstagram
                                size={25}
                                style={{ marginLeft: "15px", cursor: "pointer" }}
                            />
                            <AiFillYoutube
                                size={25}
                                style={{ marginLeft: "15px", cursor: "pointer" }}
                            />
                        </div>
                    </ul>
                    <ul className='text-center sm:text-start'>
                        <h1 className='mb-1 font-semibold'>Shop</h1>
                        {footerProductLinks.map((link, i) => (
                            <li key={i}>
                                <Link
                                    className='text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6'
                                    to={link.link || "#"}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className='text-center sm:text-start'>
                        <h1 className='mb-1 font-semibold'>Company</h1>
                        {footerCompanyLinks.map((link, i) => (
                            <li key={i}>
                                <Link
                                    className='text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6'
                                    to={link.link || "#"}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className='text-center sm:text-start'>
                        <h1 className='mb-1 font-semibold'>Support</h1>
                        {footerSupportLinks.map((link, i) => (
                            <li key={i}>
                                <Link
                                    className='text-gray-400 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6'
                                    to={link.link || "#"}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </footer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-gray-400 text-md pb-8">
                    <span>
                        &copy; {new Date().getFullYear()}Markit. All rights reserved.
                    </span>
                    <span>Terms.Private Policy</span>
                    <div className="sm:block flex items-center justify-center w-full">
                        <img
                            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
                            alt="Payment Options"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}