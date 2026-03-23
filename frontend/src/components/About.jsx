import React from 'react';

const About = () => {
  return (
    <section id="about" className="container">
        <div className="about">
            <div className="about-text">
                <h2 className="section-title" style={{ textAlign: 'left' }}>Our Story</h2>
                <p>Founded in 2020 by Chef Whicklian Nerio, SavoryBites started as a small family kitchen with a big dream. Today, we serve hundreds of happy customers daily while maintaining that intimate, welcoming atmosphere.</p>
                <p>We believe in using only the freshest ingredients, locally sourced whenever possible. Our menu changes with the seasons to bring you the best flavors year-round.</p>
                <p>Every dish is made with passion and care, just like home cooking - but with a touch of elegance.</p>
                <div className="chef-signature">Whicklian Nerio</div>
                <p style={{ fontStyle: 'italic' }}>Executive Chef & Founder</p>
            </div>
            <div className="about-img"></div>
        </div>
    </section>
  );
};

export default About;
