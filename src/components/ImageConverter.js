"use client";

import { useState, useEffect } from "react";
import { db, doc, setDoc, increment, getDoc } from "../utils/database";
import { FileUpload } from "./ui/file-upload";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import imageConversion from "image-conversion";
import dynamic from "next/dynamic";
import { UseConvertImage } from "./convertImage";
import { UseOptimizeImage } from "./optimizeImage";
import { UseResizeImage } from "./resizeImage";
import CountUp from "./ui/countup";

const heic2any = dynamic(() => import("heic2any"), { ssr: false });

const acceptableFormats = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "bmp",
  "tiff",
  "jfif",
  "heic",
];

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [bulkFormat, setBulkFormat] = useState("jpeg");
  const [totalSizeMB, setTotalSizeMB] = useState(0);

  const [optimizeEnabled, setOptimizeEnabled] = useState(false);

  const [activeTab, setActiveTab] = useState("convert");
  const [loading, setLoading] = useState(false);
  const [optimizedImages, setOptimizedAll] = useState(false);
  const [convertedImages, setAllConverted] = useState(false);
  const [resizedImages, setResizedImages] = useState(false);

  useEffect(() => {
    const fetchTotalSize = async () => {
      const totalSizeDoc = await getDoc(doc(db, "stats", "totalSize"));
      if (totalSizeDoc.exists()) {
        setTotalSizeMB(totalSizeDoc.data().value.toFixed(2));
      }
    };
    fetchTotalSize();
  }, []);

  const handleFileUpload = (uploadedFiles) => {
    const maxFiles = uploadedFiles.slice(0, 10);

    if (maxFiles.length == 10) toast.warning("Sorry! Maximum 10 files...");

    const formattedFiles = maxFiles.map((file) => ({
      file,
      name: file.name,
      size:
        file.size / (1024 * 1024) < 1
          ? (file.size / 1024).toFixed(2) + " KB"
          : (file.size / (1024 * 1024)).toFixed(2) + " MB",
      format: file.name.split(".").pop().toLowerCase(),
      convertedFormat: bulkFormat,
      convertedImage: null,
      originalWidth: 0,
      originalHeight: 0,
    }));
    setFiles(formattedFiles);
  };

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (activeTab === "resize") {
      files.forEach(async (file, index) => {
        const dimensions = await getImageDimensions(file.file);
        const updatedFiles = [...files];
        updatedFiles[index].originalWidth = dimensions.width;
        updatedFiles[index].originalHeight = dimensions.height;
        setFiles(updatedFiles);
      });
    }
  }, [activeTab, files]);

  useEffect(() => {
    if (optimizedImages) {
      toast.success("Optimized all images!");
    } else if (convertedImages) {
      toast.success("Converted all images!");
    } else if (resizedImages) {
      toast.success("Resized all images!");
    }
  }, [optimizedImages, convertedImages, resizedImages]);

  const handleDownloadAll = () => {
    const warning = files.every((file) => file.convertedImage);
    if (warning == false) {
      toast.warning("Convert the images first...");
    } else toast.success("Downloading images...");

    const zip = new JSZip();
    files.forEach((file) => {
      if (file.convertedImage) {
        fetch(file.convertedImage)
          .then((res) => res.blob())
          .then((blob) => {
            zip.file(
              `${file.name.split(".").slice(0, -1).join(".")}modify.${
                file.convertedFormat
              }`,
              blob,
            );
            if (Object.keys(zip.files).length === files.length) {
              zip.generateAsync({ type: "blob" }).then((content) => {
                saveAs(content, "jpgify_images.zip");
              });
            }
          });
      }
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="z-20 flex w-fit flex-col items-center justify-center space-y-4"
    >
      <div className="flex w-full max-w-[380px] items-center justify-around text-lg font-semibold text-gray-300">
        <button
          className={`cursor-pointer ${
            activeTab === "convert"
              ? "underline decoration-white underline-offset-3"
              : ""
          }`}
          onClick={() => {
            setActiveTab("convert");
            setFiles([]);
          }}
        >
          <h2>Convert</h2>
        </button>
        <button
          className={`cursor-pointer ${
            activeTab === "resize"
              ? "underline decoration-white underline-offset-3"
              : ""
          }`}
          onClick={() => {
            setActiveTab("resize");
            setFiles([]);
          }}
        >
          <h2>Resize</h2>
        </button>
        <button
          className={`cursor-pointer ${
            activeTab === "optimize"
              ? "underline decoration-white underline-offset-3"
              : ""
          }`}
          onClick={() => {
            setActiveTab("optimize");
            setFiles([]);
          }}
        >
          <h2>Optimize</h2>
        </button>
      </div>
      <motion.div
        layout
        transition={{ layout: { duration: 0.2, ease: "easeInOut" } }}
        className="flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white/5 p-4 ring-1 ring-white/20"
      >
        <h1 className="mb-4 text-2xl font-bold text-gray-200">
          <span className="capitalize">{activeTab}</span> your images with
          JPGify
        </h1>

        <FileUpload
          onChange={handleFileUpload}
          acceptableFormats={acceptableFormats.join(",")}
          files={files}
          setFiles={setFiles}
        />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, transition: 1 }}
          className="w-full"
        >
          {activeTab === "convert" && (
            <UseConvertImage
              files={files}
              setFiles={setFiles}
              setTotalSizeMB={setTotalSizeMB}
              bulkFormat={bulkFormat}
              setBulkFormat={setBulkFormat}
              acceptableFormats={acceptableFormats}
              handleDownloadAll={handleDownloadAll}
            />
          )}
          {activeTab === "resize" && (
            <UseResizeImage
              files={files}
              setFiles={setFiles}
              setTotalSizeMB={setTotalSizeMB}
              bulkFormat={bulkFormat}
              setBulkFormat={setBulkFormat}
              acceptableFormats={acceptableFormats}
              handleDownloadAll={handleDownloadAll}
            />
          )}
        </motion.div>

        {files.length > 0 && (
          <button
            onClick={() => setFiles([])}
            className="mt-4 cursor-pointer font-semibold text-gray-300"
          >
            Upload more files
          </button>
        )}
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8 text-center text-gray-500"
      >
        All converted MBs all time:{" "}
        <CountUp from={0} to={totalSizeMB} direction="up" duration={2} /> MB
      </motion.footer>
    </motion.section>
  );
}
