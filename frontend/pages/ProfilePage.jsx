import React, { useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import styles from '../styles/styles'
import ProfileSidebar from '../components/Profile/ProfileSidebar'
import ProfileContent from '../components/Profile/ProfileContent'

const ProfilePage = () => {

    const [active, setActive] = useState(1);

  return (
    <div>
      <Header />
      <main>
        <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
            <div className='w-[50px] md:w-[335px] sticky md:mt-0 mt-[10%]'>
                <ProfileSidebar active={active} setActive={setActive} />
            </div>
            <ProfileContent active={active}/>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage
