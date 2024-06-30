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
  input: number[];
  output: number[];
  cost: number;
}

const ProductList: React.FC = () => {
  const [processList, setProcessList] = useState<Process[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    try {
      if (processes && processes.IDS) {
        // const processList = Object.keys(processes).map((key) => ({
        //   id: processes[key].id,
        //   name: processes[key].name,
        // }));
        const processValues = Object.values(processes);
        // console.log("Loaded processes:", processes);
        const processKeys = Object.keys(processes.IDS);

        // const processList = Object.values(processes.IDS) as any[];

        // setProcessList(processList);

        const processList = processKeys.map((key) => {
          return {
            name: key,
            ...processes.IDS[key],
          };
        });
        console.log("Process Keys:", processList);

        setProcessList(processList);
        // setProcessList(processes.IDS as any[]);
        // if (Array.isArray(processValues)) {
        //   setProcessList(processValues as any[]);
        //   console.log("Loaded processes:", processValues);
        // } else {
        //   console.error("Processes data is not an array:", processes);
        // }
      } else {
        console.error("Processes data is undefined or null");
      }

      if (products && products.IDS) {
        const productValues = Object.values(products.IDS);
        if (Array.isArray(productValues)) {
          setProductList(productValues as any[]);
          // console.log("Loaded products:", productValues);
        } else {
          console.error("Products data is not an array:", products);
        }
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
            processList.map(
              (process) => (
                console.log(`Process ${process} input:`, process.input),
                (
                  <tr key={process.i} className="bg-gray-100">
                    <td className="py-2 px-4 border">{process.name}</td>
                    <td className="py-2 px-4 border">
                      {/* {process.input.map((inputId) => {
                        const inputName = getProductName(inputId);
                        console.log(
                          `Process ${process.name} input:`,
                          inputName
                        );
                        return (
                          <span key={inputId} className="block">
                            {inputName}
                          </span>
                        );
                      })} */}
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
                )
              )
            )
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
