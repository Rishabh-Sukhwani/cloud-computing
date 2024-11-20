"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (file) {
      const convertFile = async () => {
        const base64File = await fileToBase64(file);
        console.log(base64File);
      };
      void convertFile();
    }
  }, [file]);

  const handleClick = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    try {
      const base64File = await fileToBase64(file);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/upload`,
        {
          file: base64File,
          file_name: file.name,
        },
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
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
