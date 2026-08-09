import React from 'react'
import styles from '../../styles/styles'

const CheckoutSteps = ({ active }) => {
  return (
    <div className='w-full flex justify-center'>
      <div className="w-[90%] md:w-[50%] fle items-center flex-wrap">
        <div className={`${styles.normalFlex}`}>
          <div className={`${styles.cart_button}`}>
            <span className={`${styles.cart_button_text}`}>i.Shipping</span>
          </div>
          <div className={`${active > 1 ? "w-[30px] md:w-[70px] h-[4px] !bg-[#f63b60]" : "w-[30px] md:w-[70px] h-[4px] bg-#FDE1E6]"}`}></div>
          <div className={`${styles.normalFlex}`}>
            <div className={`${active > 1 ? `${styles.cart_button}` : `${styles.cart_button}`} !bg-[#FDE1E6]`}>
              <span className={`${active > 1 ? `${styles.cart_button_text}` : `${styles.cart_button_text}`} !text-[#f63b60]`}>
                2.Payment
              </span>
            </div>
          </div>
          <div className={`${active > 2 ? "w-[30px] md:w-[70px] h-[4px] !bg-[#f63b60]" : "w-[30px] md:w-[70px] h-[4px] bg-#FDE1E6]"}`}></div>
          <div className={`${styles.normalFlex}`}>
            <div className={`${active > 2 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#FDE1E6]`}`}>
              <span className={`${active > 2 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#f63b60]`}`}>
                3.Success
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSteps
