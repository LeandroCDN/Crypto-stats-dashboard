"use client";
import { useEffect, useState } from "react";
import { fetchMarketcap, sectorPerformance } from "@/app/utils/api";
import SectorPerformanceDisplay from "./SectorPerformanceDisplay";
import axios from "axios";

export default function MidSection() {
  const [marketcap, setMarketcap] = useState<number | null>(null);
  const [marketcapDaily, setMarketcapDaily] = useState<number | null>(null);
  const [sectorPerformanceTop, setSectorPerformanceTop] = useState<
    any[] | null
  >(null);
  const [activeCryptocurrencies, setActiveCryptocurrencies] = useState<
    number | null
  >(null);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("/api/cmc-data");
      // console.log("categories");
      // console.log(response); // Aquí puedes manejar los datos según sea necesario
      // console.log(response.data); // Aquí puedes manejar los datos según sea necesario
      return response.data;
    };

    getData();
  }, []);

  const handleFetchMarketcap = async () => {
    try {
      const data = await fetchMarketcap();

      if (data) {
        /// number: 2160996389276.9094
        const number = parseFloat(data.data.total_market_cap.usd);

        // Truncar a 2 decimales en miles de millones
        const truncated = Math.floor((number / 1e12) * 100) / 100;

        // Formatear el número para mostrarlo
        const formattedMarketCap = truncated.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        // console.log("formattedMarketCap", formattedMarketCap); // string: $2

        setMarketcap(truncated);
        setMarketcapDaily(data.data.market_cap_change_percentage_24h_usd);
        setActiveCryptocurrencies(data.data.active_cryptocurrencies);
      }
    } catch (error) {
      console.error("Failed to fetch marketcap", error);
    }
  };
  const handleSectorPerformance = async () => {
    try {
      const data = await sectorPerformance();

      // Sort the data by the absolute value of market_cap_change_24h
      const sortedData = data.sort(
        (
          a: { market_cap_change_24h: number },
          b: { market_cap_change_24h: number }
        ) => {
          return (
            Math.abs(b.market_cap_change_24h) -
            Math.abs(a.market_cap_change_24h)
          );
        }
      );

      // Get the top 5 sectors
      const top5Sectors = sortedData.slice(0, 5);
      setSectorPerformanceTop(top5Sectors);
    } catch (error) {
      console.error("Failed to fetch or process sector performance", error);
      return [];
    }
  };

  return (
    <div className="flex flex-row w-full h-1/3 mb-1.5">
      <div
        className="gradient-border-mask rounded-xl w-3/5 mr-1.5 bg-black bg-opacity-50"
        onClick={handleSectorPerformance}
      >
        {sectorPerformanceTop ? (
          <SectorPerformanceDisplay
            sectorPerformanceTop={sectorPerformanceTop}
          />
        ) : (
          "Click to load"
        )}
      </div>
      <div
        className="gradient-border-mask rounded-xl w-2/5 flex flex-col items-center justify-evenly bg-black bg-opacity-50"
        onClick={handleFetchMarketcap}
      >
        <h3 className="text-3xl mb-2">Total Crypto Marketcap</h3>
        <div>
          <p className="text-8xl mb-2">
            {marketcap ? `$${marketcap.toLocaleString()}T` : "Click to load "}
          </p>
        </div>
        <div className="flex flex-row">
          <div className="mr-8">
            Daily:
            {marketcapDaily
              ? `${marketcapDaily.toLocaleString()}%`
              : "Click to load "}
          </div>
          <div>
            Active Cryptos:
            {activeCryptocurrencies
              ? `${activeCryptocurrencies.toLocaleString()}`
              : "Click to load "}
          </div>
        </div>
      </div>
    </div>
  );
}
