import React from 'react';

const About = () => {
  return (
    <section id="about" className="container">
        <div className="about">
            <div className="about-text">
                <h2 className="section-title" style={{ textAlign: 'left' }}>Our Story</h2>
                <p>Founded in 2020 by Senior Chef Reagan Omondi, SavoryBites started as a small family kitchen with a big dream. Today, we serve hundreds of happy customers daily while maintaining that intimate, welcoming atmosphere.</p>
                <p>We believe in using only the freshest ingredients, locally sourced whenever possible. Our menu changes with the seasons to bring you the best flavors year-round.</p>
                <p>Every dish is made with passion and care, just like home cooking - but with a touch of elegance.</p>
                
                {/* Elegant Signature */}
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ 
                    fontFamily: '"Alex Brush", "Dancing Script", cursive', 
                    fontSize: '3.2rem', 
                    color: 'var(--accent)', 
                    transform: 'rotate(-5deg)',
                    display: 'inline-block',
                    marginBottom: '-0.5rem',
                    textShadow: '1px 1px 2px rgba(193, 123, 75, 0.1)'
                  }}>
                    Reagan
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', marginLeft: '1rem', letterSpacing: '1px' }}>REAGAN OMONDI</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '2px', marginLeft: '1rem', textTransform: 'uppercase', fontWeight: '600' }}>Senior Chef & Founder</div>
                </div>
            </div>
            <div className="about-img"></div>
        </div>
    </section>
  );
};

export default About;
