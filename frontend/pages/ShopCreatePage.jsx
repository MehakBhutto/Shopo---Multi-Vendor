import React, { useEffect } from 'react'
import ShopCreate from "../components/Shop/ShopCreate"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ShopCreatePage = () => {

  const navigate = useNavigate()
  const { isSeller, seller, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isLoading, isSeller]);

  return (
    <div>
      <ShopCreate />
    </div>
  )
}

export default ShopCreatePage
