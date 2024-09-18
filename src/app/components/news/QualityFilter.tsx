import React from "react";

interface QualityFilterProps {
  qualities: number[];
  selectedQualities: number[];
  onQualityChange: (quality: number) => void;
}

const QualityFilter: React.FC<QualityFilterProps> = ({
  qualities,
  selectedQualities,
  onQualityChange,
}) => {
  return (
    <div className="mb-6 w-full">
      <h3 className="text-xl font-semibold text-white mb-3">
        Filter by Quality:
      </h3>
      {qualities.map((quality) => (
        <div key={quality} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={`quality-${quality}`}
            checked={selectedQualities.includes(quality)}
            onChange={() => onQualityChange(quality)}
            className="mr-2"
          />
          <label htmlFor={`quality-${quality}`} className="text-white">
            {quality} {quality === 1 ? "Star" : "Stars"}
          </label>
        </div>
      ))}
    </div>
  );
};

export default QualityFilter;
