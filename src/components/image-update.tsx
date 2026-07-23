import { Box, IconButton } from '@mui/material';
import { PencilIcon } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';

interface ImageUpdateProps {
  url: string;
  alt: string;
  onFileSelect: (file: File) => void;
  name: string;
}

export const ImageUpdate = ({
  url,
  alt,
  onFileSelect,
  name,
}: ImageUpdateProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file satisfies Blob));
      onFileSelect(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        aspectRatio: '16 / 9',
      }}
    >
      <input
        name={name}
        onChange={handleFileSelect}
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
      />
      <img
        src={preview || url}
        alt={alt}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
        onClick={handleClick}
      >
        <PencilIcon />
      </IconButton>
    </Box>
  );
};
