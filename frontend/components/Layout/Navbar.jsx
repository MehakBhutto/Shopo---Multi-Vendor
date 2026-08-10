import React from 'react'
import styles from '../../styles/styles'
import { navItems } from '../../static/data.jsx'
import { Link } from 'react-router-dom'

export default function Navbar({active}) {
  return (
    <div className={`block md:${styles.normalFlex}`}>
      {
        navItems && navItems.map((i, index) => (
            <div className='flex' key={i.title}>
                <Link to={i.url} className={`${active === index + 1 ? "text-[#17dd1f]" : "text-black md:text-[#fff]"} font-[500] px-6 cursor-pointer pb-[20px] md:pb-0`}>
                  {i.title}
                </Link>
            </div>
        ))
      }
    </div>
  )
}
