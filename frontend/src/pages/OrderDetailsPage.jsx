import React from 'react'
import UserOrderDetails from "../components/UserOrderDetails.jsx"
import Footer from '../components/Layout/Footer.jsx';
import Header from '../components/Layout/Header.jsx';

const ShopOrderDetails = () => {
  return (
    <div>
      <Header />
      <UserOrderDetails/>
      <Footer />
    </div>
  )
}

export default ShopOrderDetails;
