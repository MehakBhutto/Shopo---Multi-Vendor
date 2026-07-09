import React from 'react'
import styles from '../../styles/styles'
import EventCard from './EventCard.jsx'
import { productData } from '../../static/data.jsx'

const Events = () => {
  const eventProduct = productData[1];
  const eventEndDate = '2026-12-31T23:59:59';

  return (
    <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading}`}>
                    <h1 className='pt-[25px]'>Popular Events</h1>
                </div>
                <div className="w-full grid">
                    <EventCard data={eventProduct} endDate={eventEndDate} />
                </div>
            </div>
        </div>
  )
}

export default Events
