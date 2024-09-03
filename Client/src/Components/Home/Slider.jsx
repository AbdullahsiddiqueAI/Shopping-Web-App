import React, { useState, useEffect } from 'react';
import image1 from '../../css/img/Slider/24.jpg'
import image2 from '../../css/img/Slider/2.jpg'
import image3 from '../../css/img/Slider/3.jpg'

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    // 'https://images.unsplash.com/photo-1458571037713-913d8b481dc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=1920',
  image1,
  image2,
  image3

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
    }, 5000); // Change slide every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const handleRadioChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider-wrapper">
      <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slider ${index + 1}`} />
        ))}
      </div>
      <div className="slider-btn">
        {images.map((_, index) => (
          <input
            key={index}
            type="radio"
            name="slider-radio"
            id={`slider-radio-${index}`}
            className='radio-button'
            checked={currentIndex === index}
            onChange={() => handleRadioChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
