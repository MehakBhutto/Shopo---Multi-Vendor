import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import { Link } from 'react-router-dom'
import { categoriesData, productData } from '../../static/data.jsx';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { BiMenuAltLeft } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import DropDown from './DropDown'
import Navbar from './Navbar.jsx'
import Cart from "../Cart/Cart.jsx"

const Header = ({ activeHeading }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState("");
    const [active, setActive] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openWishlist, setOpenWishlist] = useState(false)

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filteredProducts = productData && productData.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchData(filteredProducts)
    };

    useEffect(() => {
        const handleScroll = () => {
            setActive(window.scrollY > 70);
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <>
            <div className={`${styles.section}`}>
                <div className='hidden  md:h-[50px] md:my-[20px] md:flex items-center justify-between'>
                    <div>
                        <Link to="/">
                            <img src="https://shopo-next.vercel.app/assets/images/logo.svg" alt="" />
                        </Link>
                    </div>
                    {/* search box */}
                    <div className='w-[50%] relative'>
                        <input type="text" placeholder='Search Product....' value={searchTerm} onChange={handleSearchChange} className='h-[40px] w-full px-2 boorder-[#3957db] border-[2px] rounded-md' />
                        <AiOutlineSearch size={30} className='absolute right-2 top-1.5 cursor-pointer' />
                        {
                            searchData && searchData.length !== 0 ? (
                                <div className='absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[0] p-4'>
                                    {
                                        searchData && searchData.map((item, index) => {
                                            const d = item.name;

                                            const Product_name = d.replace(/\s+/g, "-");
                                            return (
                                                <Link to={`/product/${Product_name}`} key={index}>
                                                    <div className='w-full flex items-start-py-3'>
                                                        <img src={item.image_Url[0].url} alt=""
                                                            className='w-[40px] h-[40px] me-[10px]'
                                                        />
                                                        <h1>{item.name}</h1>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                    <div className={`${styles.button}`}>
                        <Link to='/seller'>
                            <h1 className='text-[#fff] flex items-center'>
                                Become Seller <IoIosArrowForward className="ml-1" />
                            </h1>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`${active == true ? "shadow-sm fixed top-0 left-0 z-10" : null} transition hidden md:flex items-center justify-between w-full bg-[#3321cB] h-[70px]`}>
                <div className={`${styles.section} relative ${styles.normalFlex} justify-between`}>
                    {/* categories */}
                    <div>
                        <div className="relative h-[60px] mt-[10px] w-[270px] hidden md:block">
                            <BiMenuAltLeft size={30} className='absolute top-3 left-2' />
                            <button
                                type="button"
                                onClick={() => setDropDown((prev) => !prev)}
                                className='h-full w-full flex justify-between items-center pl-10 pr-4 bg-white font-sans text-lg font-[600] select-none rounded-t-md'
                            >
                                All Categories
                                <IoIosArrowDown
                                    size={20}
                                    className={`${dropDown ? "rotate-180" : "rotate-0"} transition-transform duration-200`}
                                />
                            </button>
                            {
                                dropDown ? (
                                    <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
                                ) : null
                            }
                        </div>
                    </div>
                    {/* navItems */}
                    <Navbar active={activeHeading} />
                    <div className={`${styles.normalFlex}`}>
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                <AiOutlineHeart size={30} color='rgb(255 255 255/ 83%)' />
                                <span className='absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono leading-tight text-center'>0</span>
                            </div>
                        </div>
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                <AiOutlineShoppingCart size={30} color='rgb(255 255 255/ 83%)' />
                                <span className='absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono leading-tight text-center'>0</span>
                            </div>
                        </div>
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                <Link to="/login">
                                    <CgProfile size={30} color='rgb(255 255 255/ 83%)' />
                                </Link>
                            </div>
                        </div>
                        {/* wishlist */}
                        {
                            openCart ? (
                                <Cart setOpenCart={setOpenCart} />
                            ) : null
                        }
                    </div>

                </div>
            </div>
        </>
    )
}

export default Header
