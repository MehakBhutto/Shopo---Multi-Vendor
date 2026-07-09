import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  const heroImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_N-8XrsGcimJMkh9wGzWQsjPp9eP0pcCfCRA68S36JjS4jxgiAGvb67g&s=10";

  return (
    <div
      className={`relative min-h-[70vh] md:h-[80vh] w-full bg-cover bg-center bg-no-repeat ${styles.normalFlex}`}
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className={`${styles.section} relative z-10 w-[90%] md:w-[60%]`}>
        <h1 className="text-[35px] md:text-[60px] leading-[1.2] font-semibold text-white capitalize">
          Best Collection for <br /> Home Decoration
        </h1>

        <p className="pt-5 text-[16px] text-white/90">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab enim unde
          amet sequi ea quos, praesentium neque velit quis ex molestias ad
          beatae temporibus.
        </p>

        <Link to="/products" className="inline-block mt-5">
          <div className={styles.button}>
            <span className="text-white text-[18px]">Shop Now</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;