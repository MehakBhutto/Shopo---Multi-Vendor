import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottiePlayer = ({ animationData, loop = false, autoplay = true, height = 300, width = 300 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    return () => {
      animation.destroy();
    };
  }, [animationData, autoplay, loop]);

  return (
    <div
      ref={containerRef}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
};

export default LottiePlayer;
