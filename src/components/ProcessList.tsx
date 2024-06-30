import processes from "../data/process";
import processor from "../data/processor";
import products from "../data/product";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import React, { useState, useEffect } from "react";

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
  processorType: string;
  outputs: number[];
  cost: number;
}

interface Processor {
  name: string;
  id: number;
}

type ProcessesIDS = {
  [key: string]: number;
};

type ProductsIDS = {
  [key: string]: Product;
};

type ProcessorIDS = {
  [key: string]: number;
};

const ProductList: React.FC = () => {
  const [processList, setProcessList] = useState<Process[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [processorList, setProcessorList] = useState<Processor[]>([]);

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
      .replace(/^./, (match) => match.toUpperCase());
  };

  useEffect(() => {
    try {
      // Load processor data
      if (processor?.IDS) {
        const processorList = Object.entries(processor.IDS as ProcessorIDS).map(
          ([key, value]) => ({
            name: key,
            id: value,
          })
        );
        setProcessorList(processorList);
        console.log("Processor List:", processorList);
      } else {
        console.error("Processor data is undefined or null");
      }

      // Load process data
      if (processes?.IDS) {
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

      // Load product data
      if (products?.IDS) {
        const processProduct = (types: any) => {
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
        const productList = processProduct(products.TYPES);
        setProductList(productList);
        console.log("Product List:", productList);
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

  const getProcessorName = (id: number) => {
    const processor = processorList.find((p) => p.id === id);
    return processor ? toCamelCase(processor.name) : "Unknown";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Processes</h1>

      <Table>
        <TableCaption>A list of processes and their details</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeader>Process Name</TableHeader>
            <TableHeader>Input Products</TableHeader>
            <TableHeader>Output Products</TableHeader>
            <TableHeader>Processor Type</TableHeader>
            <TableHeader>Cost</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {processList.length > 0 ? (
            processList.map((process) => (
              <TableRow key={process.i}>
                <TableCell>{process.name}</TableCell>
                <TableCell>
                  {process.inputs &&
                    Object.entries(process.inputs).map(([key, value]) => (
                      <span key={key} className="block">
                        {`Product ID: ${getProductName(
                          Number(key)
                        )}, Cost: ${value}`}
                      </span>
                    ))}
                </TableCell>
                <TableCell>
                  {process.outputs &&
                    Object.entries(process.outputs).map(([key, value]) => (
                      <span key={key} className="block">
                        {`Product ID: ${getProductName(
                          Number(key)
                        )}, Cost: ${value}`}
                      </span>
                    ))}
                </TableCell>
                <TableCell>
                  {getProcessorName(Number(process.processorType))}
                </TableCell>
                <TableCell>{process.cost}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No processes available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
