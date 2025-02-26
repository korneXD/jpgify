"use client";

import { useState, useCallback } from "react";
import { db, doc, setDoc, increment } from "../utils/database";
import { cn } from "@/utils/utils";
import { toast } from "sonner";
import imageConversion from "image-conversion";
import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const heic2any = dynamic(() => import("heic2any"), { ssr: false });

export const UseConvertImage = ({
  files,
  setFiles,
  setTotalSizeMB,
  bulkFormat,
  setBulkFormat,
  acceptableFormats,
  handleDownloadAll,
}) => {
  const [loading, setLoading] = useState(false);
  const [convertedImages, setAllConverted] = useState(false);

  const convertImage = useCallback(
    async (index) => {
      const fileData = files[index];
      const { file, format, convertedFormat } = fileData;

      try {
        let convertedBlob;

        if (format === "heic" || format === "heif") {
          convertedBlob = await heic2any({
            blob: file,
            toType: `image/${convertedFormat}`,
            quality: 0.8,
          });
        } else if (["avif", "tiff", "bmp", "jfif"].includes(format)) {
          convertedBlob = await imageConversion.convert(file, {
            format: convertedFormat,
            quality: 0.8,
          });
        } else {
          const img = await createImageBitmap(file);
          const canvas = new OffscreenCanvas(img.width, img.height);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          convertedBlob = await canvas.convertToBlob({
            type: `image/${convertedFormat}`,
            quality: 0.8,
          });
        }

        const url = URL.createObjectURL(convertedBlob);
        const updatedFiles = [...files];
        updatedFiles[index].convertedImage = url;
        setFiles(updatedFiles);

        const fileSizeInMB = file.size / (1024 * 1024);
        await setDoc(
          doc(db, "stats", "totalSize"),
          { value: increment(fileSizeInMB) },
          { merge: true }
        );

        setTotalSizeMB((prev) => (parseFloat(prev) + fileSizeInMB).toFixed(2));

        const allConverted = files.every((file) => file.convertedImage);
        if (allConverted) {
          setLoading(false);
          setAllConverted(true);
        }
      } catch (error) {
        console.error("Error converting image:", error);
        toast.error(`Failed to convert ${fileData.name}. Please try again.`);
      }
    },
    [files, setFiles, setTotalSizeMB]
  );

  const handleBulkConvert = useCallback(async () => {
    setLoading(true);
    for (let i = 0; i < files.length; i++) {
      await convertImage(i);
    }
    setLoading(false);
  }, [files, convertImage]);

  const download = () => {
    toast.success("Downloading images...");
    console.log("asd");
  };

  return (
    <div className="w-full">
      {files.length > 1 && (
        <div className="mb-4 flex justify-center items-center space-x-2 flex-col">
          <label className="block mb-2 text-gray-300">
            Select default format for all files:
          </label>
          <select
            value={bulkFormat}
            onChange={(e) => {
              setBulkFormat(e.target.value);
              const updatedFiles = files.map((file) => ({
                ...file,
                convertedFormat:
                  file.convertedFormat === bulkFormat
                    ? e.target.value
                    : file.convertedFormat,
              }));
              setFiles(updatedFiles);
            }}
            className="p-2 ring-1 font-semibold ring-white/20 bg-white/10 rounded text-gray-300 cursor-pointer outline-none"
          >
            {acceptableFormats.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.3 }}
              className="p-4 ring-1 ring-white/20 bg-white/5 rounded-xl backdrop-blur-xs max-w-[300px] w-full"
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
                <select
                  value={file.convertedFormat}
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index].convertedFormat = e.target.value;
                    setFiles(updatedFiles);
                  }}
                  className="p-2 ring-1 font-semibold ring-white/20 bg-white/10 rounded text-gray-300 cursor-pointer outline-none"
                >
                  {acceptableFormats.map((format) => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {files.length == 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => convertImage(index)}
                    className="mt-2 bg-blue cursor-pointer text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold"
                  >
                    Convert
                  </button>
                  <a
                    href={file.convertedImage}
                    download={`${file.name
                      .split(".")
                      .slice(0, -1)
                      .join(".")}modify.${file.convertedFormat}`}
                    className={cn(
                      "mt-2 inline-block bg-green-700 text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold",
                      {
                        "bg-green-900": !file.convertedImage,
                      }
                    )}
                    onClick={
                      !file.convertedImage
                        ? () => toast.warning("Convert the image first...")
                        : download
                    }
                  >
                    Download
                  </a>
                </div>
              )}
            </motion.div>
          ))}
      </div>
      {files.length > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={handleBulkConvert}
            className="mt-2 bg-blue cursor-pointer text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold"
          >
            Convert All
          </button>
          <button
            onClick={handleDownloadAll}
            className={cn(
              "mt-2 inline-block cursor-pointer bg-green-700 text-white px-4 py-2 rounded-xl ring-1 ring-white/5 font-semibold",
              {
                "bg-green-900": !files.every((file) => file.convertedImage),
              }
            )}
          >
            {loading ? (
              <LoaderCircle className="animate-spin text-green-400" />
            ) : (
              "Download All as ZIP"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
