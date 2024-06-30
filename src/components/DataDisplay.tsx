import React, { useState } from "react";
import {
  IDS,
  TYPES,
  CLASSIFICATIONS,
  CATEGORIES,
  getListByCategory,
  getListByClassification,
} from "../data/product"; // assurez-vous d'importer correctement votre fichier de données

const DataDisplay = () => {
  const [filterType, setFilterType] = useState("category"); // 'category' or 'classification'
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const dataList =
    filterType === "category"
      ? getListByCategory(filterValue)
      : getListByClassification(filterValue);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <select
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="category">Category</option>
          <option value="classification">Classification</option>
        </select>
        <select onChange={handleFilterChange} className="border p-2 rounded">
          {filterType === "category" &&
            Object.keys(CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {CATEGORIES[category]}
              </option>
            ))}
          {filterType === "classification" &&
            Object.keys(CLASSIFICATIONS).map((classification) => (
              <option key={classification} value={classification}>
                {CLASSIFICATIONS[classification]}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {dataList.map((item) => (
          <div key={item} className="border p-4 rounded">
            <h3 className="text-lg font-bold">{TYPES[item].name}</h3>
            <p>
              <strong>Mass per unit:</strong> {TYPES[item].massPerUnit} g
            </p>
            <p>
              <strong>Volume per unit:</strong> {TYPES[item].volumePerUnit} mL
            </p>
            <p>
              <strong>Category:</strong> {CATEGORIES[TYPES[item].category]}
            </p>
            <p>
              <strong>Classification:</strong>{" "}
              {CLASSIFICATIONS[TYPES[item].classification]}
            </p>
            <p>
              <strong>Atomic:</strong> {TYPES[item].isAtomic ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataDisplay;
