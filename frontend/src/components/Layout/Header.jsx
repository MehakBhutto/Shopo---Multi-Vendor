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
import { useDispatch, useSelector } from 'react-redux';
import { backend_url } from '../../../server.js';
import Cart from '../cart/Cart.jsx'
import Wishlist from '../Wishlist/Wishlist.jsx'
import { RxCross1 } from 'react-icons/rx';
import { IoArrowForward } from 'react-icons/io5';
import { getAllProducts } from '../../redux/actions/product.js';


const Header = ({ activeHeading }) => {

    const { isAuthenticated, user, loading } = useSelector((state) => state.user);
    const { seller } = useSelector((state) => state.seller);
    const { cart } = useSelector((state)=> state.cart);
    const { wishlist } = useSelector((state) => state.wishlist)
    const { allproducts } =  useSelector((state) => state.product);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState("");
    const [active, setActive] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openWishList, setOpenWishList] = useState(false);
    const [open, setOpen] = useState(false);


    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        console.log(term)

        const filteredProducts = products && products?.filter((product) =>
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
    }, [allproducts])

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
                            searchData && searchData.length !== 0 && (
                                <div className='absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[2500] p-4 '>
                                    {
                                        searchData && searchData.map((item, index) => {
                                            const productId = item._id || item.id;
                                            return (
                                                <Link to={`/product/${productId}`} key={index}>
                                                    <div className='w-full flex items-start-py-3'>
                                                        <img src={`${backend_url}`+item.images?.[0]} alt=""
                                                            className='w-[40px] h-[40px] me-[10px]'
                                                        />
                                                        <h1>{item.name}</h1>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className={`${styles.button}`}>
                        <Link to='/shop-create'>
                            <h1 className='text-[#fff] flex items-center'>
                                {!seller ? "Become Seller" : "Dashboard"} <IoIosArrowForward className="ml-1" />
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
                            <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenWishList(true)}>
                                <AiOutlineHeart size={30} color='rgb(255 255 255/ 83%)' />
                                <span className='absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono leading-tight text-center '>
                                    {wishlist && wishlist?.length}
                                </span>
                            </div>
                        </div>
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenCart(true)}>
                                <AiOutlineShoppingCart size={30} color='rgb(255 255 255/ 83%)' />
                                <span className='absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono leading-tight text-center'>
                                    {cart && cart.length}
                                </span>
                            </div>
                        </div>
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                {isAuthenticated ? (
                                    <Link to='/profile'>
                                        <img src={`${backend_url}${user.avatar}`} className='w-[35px] h-[35px] rounded-full' alt="" />
                                    </Link>
                                ) : (
                                    <Link to="/login">
                                        <CgProfile size={30} color='rgb(255 255 255/ 83%)' />
                                    </Link>
                                )
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* mobile header */}
            <div className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null} w-full h-[60px] fixed bg-[#fff] z-50 top-0 left-0 shadow-sm md:hidden lg:hidden`}>
                <div className="w-full flex items-center justify-between">
                    <div>
                        <BiMenuAltLeft
                            size={40}
                            className='ml-4'
                            onClick={() => setOpen(true)}
                        />
                    </div>
                    <div>
                        <Link to="/">
                            <img
                                className='mt-3 cursor-pointer'
                                src="https://shopo-next.vercel.app/assets/images/logo.svg"
                                alt="" />
                        </Link>
                    </div>
                    <div>
                        <div className="relative mr-[20px] cursor-pointer"  onClick={() => setOpenCart(true)}>
                            <AiOutlineShoppingCart
                                size={30} />
                            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono leading-tight text-center">
                                {cart && cart.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* header sidebar */}
                {
                    open && (
                        <div className={`${active === true ? " shadow-sm fixed top-0 left-0 z-10" : null} fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}>
                            <div className='fixed w-[60%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll'>
                                <div className="w-full justify-between flex pr-3">
                                    <div>
                                        <div className="relative mr-[15px] cursor-pointer" onClick={() => setOpenWishList(true)}>
                                            <AiOutlineHeart
                                                size={30}
                                                className='mt-5 ml-3'
                                            />
                                            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono leading-tight text-center">
                                                {wishlist && wishlist.length}
                                            </span>
                                        </div>
                                    </div>
                                    <RxCross1
                                        size={30}
                                        className='ml-4 mt-5'
                                        onClick={() => setOpen(false)}
                                    />
                                </div>
                                <div className="my-8 w-[92%] m-auto h-[40px]">
                                    <input type="search" placeholder='Search Product...'
                                        className='h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md'
                                        value={searchTerm} onChange={handleSearchChange} />
                                    {
                                        searchData && searchData.length !== 0 ? (
                                            <div className='absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[0] p-4'>
                                                {
                                                    searchData && searchData.map((item, index) => {
                                                        const productId = item._id || item.id;
                                                        return (
                                                            <Link to={`/product/${productId}`} key={index}>
                                                                <div className='w-full flex items-start-py-3'>
                                                                    <img src={`${backend_url}`+item.images?.[0]} alt=""
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

                                <Navbar active={activeHeading} />
                                <div className={`${styles.button} ml-4 w-[140px]`}>
                                    <Link to="/shop-create">
                                        <h1 className='text-[#fff] flex items-center'>
                                            Become Seller <IoIosArrowForward className='ml-1 rounded-[4px]' />
                                        </h1>
                                    </Link>
                                </div>
                                <br />
                                <div className="flex w-full justify-center">
                                    {!isAuthenticated ?
                                        (
                                            <>
                                                <Link to="/login" className='text-[18px] pr-[10px] text-[#000000b7]'> Login /</Link>
                                                <Link to="/signup" className='text-[18px] text-[#000000b7]'> Signup</Link>
                                            </>
                                        ) : (
                                            <div>
                                                <Link to="/profile" onClick={scrollTo(0,0)}>
                                                    <img
                                                        className='w-[50px] h-[50px] rounded-full border'
                                                        src={`${backend_url}${user?.avatar}`}
                                                        alt="" />
                                                </Link>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            {/* cart popup */}
            {
                openCart ? (
                    <Cart setOpenCart={setOpenCart} />
                ) : null
            }
            {/* wishList popup */}
            {
                openWishList ? (
                    <Wishlist setOpenWishList={setOpenWishList} />
                ) : null
            }
        </>
    )
}

export default Header
