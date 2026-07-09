import React from 'react'
import { brandingData, categoriesData } from '../../../static/data.jsx'
import styles from '../../../styles/styles'
import { useNavigate } from 'react-router-dom'

const Categories = () => {

  const navigate = useNavigate()

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div className='branding my-12 grid grid-cols-2 lg:grid-cols-4 gap-5 w-full shadow-sm bg-white p-5 rounded-md'>
          {
            brandingData && brandingData.map((i) => (
              <div className='flex items-start' key={i.id}>
                {i.icon}
                <div className='px-3'>
                  <h3 className='font-bold text-sm md:text-base'>{i.title}</h3>
                  <p className='text-xs md:text-sm'>{i.Description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className={`${styles.section} bg-white p-5 md:p-6 rounded-md mb-12`} id="categories">
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
          {
            categoriesData && categoriesData.map((i) => {
              const handleSubmit = (category) => {
                navigate(`/products?category=${category.title}`);
              }

              return (
                <div
                  className='w-full h-[110px] flex items-center justify-between gap-3 cursor-pointer overflow-hidden rounded-md border border-[#f0f0f0] bg-[#fafafa] px-4 transition hover:shadow-md hover:border-[#dcdcdc]'
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <h5 className={`text-sm font-[500] leading-[1.3] text-[#333]`}>{i.title}</h5>
                  <img
                    src={i.image_Url}
                    alt={i.title}
                    className='h-[85px] w-[95px] shrink-0 rounded-md object-cover'
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Categories
