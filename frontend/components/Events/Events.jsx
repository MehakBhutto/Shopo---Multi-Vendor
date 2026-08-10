import React, { useEffect } from 'react'
import styles from '../../styles/styles'
import EventCard from './EventCard.jsx'
import { productData } from '../../static/data.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEvents } from '../../redux/actions/event.js'

const Events = () => {
  const { allevents, isLoading } = useSelector((state) => state.event);
  const event = allevents?.[0];

  useEffect(() => {},[allevents])

  return (
    <div>
      {
        !isLoading && (
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1 className='pt-[25px]'>Popular Events</h1>
            </div>
            <div className="w-full grid">
              <EventCard data={event} endDate={event?.finish_Date} />
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Events
