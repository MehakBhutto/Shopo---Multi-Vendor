import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { HomePage, LoginPage, SignupPage, ProductPage, BestSelling, EventPage,FaqPage } from './Routes.js'

const App = () => {

  // useEffect(()=>{
  //   Store
  // })

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/best-selling" element={<BestSelling />} />
        <Route path='/sign-up' element={<SignupPage />} />
        <Route path='/events' element={<EventPage />} />
        <Route path='/faq' element={<FaqPage />} />
      </Routes>
    </div>
  )
}

export default App
