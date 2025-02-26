"use client";

import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const heic2any = dynamic(() => import("heic2any"), { ssr: false });

export const UseOptimizeImage = (files, setFiles) => {
  const [loading, setLoading] = useState(false);
  const [optimizedImages, setOptimizedAll] = useState(false);

  const optimizeImage = async ({
    files,
    setFiles,
    bulkFormat,
    setBulkFormat,
    acceptableFormats,
    handleDownloadAll,
  }) => {
    const fileData = files[index];
    const { file, format } = fileData;

    try {
      let optimizedBlob;
      if (format === "heic" || format === "heif") {
        optimizedBlob = await heic2any({
          blob: file,
          toType: `image/${format}`,
          quality: optimizeQuality,
        });
      } else {
        const img = new Image();
        const reader = new FileReader();

        optimizedBlob = await new Promise((resolve) => {
          reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              canvas.toBlob(
                (blob) => resolve(blob),
                `image/${format}`,
                optimizeQuality
              );
            };
          };
          reader.readAsDataURL(file);
        });
      }

      const url = URL.createObjectURL(optimizedBlob);
      const updatedFiles = [...files];
      updatedFiles[index].convertedImage = url;
      setFiles(updatedFiles);
      const allOptimized = files.every((file) => file.convertedImage);
      setLoading(true);
      if (allOptimized) {
        setLoading(false);
        setOptimizedAll(true);
      }
    } catch (error) {
      console.error("Error optimizing image:", error);
      toast.error(`Failed to optimize ${fileData.name}. Please try again.`);
    }
  };

  const handleBulkOptimize = (optimizeQuality) => {
    files.forEach((_, index) => optimizeImage(index, optimizeQuality));
  };

  return <h1>asd</h1>;
};
