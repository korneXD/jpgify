"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import { LoaderCircle } from "lucide-react";

export const UseResizeImage = ({ files, setFiles, handleDownloadAll }) => {
  const [loading, setLoading] = useState(false);
  const [resizedImages, setResizedImages] = useState(false);
  const [optimizeQuality, setOptimizeQuality] = useState(0.8);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (missing) toast.warning("Width or height missing...");
  }, [missing]);

  const resizeImage = useCallback(
    async (index, width, height) => {
      const fileData = files[index];
      const { file, convertedFormat } = fileData;

      if (!width || !height) {
        setMissing(true);
        return;
      }
      setMissing(false);

      try {
        const img = await createImageBitmap(file);
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const resizedBlob = await canvas.convertToBlob({
          type: `image/${convertedFormat}`,
          quality: optimizeQuality,
        });

        const url = URL.createObjectURL(resizedBlob);
        const updatedFiles = [...files];
        updatedFiles[index].convertedImage = url;
        updatedFiles[index].resizedWidth = width;
        updatedFiles[index].resizedHeight = height;
        setFiles(updatedFiles);

        const allResized = files.every((file) => file.convertedImage);
        if (allResized) {
          setLoading(false);
          setResizedImages(true);
          toast.success("All images resized successfully!");
        }
      } catch (error) {
        console.error("Error resizing image:", error);
        toast.error(`Failed to resize ${fileData.name}. Please try again.`);
      }
    },
    [files, setFiles, optimizeQuality]
  );

  const handleBulkResize = useCallback(() => {
    setLoading(true);
    let hasMissingValues = false;

    files.forEach((file, index) => {
      const { resizedWidth, resizedHeight } = file;
      if (!resizedWidth || !resizedHeight) {
        hasMissingValues = true;
        setMissing(true);
      } else {
        resizeImage(index, resizedWidth, resizedHeight);
        setMissing(false);
      }
    });

    if (!hasMissingValues) {
      toast.success("Resizing all images...");
    } else {
      setLoading(false);
    }
  }, [files, resizeImage]);

  const lockAspectRatio = useCallback(
    (index, width, height) => {
      const updatedFiles = [...files];
      const file = updatedFiles[index];
      const aspectRatio = file.originalWidth / file.originalHeight;

      if (width) {
        updatedFiles[index].resizedHeight = Math.round(width / aspectRatio);
      } else if (height) {
        updatedFiles[index].resizedWidth = Math.round(height * aspectRatio);
      }

      setFiles(updatedFiles);
    },
    [files, setFiles]
  );

  return (
    <>
      <div
        className={cn(
          "gap-6 flex justify-center items-center w-full flex-col",
          {
            "flex-row flex-wrap": files.length > 3,
          }
        )}
      >
        {files.length > 0 &&
          files.map((file, index) => (
            <div
              key={index}
              className="p-4 ring-1 ring-white/20 bg-white/5 rounded-xl backdrop-blur-xs  w-fit max-w-fit mb-4"
            >
              <div className="flex justify-between items-center space-x-4 max-w-md">
                <div>
                  <p className="font-semibold text-white truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    {file.size} - {file.format.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <div className="flex flex-col">
                  <label className="text-gray-300">Width</label>
                  <input
                    type="number"
                    value={file.resizedWidth || ""}
                    placeholder={file.originalWidth}
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index].resizedWidth = e.target.value
                        ? parseInt(e.target.value)
                        : null;
                      setFiles(updatedFiles);
                    }}
                    className="p-2 outline-none ring-1 ring-white/20 w-full max-w-[80px] bg-white/10 rounded text-gray-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-300">Height</label>
                  <input
                    type="number"
                    value={file.resizedHeight || ""}
                    placeholder={file.originalHeight}
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index].resizedHeight = e.target.value
                        ? parseInt(e.target.value)
                        : null;
                      setFiles(updatedFiles);
                    }}
                    className="p-2 outline-none ring-1 ring-white/20 w-full max-w-[80px] bg-white/10 rounded text-gray-300"
                  />
                </div>
                <button
                  onClick={() =>
                    lockAspectRatio(
                      index,
                      file.resizedWidth,
                      file.resizedHeight
                    )
                  }
                  className="mt-6 bg-blue-500 text-white px-2 py-1 rounded"
                >
                  🔗
                </button>
              </div>
              {files.length === 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={() =>
                      resizeImage(index, file.resizedWidth, file.resizedHeight)
                    }
                    className="mt-2 bg-blue cursor-pointer text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold"
                  >
                    Resize
                  </button>
                  <a
                    href={file.convertedImage}
                    download={`${file.name
                      .split(".")
                      .slice(0, -1)
                      .join(".")}jpgify.${file.format}`}
                    className={cn(
                      "mt-2 inline-block bg-green-700 text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold",
                      {
                        "bg-green-900": !file.convertedImage,
                      }
                    )}
                  >
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Download"
                    )}
                  </a>
                </div>
              )}
            </div>
          ))}
      </div>
      {files.length > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={handleBulkResize}
            className="mt-2 bg-blue cursor-pointer text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold"
          >
            Resize All
          </button>
          <button
            onClick={handleDownloadAll}
            className={cn(
              "mt-2 inline-block bg-green-700 text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold",
              {
                "bg-green-900": !files.every((file) => file.convertedImage),
              }
            )}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Download all as ZIP"
            )}
          </button>
        </div>
      )}
    </>
  );
};
