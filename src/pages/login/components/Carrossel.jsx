import React, { useEffect, useState } from 'react';
import slide1 from '../assets/Slide1.png';
import slide2 from '../assets/Slide2.png';
import slide3 from '../assets/Slide3.png';

const Carrossel = () => {
    const slides = [slide1, slide2, slide3];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const displayedSlides = slides;

    return (
        <div className="relative overflow-hidden w-full h-full hidden md:block rounded-[28px] shadow-lg">
            <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {displayedSlides.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full sm:h-full object-cover shrink-0"
                    />
                ))}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {displayedSlides.map((_, index) => (
                    <span
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                            index === current ? 'bg-white' : 'bg-white/60'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carrossel;
