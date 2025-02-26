import { cn } from "../../utils/utils";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

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

export const FileUpload = ({ onChange, files, setFiles }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return acceptableFormats.includes(fileExtension);
    });

    if (validFiles.length < newFiles.length) {

      toast.warning("Invalid file format!")
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    onChange && onChange(validFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          multiple
          accept={acceptableFormats.map((format) => `.${format}`).join(",")}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div
          className={cn("flex flex-col items-center justify-center space-y-1", {
            hidden: files.length,
          })}
        >
          <p className="relative z-20 font-sans text-base font-bold text-gray-400">
            Upload file
          </p>
          <p className="relative z-20 font-sans text-base font-normal text-gray-300">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative mx-auto w-full max-w-xl pb-1">
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "bg-gradient-to-b from-blue via-via to-to relative z-40 mx-auto mt-4 flex h-24 w-full max-w-[6rem] items-center justify-center rounded-md p-1 ring-1 ring-white/20 group-hover/file:shadow-2xl",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-neutral-300"
                  >
                    Drop it
                    <IconUpload className="size-5 text-neutral-300 " />
                  </motion.p>
                ) : (
                  <IconUpload className="size-5 text-neutral-300 " />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-24 w-full max-w-[6rem] items-center justify-center rounded-md border border-dashed border-gray-400 bg-transparent opacity-0"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
