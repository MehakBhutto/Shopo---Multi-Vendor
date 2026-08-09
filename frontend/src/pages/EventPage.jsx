import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { productData } from '../static/data.jsx'
import EventCard from '../components/Events/EventCard.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllEvents } from '../redux/actions/event.js'

const EventPage = () => {

  const { allevents } = useSelector((state) => state.event);

  useEffect(()=>{
  },[allevents])

  return (
    <div>
      <Header activeHeading={4} />
      <EventCard active={true} />
      {
        allevents && allevents.map((item, index) => (
          <EventCard key={index} active={true} data={item} endDate={item?.finish_Date} />
        ))
      }
      <Footer />
    </div>
  )
}

export default EventPage
