import processes from "../data/process";
import processor from "../data/processor";
import products from "../data/product";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";

// Définition des interfaces
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

const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
    .replace(/^./, (match) => match.toUpperCase());
};

const columnHelper = createColumnHelper<Process>();

const ProductList: React.FC = () => {
  const [processList, setProcessList] = useState<Process[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [processorList, setProcessorList] = useState<Processor[]>([]);

  useEffect(() => {
    try {
      if (processor?.IDS) {
        const processorList = Object.entries(processor.IDS as ProcessorIDS).map(
          ([key, value]) => ({
            name: key,
            id: value,
          })
        );
        setProcessorList(processorList);
        // console.log("Processor List:", processorList);
      } else {
        console.error("Processor data is undefined or null");
      }

      if (processes?.IDS) {
        const processKeys = Object.keys(processes.IDS);
        const processList = processKeys.map((key) => ({
          name: key,
          ...processes.IDS[key],
        }));

        const processTypes = (types: any) => {
          if (types) {
            const typeKeys = Object.keys(types);
            const typeList = typeKeys.map((key) => ({
              id: key,
              ...types[key],
            }));
            return typeList;
          }
          return [];
        };

        const typesList = processTypes(processes.TYPES);
        // console.log("Types List:", typesList);
        setProcessList(typesList);
      } else {
        console.error("Processes data is undefined or null");
      }

      if (products?.IDS) {
        const processProduct = (types: any) => {
          if (types) {
            const typeKeys = Object.keys(types);
            const typeList = typeKeys.map((key) => ({
              id: key,
              ...types[key],
            }));
            return typeList;
          }
          return [];
        };
        const productList = processProduct(products.TYPES);
        setProductList(productList);
        // console.log("Product List:", productList);
      } else {
        console.error("Products data is undefined or null");
      }
    } catch (error) {
      console.error("An error occurred while loading data:", error);
    }
  }, []);

  const getProductName = (id: number) => {
    // console.log("Product List:", productList);
    const product = productList.find((p) => p.i === id);
    return product ? product.name : "Unknown";
  };

  const getProcessorName = (id: number) => {
    console.log("Processor List:", processorList);
    console.log("Processor List:", id);
    const processor = processorList.find((p) => p.id === id);
    return processor ? toCamelCase(processor.name) : "Unknown";
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Process Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("inputs", {
      header: "Input Products",
      cell: (info) => {
        const value = info.getValue();
        let transformedArray;
        if (typeof value === "object" && !Array.isArray(value)) {
          transformedArray = Object.entries(value);
          console.log("Transformed array:", transformedArray);
        }

        return (
          <div>
            {transformedArray.map((input, index) => (
              <div
                key={index}
                className="block border-2 border-black rounded-lg p-2 mb-2 bg-slate-700"
              >
                {`${getProductName(Number(input[0]))}, Cost: ${input[1]}`}
              </div>
            ))}
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("outputs", {
      header: "Output Products",
      cell: (info) => {
        const value = info.getValue();

        let transformedArray;
        if (typeof value === "object" && !Array.isArray(value)) {
          transformedArray = Object.entries(value);
          console.log("Transformed array:", transformedArray);
        }

        return (
          <div>
            {transformedArray.map((output, index) => (
              <div
                key={index}
                className="block border-2 border-black rounded-lg p-2 mb-2 bg-slate-700"
              >
                {`${getProductName(Number(output[0]))}, Cost: ${output[1]}`}
              </div>
            ))}
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("processorType", {
      header: "Processor Type",
      cell: (info) => getProcessorName(Number(info.getValue())),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("cost", {
      header: "Cost",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
  ];

  const table = useReactTable({
    data: processList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4 bg-red">
      <h1 className="text-2xl font-bold mb-4">Processes</h1>
      <table className="min-w-full divide-y divide-gray-200 bg-gray-700">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200 white">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-white"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default ProductList;
