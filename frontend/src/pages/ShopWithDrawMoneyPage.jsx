import React from 'react'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import WithdrawMoney from "../components/Shop/WithdrawMoney.jsx"

const ShopWithDrawMoneyPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items justify-between w-full">
        <div className="w-[80px] md:w-[330px]">
          <DashboardSideBar active={7} />
        </div>
        <div className='w-full justify-center flex'>
            <WithdrawMoney />
        </div>
      </div>
    </div>
  )
}

export default ShopWithDrawMoneyPage
