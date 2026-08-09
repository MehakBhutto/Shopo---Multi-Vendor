import animationData from "../../assets/animations/Ecommerce Animation.json";
import LottiePlayer from "./LottiePlayer";

const Loader = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <LottiePlayer animationData={animationData} height={300} width={300} />
        </div>
    )
}

export default Loader
