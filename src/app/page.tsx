/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import axios from "axios";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleClick = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      // Step 1: Request a signed URL from the backend
      const { data: signedUrlResponse } = await axios.post("/api/upload", {
        fileName: "test1.pdf",
        fileType: file.type,
      });

      const { uploadUrl } = signedUrlResponse;

      // Step 2: Upload the file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      console.log("File uploaded successfully");
    } catch (e) {
      console.error("Error uploading file:", e);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="mb-4 text-4xl font-bold">Cloud Computing</p>
        <Dropzone
          onDrop={(acceptedFiles) => setFile(acceptedFiles[0] ?? null)}
          accept={{ "application/pdf": [] }}
          maxFiles={1}
        >
          {({ getRootProps, getInputProps }) => (
            <section className="my-2 -mr-2 rounded-2xl border-2 border-dashed p-8 text-center">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                  Drag &apos;n&apos; drop a file here, or{" "}
                  <span className="text-[#6D28D9]">click</span> to select a file
                </p>
              </div>
              <div
                className={`mt-2 text-xs ${
                  !file ? "text-red-500" : "text-gray-600"
                }`}
              >
                {file ? file.name : "No file selected"}
              </div>
            </section>
          )}
        </Dropzone>
        <label className="mx-2 -mr-2 block text-center text-xs font-medium text-gray-700">
          Only PDFs are allowed
          <sup className="text-red-500">*</sup>
        </label>

        <button
          onClick={handleClick}
          className="mt-4 rounded bg-black px-3 py-2 text-white"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Page;
