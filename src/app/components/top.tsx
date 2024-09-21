"use client";
import { useEffect, useState } from "react";
import { fetchFearAndGreed } from "@/app/utils/api";
// import "@/app/global.css";

export default function TopSection() {
  const [fearAndGreed, setFearAndGreed] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFearAndGreed();
        const latestIndex = data.data[0];

        setFearAndGreed(latestIndex);
      } catch (error) {
        console.error("Failed to fetch Fear and Greed Index", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-row w-full h-1/3 mb-1.5">
      <div className="flex flex-col w-2/5 h-full mr-1.5">
        <div className="gradient-border-mask rounded-xl h-2/5 mb-1.5 bg-black bg-opacity-50">
          <h1>LAB REPORT</h1>
        </div>
        <div className="gradient-border-mask rounded-xl h-3/5 flex flex-row justify-between items-center bg-black bg-opacity-50">
          <div className="flex flex-col">
            <div>
              <p className="text-3xl">FEAR AND GREED INDEX:</p>
            </div>
            <div>
              <p className="text-4xl">
                {fearAndGreed
                  ? fearAndGreed.value_classification.toUpperCase()
                  : "Loading..."}
              </p>
            </div>
          </div>
          <div>
            <p className="text-3xl">
              {fearAndGreed ? `${fearAndGreed.value}/100` : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="gradient-border-mask rounded-xl w-3/5 bg-black bg-opacity-50">
        {" "}
        Este hoy no - 7D Twitter Crypto Discussion
      </div>
    </div>
  );
}
