import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from '../components/Products/ProductDetails'
import SuggestedProduct from '../components/Products/SuggestedProduct'
import { useSelector } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'
import { useParams, useSearchParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const { id } = useParams();

  const { allproducts } = useSelector((state) => state.product);
  const { allevents } = useSelector((state) => state.event);
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if (eventData === "true") {
      const currentProduct = allevents?.find((i) => i._id === id);
      setData(currentProduct);
    } else {
      if (allproducts && allproducts.length > 0) {
        const currentProduct = allproducts.find((i) => i._id === id);
        setData(currentProduct);
      }
    }
  }, [id, allproducts, allevents, eventData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetails data={data} />
        {!eventData &&
          <>
            {
              data && <SuggestedProduct data={data} />
            }
          </>}
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetailsPage
