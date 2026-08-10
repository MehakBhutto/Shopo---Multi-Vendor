import React from 'react'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import AllOrder from "../components/Shop/AllOrder.jsx"

const ShopAllProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items justify-between w-full">
        <div className="w-[80px] md:w-[330px]">
          <DashboardSideBar active={2} />
        </div>
        <div className='w-full justify-center flex'>
            <AllOrder />
        </div>
      </div>
    </div>
  )
}

export default ShopAllProduct
