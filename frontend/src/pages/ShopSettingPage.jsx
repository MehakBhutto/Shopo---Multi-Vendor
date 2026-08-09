import React from 'react'
import ShopSettings from '../components/Shop/ShopSettings.jsx'
import Footer from '../components/Layout/Footer'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader.jsx'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar.jsx'

const ShopSettingPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items justify-between w-full">
        <div className="w-[80px] md:w-[330px]">
          <DashboardSideBar active={11} />
        </div>
        <div className='w-full justify-center flex'>
            <ShopSettings />
        </div>
      </div>
    </div>
  )
}

export default ShopSettingPage
