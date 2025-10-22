import { useEffect, useState } from "react";
import "./Gallery.css";
import { HOST } from '../constants';

type ImageItem = {
  _id: string;
  name: string;
  path: string;
};

type GalleryProps = {
  refreshKey?: number;
};

const Gallery = ({ refreshKey }: GalleryProps) => {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(`${HOST}/images`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Failed to load images (${res.status})`);
        }
        return res.json();
      })
      .then((json) => {
        setItems(Array.isArray(json.data) ? json.data : []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load images");
      });
  }, [refreshKey]);

  return (
    <section className="gallery">
      <h2>Gallery</h2>
      {error && <div className="gallery-error">{error}</div>}
      <div className="gallery-grid">
        {items.map((item) => (
          <figure key={item._id} className="gallery-card" aria-label={item.name}>
            <div className="gallery-thumb">
              <img src={`${HOST}${item.path}`} alt={item.name} className="gallery-img" />
            </div>
            <figcaption className="gallery-caption">{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
