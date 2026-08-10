import React from 'react'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import AllProducts from "../components/Shop/AllProducts.jsx"

const ShopAllProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items justify-between w-full">
        <div className="w-[80px] md:w-[330px]">
          <DashboardSideBar active={3} />
        </div>
        <div className='w-full justify-center flex'>
            <AllProducts />
        </div>
      </div>
    </div>
  )
}

export default ShopAllProduct
