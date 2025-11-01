import React, { useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
  children: React.ReactElement<{ onClick?: () => void; }>;
  accept?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, children, accept = "image/*" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        onUpload(readEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />
      {React.cloneElement(children, { onClick: triggerFileUpload })}
    </>
  );
};

export default ImageUploader;