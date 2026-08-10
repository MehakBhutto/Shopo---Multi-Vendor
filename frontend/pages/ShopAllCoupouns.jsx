import React from 'react'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import AllCoupouns from "../components/Shop/AllCoupouns.jsx"

const ShopAllCoupouns = () => {

    return (
        <div>
            <DashboardHeader />
            <div className="flex items justify-between w-full">
                <div className="w-[80px] md:w-[330px]">
                    <DashboardSideBar active={9} />
                </div>
                <div className='w-full justify-center flex'>
                    <AllCoupouns />
                </div>
            </div>
        </div>
    )
}

export default ShopAllCoupouns;
