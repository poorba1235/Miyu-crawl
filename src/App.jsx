import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import Lottie from "lottie-react";
import loadingAnimation from "/public/loading.json"; 
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[1000] text-center">


          <Lottie 
            animationData={loadingAnimation} 
            loop={true} 
            className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px]" 
          />

          <p className="hidden text-xs text-gray-600 max-w-[80%] mt-4 md:block md:hidden">
            For the best experience, we recommend using App on a desktop device.
            Mobile compatibility is currently limited.
          </p>
        </div>
      )}

      <Leva hidden  />
      <UI />
      <Canvas camera={{ position: [0, 0, 2], fov: 45 }}>
        <Experience />
      <OrbitControls
        enablePan={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.8}
        smoothTime={0.3}
      />

      </Canvas>
    </>
  );
}

export default App;
