
import React, { useRef } from 'react';
import { MathLayout } from "@/components/MathLayout";
import { Button } from "@/components/ui/button";

const PdfAnalyze = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // Handle file upload logic here
    }
  };

  return (
    <MathLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">PDF Analyzer</h1>

        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <p className="text-gray-600 mb-4">
            Drag and drop your PDF here or click to upload
          </p>
          <Button onClick={handleClick}>
            Select PDF
          </Button>
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            className="hidden"
            onChange={handleChange}
            ref={hiddenFileInput}
          />
        </div>
      </div>
    </MathLayout>
  );
};

export default PdfAnalyze;
