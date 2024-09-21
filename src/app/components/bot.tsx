"use client";
import { useEffect, useState } from "react";
import {
  fetchTopMoversThree,
  fetchBTCETFFlows,
  fetchETHETFFlows,
} from "@/app/utils/api";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price_change_percentage_24h: number;
}

interface ETFFlow {
  [key: string]: {
    usd: number;
    [key: string]: any;
  };
}

export default function BotSection() {
  const [topGainers, setTopGainers] = useState<Crypto[]>([]);
  const [topLosers, setTopLosers] = useState<Crypto[]>([]);
  const [btcFlows, setBtcFlows] = useState<ETFFlow | null>(null);
  const [ethFlows, setEthFlows] = useState<ETFFlow | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataBTCETFF = await fetchBTCETFFlows();
        const dataETHETFF = await fetchETHETFFlows();
        if (
          dataBTCETFF &&
          dataBTCETFF.points &&
          dataBTCETFF.points.length > 0
        ) {
          const abbreviations = {
            CHINAAMC: "CAMC",
            "BOSERA&HASHKEY": "B&H",
          };

          // Remove 'date' field and set the state
          const processFlows = (flows) => {
            const result = { ...flows };
            Object.keys(result).forEach((key) => {
              const newKey = abbreviations[key] || key; // Abbreviate if applicable
              result[newKey] = { ...result[key] };
              if (newKey !== key) delete result[key]; // Remove old key if abbreviated
            });
            return result;
          };

          // Process BTC and ETH flows
          const btcFlowsWithoutDate = processFlows({
            ...dataBTCETFF.points[2],
          });
          delete btcFlowsWithoutDate.date;
          setBtcFlows(btcFlowsWithoutDate);

          const ethFlowsWithoutDate = processFlows({
            ...dataETHETFF.points[2],
          });
          delete ethFlowsWithoutDate.date;
          setEthFlows(ethFlowsWithoutDate);

          console.log("Processed BTC ETF Flows", btcFlowsWithoutDate);
          console.log("Processed ETH ETF Flows", ethFlowsWithoutDate);
        } else {
          console.error(
            "Unexpected dataBTCETFF structure received",
            dataBTCETFF
          );
        }
      } catch (error) {
        console.error("Failed to fetch BTC ETF Flows", error);
      }
    };
    fetchData();
  }, []);

  const renderTable = (flows: ETFFlow | null, title: string) => {
    if (!flows) return null;

    const formatToMillions = (value: number | null | undefined) => {
      if (value === null || value === undefined) return "--";
      return `${(value / 1_000_000).toFixed(1)}M`;
    };

    const reorderedFlows = Object.entries(flows).reduce((acc, [key, value]) => {
      if (key === "total") {
        return { ...acc, [key]: value }; // Add 'total' at the end
      }
      return { [key]: value, ...acc }; // Add all other keys first
    }, {});

    return (
      <div className="mb-4">
        <h3 className="text-sm font-bold mb-2">{title}</h3>{" "}
        {/* Fuente más pequeña */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Object.keys(reorderedFlows).map((name) => (
                <th
                  key={name}
                  className="border px-2 py-1 text-xs font-semibold"
                >
                  {" "}
                  {/* Reduce el padding y tamaño de fuente */}
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.entries(flows).map(([name, data]) => (
                <td key={name} className="border px-2 py-1 text-xs">
                  {" "}
                  {/* Reduce el padding y tamaño de fuente */}
                  {data.usd != null ? (
                    <span
                      className={
                        data.usd >= 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {data.usd >= 0 ? "+" : ""}
                      {formatToMillions(data.usd)}
                    </span>
                  ) : (
                    "--"
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

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
        <div>
          {btcFlows
            ? renderTable(btcFlows, "BTC ETF Flows")
            : "Waiting for data..."}
          {ethFlows
            ? renderTable(ethFlows, "ETH ETF Flows")
            : "Waiting for data..."}
        </div>
      </div>
    </div>
  );
}
