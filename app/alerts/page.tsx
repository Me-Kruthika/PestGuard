"use client";

import { useState } from "react";

export default function AlertsPage() {
  const [isTesting, setIsTesting] = useState(false);

  const handleTestAlert = async (type: string) => {
    console.log("BUTTON CLICKED:", type);

    setIsTesting(true);

    try {
      const response = await fetch("/api/alerts/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
        }),
      });

      const result = await response.json();

      console.log(result);

      if (result.success) {
        alert("SMS Alert Sent Successfully");
      } else {
        alert("Failed: " + result.error);
      }
    } catch (error: any) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        SMS Alert System
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => handleTestAlert("test-detection")}
          disabled={isTesting}
          className="bg-green-600 text-white px-6 py-4 rounded-xl"
        >
          Detection Alert
        </button>

        <button
          onClick={() => handleTestAlert("test-community")}
          disabled={isTesting}
          className="bg-blue-600 text-white px-6 py-4 rounded-xl"
        >
          Community Alert
        </button>

        <button
          onClick={() => handleTestAlert("test-outbreak")}
          disabled={isTesting}
          className="bg-red-600 text-white px-6 py-4 rounded-xl"
        >
          Outbreak Alert
        </button>
      </div>
    </div>
  );
}