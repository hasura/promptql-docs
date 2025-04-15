import React from 'react';
import './styles.css';
// @ts-ignore
import GalleryOne from '@site/static/img/get-started/gallery-1.png';
// @ts-ignore
import GalleryTwo from '@site/static/img/get-started/gallery-2.png';
// @ts-ignore
import GalleryThree from '@site/static/img/get-started/gallery-3.png';
// @ts-ignore
import GalleryFour from '@site/static/img/get-started/gallery-4.png';

export default function Gallery() {
  return (
    <div className="failure-gallery">
      <div className="failure-item">
        <p className="failure-caption">Ignores rule that advanced plan &gt; free plan in priority.</p>
        <img src={GalleryOne} alt="Failure..." />
      </div>
      <div className="failure-item">
        <p className="failure-caption">Ignores rule that advanced plan &gt; base plan in priority.</p>
        <img src={GalleryTwo} alt="Failure..." />
      </div>
      <div className="failure-item">
        <p className="failure-caption">Misclassification of a production issue, in current context.</p>
        <img src={GalleryThree} alt="Failure..." />
      </div>
      <div className="failure-item">
        <p className="failure-caption">
          Correct classification of the issue when asked to classify in a clean context. Repeatably accurate 5/5 times.
        </p>
        <img src={GalleryFour} alt="Failure..." />
      </div>
    </div>
  );
}
