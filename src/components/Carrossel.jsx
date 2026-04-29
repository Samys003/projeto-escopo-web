import React, { useEffect, useState } from "react";
import slide1 from "../assets/Slide1.png";
import slide2 from "../assets/Slide2.png";
import slide3 from "../assets/Slide3.png";
import slide1mobile from "../assets/Slide1Mobile.png";
import slide2mobile from "../assets/Slide2Mobile.png";
import slide3mobile from "../assets/Slide3Mobile.png";

const Carrossel = () => {
  const slides = [slide1, slide2, slide3];
  const slidesMobiles = [slide1mobile, slide2mobile, slide3mobile];
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === (isMobile ? slidesMobiles.length : slides.length) - 1
          ? 0
          : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  const displayedSlides = isMobile ? slidesMobiles : slides;

  return (
    <div className="relative overflow-hidden w-full h-72 sm:h-80 mt-6 rounded-[28px] shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {displayedSlides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-72 sm:h-80 object-cover shrink-0"
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displayedSlides.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              index === current ? "bg-white" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrossel;
