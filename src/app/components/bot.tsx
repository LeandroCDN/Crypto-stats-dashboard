"use client";
import { useEffect, useState } from "react";
import { fetchTopMoversOne, fetchTopMoversThree } from "@/app/utils/api";

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

  const handleFetchTopMovers = async () => {
    try {
      const data = await fetchTopMoversThree();
      const sortedData = data.sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );

      setTopGainers(sortedData.slice(0, 3));
      setTopLosers(sortedData.slice(-3).reverse());
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
        className="gradient-border-mask rounded-xl w-2/5 mr-1 flex flex-row justify-evenly"
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
      <div className="gradient-border-mask rounded-xl w-3/5">
        Este hoy no - ETF cash flow
      </div>
    </div>
  );
}
