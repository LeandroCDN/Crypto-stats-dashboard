import React from "react";

const BtcEtfFlowBar = ({ data }: any) => {
  // Filtrar y procesar los datos
  const etfData = Object.entries(data)
    .filter(([key, value]) => {
      const val = value as { usd: number };
      return key !== "date" && key !== "total" && val.usd !== 0;
    })
    .map(([key, value]) => {
      const val = value as { usd: number };
      return { ticker: key, usd: val.usd };
    });

  const totalUsd = data.total.usd;

  // Ordenar los ETFs de mayor a menor valor absoluto
  etfData.sort((a, b) => Math.abs(b.usd) - Math.abs(a.usd));

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="h-10 flex">
        {etfData.map(({ ticker, usd }) => {
          const percentage = (usd / totalUsd) * 100;
          const isPositive = usd > 0;
          const width = `${Math.abs(percentage)}%`;
          const color = isPositive
            ? `hsl(120, ${Math.abs(percentage)}%, 50%)`
            : `hsl(0, ${Math.abs(percentage)}%, 50%)`;

          return (
            <div
              key={ticker}
              className="h-full"
              style={{ width, backgroundColor: color }}
              title={`${ticker}: $${usd.toLocaleString()}`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default BtcEtfFlowBar;
