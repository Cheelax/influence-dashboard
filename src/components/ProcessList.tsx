import processes from "../data/process";
import processor from "../data/processor";
import products from "../data/product";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 5000,
    ...props
  }: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
    }, [value]);

    return (
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

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
    const product = productList.find((p) => p.i === id);
    return product ? product.name : "Unknown";
  };

  const getProcessorName = (id: number) => {
    const processor = processorList.find((p) => p.id === id);
    return processor ? toCamelCase(processor.name) : "Unknown";
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Process Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      meta: {
        filterVariant: "text",
      },
    }),
    columnHelper.accessor("inputs", {
      header: "Input Products",

      meta: {
        filterVariant: "text",
      },
      cell: (info) => {
        const value = info.getValue();
        let transformedArray = [];
        if (typeof value === "object" && !Array.isArray(value)) {
          transformedArray = Object.entries(value);
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
      meta: {
        filterVariant: "text",
      },
      cell: (info) => {
        const value = info.getValue();
        let transformedArray = [];
        if (typeof value === "object" && !Array.isArray(value)) {
          transformedArray = Object.entries(value);
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
      meta: {
        filterVariant: "select",
      },
      cell: (info) => getProcessorName(Number(info.getValue())),
      footer: (info) => info.column.id,
    }),
  ];

  const table = useReactTable({
    data: processList,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {};

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = React.useMemo(
      () =>
        filterVariant === "range"
          ? []
          : Array.from(column.getFacetedUniqueValues().keys())
              .sort()
              .slice(0, 5000),
      [column.getFacetedUniqueValues(), filterVariant]
    );

    return filterVariant === "range" ? (
      <div>
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1],
              ])
            }
            placeholder={`Min ${
              column.getFacetedMinMaxValues()?.[0] !== undefined
                ? `(${column.getFacetedMinMaxValues()?.[0]})`
                : ""
            }`}
            className="w-24 border shadow rounded"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
              ])
            }
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ""
            }`}
            className="w-24 border shadow rounded"
          />
        </div>
        <div className="h-1" />
      </div>
    ) : filterVariant === "select" ? (
      <select
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}
      >
        <option value="">All</option>
        {sortedUniqueValues.map((value) => (
          //dynamically generated select options from faceted values feature
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    ) : (
      <>
        {/* Autocomplete suggestions from faceted values feature */}
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-36 border shadow rounded"
          list={column.id + "list"}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="h-1" />
      </>
    );
  }

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
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
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
