import React, { useState } from 'react';

const Gallery = () => {
  const [lightboxImg, setLightboxImg] = useState(null);

  const images = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400'
  ];

  return (
    <>
        <section id="gallery" className="container">
            <h2 className="section-title">Our Gallery</h2>
            <p className="section-subtitle">A visual journey through our kitchen</p>
            <div className="gallery-grid">
                {images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className="gallery-item" 
                        onClick={() => setLightboxImg(img)}
                    >
                        <img src={img} alt={`Food ${idx + 1}`} />
                    </div>
                ))}
            </div>
        </section>

        {lightboxImg && (
            <div className="lightbox active" onClick={() => setLightboxImg(null)}>
                <span className="close-lightbox" onClick={() => setLightboxImg(null)}>&times;</span>
                <img src={lightboxImg} alt="Enlarged food" onClick={e => e.stopPropagation()} />
            </div>
        )}
    </>
  );
};

export default Gallery;
