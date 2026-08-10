import React from 'react'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import CreateProduct from './../components/Shop/CreateProduct.jsx'

const ShopCreateProduct = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[80px] md:w-[330px]">
          <DashboardSideBar active={4} />
        </div>
        <div className="flex min-h-[90vh] flex-1 items-center justify-center bg-gray-50">
          <CreateProduct />
        </div>
      </div>
    </div>
  )
}

export default ShopCreateProduct
