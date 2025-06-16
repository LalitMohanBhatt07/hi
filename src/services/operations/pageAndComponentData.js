import React from 'react';
import { toast } from "react-hot-toast";

export const getCatalogaPageData = async (categoryId) => {
  console.log("a",categoryId)
  
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await fetch("http://localhost:4000/api/v1/course/getCategoryPageDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryId }),
    });

    const data = await response.json();
    console.log("📦 Response Data:", data);
    console.log("aata : ",data);

    if (!response.ok || !data.success) {
      // Throw custom error with backend-provided message if available
      const errorMsg = data?.error || data?.message || "Unknown error occurred";
      throw new Error(errorMsg);
    }

    result = data;
  } catch (error) {
    console.error("❌ CATALOG PAGE DATA API ERROR:", error);
    toast.error(`Error: ${error.message}`);
    result = {
      success: false,
      message: error.message,
    };
  }

  toast.dismiss(toastId);
  return result;
};
