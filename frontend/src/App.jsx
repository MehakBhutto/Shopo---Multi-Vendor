import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { HomePage, LoginPage, SignupPage, TrackOrderPage, ActivationPage, OrderDetailsPage, SellerActivationPage, ProductPage, ProductDetailsPage, BestSelling, EventPage, FaqPage, OrderSuccessPage, CheckoutPage, ProfilePage, ShopCreatePage, ShopLoginPage, SellerProfilePage, PaymentPage, UserInbox } from './routes/Routes.js'
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import SellerProtectedRoute from './routes/SellerProtectedRoute.jsx';
import Store from './redux/store.js'
import { loadSeller, loadUser } from './redux/actions/user.js';
import { useSelector } from 'react-redux';
import { ShopDashboardPage, ShopInboxPage, ShopWithDrawMoneyPage, ShopAllRefunds, ShopHomePage, ShopCreateProduct, ShopSettingPage, ShopAllOrders, ShopOrderDetails, ShopAllProduct, ShopCreateEvents, ShopAllEvents, ShopAllCoupouns } from "./routes/ShopRoutes.js";
import { getAllProducts } from './redux/actions/product.js';
import axios from 'axios';
import { server } from '../server.js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getAllEvents } from './redux/actions/event.js';
import { useDispatch } from "react-redux"

const App = () => {

  const [stripeApiKey, setStripeApiKey] = useState("");
  const dispatch = useDispatch();

  const getStripeApiKey = async () => {
    const { data } = await axios.get(`${server}/payment/stripeapikey`)
    setStripeApiKey(data.stripeApiKey);
  }
  
  useEffect(() => {
     dispatch(loadUser());
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApiKey();
  }, [dispatch]);

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/sign-up' element={<SignupPage />} />
          <Route path='/activation/:activation_token' element={<ActivationPage />} />
          <Route path='/seller/activation/:activation_token' element={<SellerActivationPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSelling />} />
          <Route path='/events' element={<EventPage />} />
          <Route path='/faq' element={<FaqPage />} />
          <Route path="/order/success/:id" element={<OrderSuccessPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path='/payment' element={
            <ProtectedRoute>
              {stripeApiKey ? (
                <Elements stripe={loadStripe(stripeApiKey)} >
                  <PaymentPage />
                </Elements>
              ) : null}
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route
          path='/inbox'
          element={
            <ProtectedRoute>
              <UserInbox />
            </ProtectedRoute>
          } />
          <Route path="/user/order/:orderId" element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/user/track/order/:id" element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          } />
          <Route path='/user/:id' element={<SellerProfilePage />} />
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route path="/shop/:id" element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-create-products" element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-orders" element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-refunds" element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-settings" element={
            <SellerProtectedRoute>
              <ShopSettingPage />
            </SellerProtectedRoute>
          } />
          <Route path="/order/:orderId" element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-products" element={
            <SellerProtectedRoute>
              <ShopAllProduct />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-create-events" element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-events" element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-messages" element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-coupouns" element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-withdraw-money" element={
            <SellerProtectedRoute>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  )
}

export default App
