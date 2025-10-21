import { useEffect, useRef, useState } from "react";
import "./UploadForm.css";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg"]; // png and jpeg

const UploadForm = () => {
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only PNG and JPEG files are allowed.");
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Max file size is 10MB.");
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }
    setError("");
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Not wired to backend per instructions. Simulate successful submit.
    if (!selectedFile || !imageName || error) return;
    void Promise.resolve({ name: imageName, file: selectedFile });
    setSelectedFile(null);
    setPreviewUrl("");
    setImageName("");
  };

  const slugifyName = (name: string): string => {
    const deburred = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const base = deburred
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const sliced = base.slice(0, 10);
    return sliced || "image";
  };

  const formatTimestamp = (d: Date): string => {
    const yyyy = d.getFullYear().toString();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const HH = String(d.getHours()).padStart(2, "0");
    const MM = String(d.getMinutes()).padStart(2, "0");
    const SS = String(d.getSeconds()).padStart(2, "0");
    return `${yyyy}${mm}${dd}${HH}${MM}${SS}`;
  };

  const getExtension = (): string => {
    if (selectedFile?.type === "image/png") return "png";
    if (selectedFile?.type === "image/jpeg") return "jpeg";
    return "png";
  };

  const computedFilename = `${slugifyName(imageName)}_${formatTimestamp(new Date())}.${getExtension()}`;

  return (
    <div>
      <form className="upload-form" onSubmit={handleSubmit} noValidate>

        <div
          className={`upload-form-drag-area ${isDragging ? "is-dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          aria-label="Drag and drop an image here or click to select"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <div className="drag-copy">
            Drag image here or click to select
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpeg,.jpg"
            className="file-input-hidden"
            onChange={handleFileInputChange}
          />
        </div>

        <div className="file-info">
          {selectedFile ? selectedFile.name : "No file chosen"}
        </div>
        <div className="form-field">
          <input
            id="imageName"
            name="imageName"
            type="text"
            className="text-input"
            placeholder="Image name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            required
            aria-describedby="imageName-helper"
          />
        </div>
        {selectedFile && (
          <div id="imageName-helper" className="helper-text">
            Will be saved as: {computedFilename}
          </div>
        )}

        <div className="preview-wrapper">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="preview-image" />
          ) : (
            <div className="preview-placeholder" aria-hidden="true" />
          )}
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={!imageName || !selectedFile || Boolean(error)}
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;