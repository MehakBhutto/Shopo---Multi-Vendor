import React from 'react'
import styles from '../../styles/styles'


function Sponsored () {
    const sponsors = [
        { name: "Apple", logo: "https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo.jpg" },
        { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
        { name: "Stripe", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoODOd9v7t650AWYVuEf7jNlEjWTmFbmsW6Kcttnuw6Q&s=10" },
        { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
    ]
    return (
        <div className={`${styles.section} mt-[30px] hidden sm:block bg-white py-14 px-20 mb-12 cursor-pointer rounded-xl`}>
            <div className="flex justify-between w-full">
            {sponsors.map((sponsor) => (
                    <div key={sponsor.name} className="flex items-center justify-center">
                        <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="h-10 object-contain transition duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default Sponsored;