import { useEffect, useState } from 'react';
import { GALLERY } from '../constants';

/**
 * Auto-rotating photo carousel for the club.
 * Images/captions come from the GALLERY config in constants.js —
 * swap the picsum placeholder URLs for real photos whenever ready.
 */
export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = GALLERY.items.length;

  const go = (next) => setIndex(((next % count) + count) % count);

  // Advance automatically, unless the visitor is hovering or there is one slide.
  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [paused, count]);

  return (
    <section className="section gallery" id="gallery">
      <div className="section__head">
        <p className="section__eyebrow">{GALLERY.eyebrow}</p>
        <h2 className="section__title">{GALLERY.title}</h2>
        <p className="section__sub">{GALLERY.subtitle}</p>
      </div>

      <div
        className="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="carousel__viewport">
          <div
            className="carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {GALLERY.items.map((item, i) => (
              <figure className="carousel__slide" key={item.src}>
                <img
                  src={item.src}
                  alt={item.caption}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    // Hide a failed image; the gradient + caption still look fine.
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <figcaption className="carousel__caption">{item.caption}</figcaption>
              </figure>
            ))}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                className="carousel__arrow carousel__arrow--prev"
                onClick={() => go(index - 1)}
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                className="carousel__arrow carousel__arrow--next"
                onClick={() => go(index + 1)}
                aria-label="Next image"
              >
                →
              </button>
              <div className="carousel__dots" role="tablist" aria-label="Choose an image">
                {GALLERY.items.map((item, i) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`carousel__dot ${i === index ? 'is-active' : ''}`}
                    onClick={() => go(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}