"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null); // State for storing presigned URL
  const [fileContent, setFileContent] = useState<string | null>(null); // State for storing content of the .txt file
  const [loading, setLoading] = useState<boolean>(true);
  const processData = async () => {
    try {
      // Step 1: Get the presigned URL from the backend
      const response = await axios.get<{ signedUrl: string }>(
        "/api/get?key=test1-summary.txt",
      );
      console.log(response.data.signedUrl);
      setPresignedUrl(response.data.signedUrl); // Store the presigned URL

      // Step 2: Fetch the content of the .txt file from the presigned URL
      const contentResponse = await axios.get<string>(response.data.signedUrl, {
        responseType: "text", // Ensure response is treated as text
      });

      // Step 3: Set the fetched file content to state
      setFileContent(contentResponse.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch presigned URL or content");
    }
  };

  // Run processData only once when the component is mounted
  useEffect(() => {
    setTimeout(() => {
      void processData();
    }, 60000);
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div className="flex min-h-screen w-screen items-center justify-center overflow-auto">
      {loading && <p>Loading...</p>}
      {fileContent && (
        <div className="mt-4 w-full rounded-md border bg-gray-100 p-4">
          <p className="text-lg font-medium">File Content:</p>
          <pre className="whitespace-pre-wrap text-sm">{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default Page;
