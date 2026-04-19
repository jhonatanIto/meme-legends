"use client";

import { Product } from "@/lib/get-products";
import ProductCard from "./product-card";
import { useState } from "react";

interface Props {
  products: Product[];
}

const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProduct = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLocaleLowerCase().includes(term);

    return nameMatch;
  });

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search products..."
          className="w-full max-w-md rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProduct.map((p) => {
          return (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductList;
