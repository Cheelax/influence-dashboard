import React, { useState, useEffect } from "react";
import processes from "../data/process";
import products from "../data/product";

interface Product {
  i: number;
  name: string;
  classification: string;
  category: string;
  massPerUnit: number;
  volumePerUnit: number;
  isAtomic: boolean;
}

interface Process {
  i: number;
  name: string;
  inputs: number[];
  outputs: number[];
  cost: number;
}

const ProductList: React.FC = () => {
  const [processList, setProcessList] = useState<Process[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    try {
      if (processes && processes.IDS) {
        const processKeys = Object.keys(processes.IDS);
        const processList = processKeys.map((key) => {
          return {
            name: key,
            ...processes.IDS[key],
          };
        });

        const processTypes = (types: any) => {
          if (types) {
            const typeKeys = Object.keys(types);
            const typeList = typeKeys.map((key) => {
              return {
                id: key,
                ...types[key],
              };
            });
            return typeList;
          }
          return [];
        };

        // Use the function to set the type list
        const typesList = processTypes(processes.TYPES);
        console.log("Types List:", typesList);

        setProcessList(typesList);
      } else {
        console.error("Processes data is undefined or null");
      }

      if (products && products.IDS) {
        const productTypes = (types: any) => {
          if (types) {
            const typeKeys = Object.keys(types);
            const typeList = typeKeys.map((key) => {
              return {
                id: key,
                ...types[key],
              };
            });
            return typeList;
          }
          return [];
        };

        const typesList = productTypes(products.TYPES);
        setProductList(typesList);
      } else {
        console.error("Products data is undefined or null");
      }
    } catch (error) {
      console.error("An error occurred while loading data:", error);
    }
  }, []);

  const getProductName = (id: number) => {
    const product = productList.find((p) => p.i === id);
    return product ? product.name : "Unknown";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Processes</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Process Name</th>
            <th className="py-2">Input Products</th>
            <th className="py-2">Output Products</th>
            <th className="py-2">Cost</th>
          </tr>
        </thead>
        <tbody>
          {processList.length > 0 ? (
            processList.map((process) => (
              <tr key={process.i} className="bg-gray-100">
                <td className="py-2 px-4 border">{process.name}</td>
                <td className="py-2 px-4 border">
                  {process.inputs &&
                    Object.entries(process.inputs).map(([key, value]) => (
                      <span key={key} className="block">
                        {`Product ID: ${key}, Cost: ${value}`}
                      </span>
                    ))}
                </td>
                <td className="py-2 px-4 border">
                  {/* {process.output.map((outputId) => {
                        const outputName = getProductName(outputId);
                        console.log(
                          `Process ${process.name} output:`,
                          outputName
                        );
                        return (
                          <span key={outputId} className="block">
                            {outputName}
                          </span>
                        );
                      })} */}
                </td>
                <td className="py-2 px-4 border">{process.cost}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-2 px-4 border">
                No processes available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
