import "./App.css";
import { useState } from "react";
import UploadForm from "./components/UploadForm";
import Gallery from "./components/Gallery";

const App = () => {
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setGalleryRefreshKey((k) => k + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploading App</h1>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
        <Gallery refreshKey={galleryRefreshKey} />
      </header>
    </div>
  );
};

export default App;
