import React, { useEffect, useState } from 'react';
import './ImageUpload.css';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ImageUpload = ({ onUpload, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!file) {
      return { valid: false, error: 'No file selected.' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload a jpeg, png, webp, or gif image.' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: 'File is too large. Maximum size is 5MB.' };
    }

    return { valid: true, error: '' };
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      if (typeof onFileSelect === 'function') {
        onFileSelect(null);
      }
      setPreviewUrl('');
      setError('');
      return;
    }

    const { valid, error: validationError } = validateFile(file);

    if (!valid) {
      // Clear prior preview and file when validation fails
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      // Clear selected file for parent state when invalid or removed
      setSelectedFile(null);
      if (typeof onFileSelect === 'function') {
        onFileSelect(null);
      }
      setPreviewUrl('');
      setError(validationError);
      return;
    }

    setError('');
    setSelectedFile(file);
    if (typeof onFileSelect === 'function') {
      onFileSelect(file);
    }

    const objectUrl = URL.createObjectURL(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    if (!selectedFile || error) {
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    if (typeof onUpload === 'function') {
      onUpload(formData);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="image-upload">
      <div className="image-upload__input">
        <label htmlFor="image-upload-input">Select an image</label>
        <input
          id="image-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
        />
      </div>

      {error && <div className="image-upload__error">{error}</div>}

      {previewUrl && !error && (
        <div className="image-upload__preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        disabled={!selectedFile || Boolean(error)}
        onClick={handleSubmit}
      >
        Upload Image
      </button>
    </div>
  );
};

export default ImageUpload;
