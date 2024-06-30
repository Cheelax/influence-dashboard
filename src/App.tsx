import ProductList from "./components/ProcessList";
import React from "react";

// import DataDisplay from "./components/DataDisplay";

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Product and Process Management
      </h1>
      {/* <DataDisplay /> */}
      <ProductList />
    </div>
  );
};

export default App;
