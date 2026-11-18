import { useRef, useState, type ChangeEvent } from "react";
import { XIcon } from "../../ui/components/XIcon";
import { resizeImage } from "../helpers/resizeImage";

interface ImagePickerProps {
  onChange: (imageURL: string) => void;
}

// Button to attach one image to a post. The image is made smaller before it is returned.
export const ImagePicker = ({ onChange }: ImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      onChange(await resizeImage(file));
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "No se pudo cargar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="x-image-picker">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => void onFileSelected(event)}
      />
      <button
        type="button"
        className="x-image-button"
        aria-label="Agregar imagen"
        title={error || "Agregar imagen"}
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        <XIcon name="image" />
      </button>
      {error && <span className="x-image-error" role="alert">{error}</span>}
    </div>
  );
};

interface ImagePreviewProps {
  imageURL: string | null;
  onRemove: () => void;
}

// Preview of the attached image with a button to remove it.
export const ImagePreview = ({ imageURL, onRemove }: ImagePreviewProps) => {
  if (!imageURL) return null;

  return (
    <div className="x-image-preview">
      <img src={imageURL} alt="Imagen adjunta" />
      <button type="button" aria-label="Quitar imagen" onClick={onRemove}>
        ×
      </button>
    </div>
  );
};
