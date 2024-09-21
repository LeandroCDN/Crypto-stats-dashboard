"use client";
import React from "react";

interface Sector {
  id: string;
  name: string;
  market_cap_change_24h: number;
  top_3_coins: string[];
}

interface SectorPerformanceDisplayProps {
  sectorPerformanceTop: Sector[];
}

const SectorPerformanceDisplay: React.FC<SectorPerformanceDisplayProps> = ({
  sectorPerformanceTop,
}) => {
  if (!sectorPerformanceTop) return null;

  return (
    <div className="space-y-2">
      {sectorPerformanceTop.map((sector) => (
        <div key={sector.id} className="flex items-center space-x-4 p-2">
          <span className="font-semibold">{sector.name || sector.id}</span>
          <span>{sector.market_cap_change_24h.toFixed(2)}%</span>
          <div className="flex space-x-1">
            {sector.top_3_coins.map((coinUrl, index) => (
              <img
                key={index}
                src={coinUrl}
                alt={`Coin ${index + 1}`}
                className="w-6 h-6"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectorPerformanceDisplay;
