"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import MidSection from "./components/mid";
import TopSection from "./components/top";
import BotSection from "./components/bot";

export default function Home() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString();
  const [fearAndGreed, setFearAndGreed] = useState(null);
  const [marketcap, setMarketcap] = useState(null);
  const [marketcapDaily, setMarketcapDaily] = useState(null);
  const [activeCryptocurrencies, setActiveCryptocurrencies] = useState(null);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);

  //Top 100 Gainers - Lossers. [coingecko call]
  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        // Realiza solicitudes a las tres páginas
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=100&page=1"
        );
        const data = await response.json();

        const allData = data.flat();

        // Ordena las criptomonedas por porcentaje de cambio en 24 horas
        const sortedData = allData.sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        );

        // Toma los 3 mayores ganadores y 3 mayores perdedores

        await setTopGainers(sortedData.slice(0, 3));
        await setTopLosers(sortedData.slice(-3).reverse());

        console.log("Top Gainers: sortedData", sortedData.slice(0, 3)); // (3) [{…}, {…}, {…}]
        console.log("Top Losers: sortedData", sortedData.slice(-3).reverse()); // (3) [{…}, {…}, {…}]
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTopMovers();
  }, []);

  // Total Crypto Marketcap. [coingecko call]
  useEffect(() => {
    const fetchMarketcap = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/global");
        const data = await response.json();

        if (response.ok) {
          setMarketcap(data.data.total_market_cap.usd); // Obtenemos el market cap en USD
          setMarketcapDaily(data.data.market_cap_change_percentage_24h_usd);
          setActiveCryptocurrencies(data.data.active_cryptocurrencies);
        } else {
          console.error("Failed to fetch marketcap");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMarketcap();
  }, []);

  // FEAR AND GREED INDEX. [rapidapi call]
  useEffect(() => {
    const fetchFearAndGreed = async () => {
      try {
        const response = await fetch(
          "https://fear-and-greed-index.p.rapidapi.com/v1/fgi",
          {
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "cd2553efacmsh1e91ede7bcbd178p108f7fjsn17ee3fad3996",
              "x-rapidapi-host": "fear-and-greed-index.p.rapidapi.com",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFearAndGreed(data.fgi.now); // Guardo el valor actual en el estado
        } else {
          console.error("Failed to fetch Fear and Greed Index");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFearAndGreed();
  }, []);

  //renderCryptoList for Top 100 Gainers - Lossers.
  const renderCryptoList = (cryptoList) => {
    return cryptoList.map((crypto) => (
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
    <main className="h-screen m-5 ">
      {/* Top component */}
      <div className="flex flex-row w-full h-1/3 mb-1">
        <div className="flex flex-col w-2/5 h-full mr-1">
          <div className="border-4 rounded-xl h-2/5 mb-1 ">
            <h1>LAB REPORT</h1>
            {/* <p>{formattedDate}</p> */}
          </div>
          <div className="border-4 rounded-xl h-3/5 flex flex-row justify-between">
            <div className="flex flex-col">
              <div>FEAR AND GREED INDEX:</div>
              <div>{fearAndGreed ? fearAndGreed.valueText : "Loading..."}</div>
            </div>
            <div>{fearAndGreed ? `${fearAndGreed.value}/100` : ""}</div>
          </div>
        </div>
        <div className="border-4 rounded-xl w-3/5">
          {" "}
          Este hoy no - 7D Twitter Crypto Discussion
        </div>
      </div>

      {/* Mid component */}
      <MidSection />

      {/* Bot component */}
      <div className="flex flex-row w-full h-1/3">
        <div className="border-4 rounded-xl w-2/5 mr-1 flex flex-row justify-evenly">
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4">Top Gainers</h2>
            {renderCryptoList(topGainers)}
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4">Top Losers</h2>
            {renderCryptoList(topLosers)}
          </div>
        </div>
        <div className="border-4 rounded-xl w-3/5">
          Este hoy no - ETF cash flow
        </div>
      </div>
    </main>
  );
}
