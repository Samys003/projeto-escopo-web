import React, { useState } from "react";
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

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="relative overflow-hidden w-full h-64 mt-4">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, i) => (
          <img
            key={i}
            src={s}
            alt={`Slide ${i}`}
            className="w-full h-64 object-cover flex-shrink-0"
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carrossel;
