import { useEffect, useState } from 'react';
import slide1 from '../assets/Slide1.png';
import slide2 from '../assets/Slide2.png';
import slide3 from '../assets/Slide3.png';

const slides = [slide1, slide2, slide3];

const Carrossel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="hidden w-full flex-col items-center md:flex">
            <div className="relative aspect-[558/466] w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[var(--external-shadow)]">
                <div
                    className="flex h-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="h-full w-full shrink-0 object-cover"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-8 flex gap-2">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                            index === current ? 'bg-white' : 'bg-white/60'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carrossel;
