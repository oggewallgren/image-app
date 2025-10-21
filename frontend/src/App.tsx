import "./App.css";
import UploadForm from "./components/UploadForm";
import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Upload Image</h1>
        <UploadForm />
        <Gallery />
      </header>
    </div>
  );
}

export default App;
