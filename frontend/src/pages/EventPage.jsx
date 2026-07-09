import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { productData } from '../static/data.jsx'
import EventCard from '../components/Events/EventCard.jsx'

const EventPage = () => {

      const eventProduct = productData[1];
      const eventEndDate = '2026-12-31T23:59:59';

  return (
    <div>
      <Header activeHeading={4} />
      <EventCard active={true} />
      <EventCard active={true} data={eventProduct} endDate={eventEndDate}/>
      <Footer />
    </div>
  )
}

export default EventPage
