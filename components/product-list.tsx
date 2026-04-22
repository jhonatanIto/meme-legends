"use client";

import { Product, productType } from "@/lib/get-products";
import ProductCard from "./product-card";
import { useState } from "react";
import CategoryList from "./CategoryList";

interface Props {
  products: Product[];
  type: productType;
}

const ProductList = ({ products, type }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProduct = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLocaleLowerCase().includes(term);

    return nameMatch;
  });

  return (
    <div>
      <div className="flex justify-start relative  ">
        <CategoryList type={type} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="What are you looking for?"
          className=" md:w-full w-[60%] max-w-md rounded border border-gray-300 px-3 py-2 focus:outline-none 
           absolute left-5/7 md:left-1/2 -translate-x-1/2 "
        />
      </div>

      <ul className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
