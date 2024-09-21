"use client";
import { useEffect, useState } from "react";
import { fetchTopMoversThree, fetchBTCETFFlows } from "@/app/utils/api";
// import BtcEtfFlowBar from "./btcEtfFlowBar";
// import { fetchBTCETFFlows, } from "@/app/btc-etf-flows";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price_change_percentage_24h: number;
}

export default function BotSection() {
  const [topGainers, setTopGainers] = useState<Crypto[]>([]);
  const [topLosers, setTopLosers] = useState<Crypto[]>([]);
  const [btcFlows, setBtcFlows] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBTCETFFlows();
        if (data && data.points && data.points.length > 0) {
          setBtcFlows(data.points[2]);
          console.log("bot.tsx data", data.points[2]);
        } else {
          console.error("Unexpected data structure received", data);
        }
      } catch (error) {
        console.error("Failed to fetch BTC ETF Flows", error);
      }
    };
    fetchData();
  }, []);

  const handleFetchTopMovers = async () => {
    try {
      const data = await fetchTopMoversThree();
      const sortedData = data.sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );

      setTopGainers(sortedData.slice(0, 5));
      setTopLosers(sortedData.slice(-5).reverse());
    } catch (error) {
      console.error("Failed to fetch Top Gainers and Losers", error);
    }
  };

  const renderCryptoList = (cryptoList: any[]) => {
    return (cryptoList || []).map((crypto) => (
      <div key={crypto.id} className="flex items-center mb-2">
        <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
        <span>{crypto.symbol.toUpperCase()}: </span>
        <span
          className={
            crypto.price_change_percentage_24h >= 0
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {crypto.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
    ));
  };

  return (
    <div className="flex flex-row w-full h-1/3">
      <div
        className="border-1 border-zinc-50 rounded-xl w-2/5 mr-1.5 flex flex-row justify-evenly gradient-border-mask bg-black bg-opacity-50"
        onClick={handleFetchTopMovers} // Aquí agregamos el manejador de eventos
      >
        <div className="w-1/2 p-2">
          <h2 className="text-xl font-bold mb-4">Top Gainers</h2>
          {topGainers.length > 0 ? (
            renderCryptoList(topGainers)
          ) : (
            <p>Click to load top gainers</p>
          )}
        </div>
        <div className="w-1/2 p-2">
          <h2 className="text-xl font-bold mb-4">Top Losers</h2>
          {topLosers.length > 0 ? (
            renderCryptoList(topLosers)
          ) : (
            <p>Click to load top losers</p>
          )}
        </div>
      </div>
      <div className="gradient-border-mask rounded-xl w-3/5 p-5 bg-black bg-opacity-50">
        <p> Esto hoy no</p>
      </div>
    </div>
  );
}
