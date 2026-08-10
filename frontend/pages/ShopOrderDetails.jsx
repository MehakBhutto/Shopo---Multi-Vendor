import React from 'react'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import OrderDetails from "../components/Shop/OrderDetails.jsx"
import Footer from '../components/Layout/Footer.jsx';

const ShopOrderDetails = () => {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  )
}

export default ShopOrderDetails;
