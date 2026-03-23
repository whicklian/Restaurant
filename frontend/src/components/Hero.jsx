import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const titleRef = useRef(null);
  const text = "Welcome to SavoryBites";
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      bgClass: 'slide-1',
      title: '', // Handled by typewriter
      text: 'Experience culinary excellence in every bite',
      buttons: [
        { text: 'View Menu', link: '#menu', outline: false },
        { text: 'Reserve Table', link: '#reserve', outline: true }
      ]
    },
    {
      bgClass: 'slide-2',
      title: 'Fresh Ingredients Daily',
      text: 'Farm-to-table freshness guaranteed',
      buttons: [
        { text: 'Explore Dishes', link: '#menu', outline: false }
      ]
    },
    {
      bgClass: 'slide-3',
      title: 'Private Dining Available',
      text: 'Perfect for special occasions',
      buttons: [
        { text: 'Book Now', link: '#reserve', outline: false }
      ]
    }
  ];

  useEffect(() => {
    // Typewriter effect
    let idx = 0;
    let typeInterval;
    
    if (titleRef.current) {
        titleRef.current.innerHTML = '<span class="tw-text"></span><span class="tw-cursor">|</span>';
        const textEl = titleRef.current.querySelector('.tw-text');
        
        typeInterval = setInterval(() => {
            if (idx < text.length) {
                textEl.textContent += text.charAt(idx);
                idx++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
    
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    // Slider auto-rotate
    const slideInterval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <section id="home" className="hero-slider">
        {slides.map((slide, index) => (
            <div key={index} className={`slide ${slide.bgClass} ${currentSlide === index ? 'active' : ''}`}>
                <div className="slide-content">
                    {index === 0 ? (
                        <h1 ref={titleRef}></h1>
                    ) : (
                        <h1>{slide.title}</h1>
                    )}
                    <p>{slide.text}</p>
                    <div>
                        {slide.buttons.map((btn, bIndex) => (
                            <a 
                                key={bIndex} 
                                href={btn.link} 
                                className={`btn ${btn.outline ? 'btn-outline' : ''}`}
                            >
                                {btn.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        ))}
        
        <button className="slider-btn prev" onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}>
            <i className="fas fa-chevron-left"></i>
        </button>
        <button className="slider-btn next" onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}>
            <i className="fas fa-chevron-right"></i>
        </button>
        
        <div className="slider-dots">
            {slides.map((_, index) => (
                <span 
                    key={index} 
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                ></span>
            ))}
        </div>
    </section>
  );
};

export default Hero;
