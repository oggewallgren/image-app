import { useMemo } from "react";
import "./Gallery.css";

type PlaceholderItem = {
  id: string;
  name: string;
};

const Gallery = () => {
  const items: PlaceholderItem[] = useMemo(
    () => [
      { id: "1", name: "Image Name" },
      { id: "2", name: "Image Name" },
      { id: "3", name: "Image Name" },
    ],
    []
  );

  return (
    <section className="gallery">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {items.map((item) => (
          <figure key={item.id} className="gallery-card" aria-label={item.name}>
            <div className="gallery-thumb" />
            <figcaption className="gallery-caption">{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default Gallery;

