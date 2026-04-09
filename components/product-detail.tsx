"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/lib/get-products";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "./product-card";

interface Props {
  product: Product;
  recomendedList: Product[];
}

interface Size {
  id: number;
  title: string;
}

interface DataApi {
  options: { values: Size[] }[];
  variants: { is_enabled: boolean; title: string }[];
}

export const ProductDetail = ({ product, recomendedList }: Props) => {
  const { items, addItem } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [showQuantity, setShowQuantity] = useState(false);
  const qtyRef = useRef<HTMLDivElement>(null);
  const qty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  console.log(items);

  const colorsCode: Record<string, string> = {
    White: "#ffffff",
    Black: "#000000",
    Red: "#C62A32",
    Sky: "#8BCDEA",
  };

  useEffect(() => {
    const closeQty = (e: MouseEvent) => {
      if (qtyRef.current && !qtyRef.current.contains(e.target as Node)) {
        setShowQuantity(false);
      }
    };

    window.addEventListener("mousedown", closeQty);

    return () => {
      window.removeEventListener("mousedown", closeQty);
    };
  }, []);

  useEffect(() => {
    const productData = async () => {
      const res = await fetch(`/api/printify/${product.printifyProductId}`);
      const data: DataApi = await res.json();
      setSizes(data.options[1].values);

      const enabledVariants = data.variants.filter((v) => v.is_enabled) ?? [];

      const uniqueColors = [
        ...new Set(enabledVariants.map((v) => v.title.split("/")[0].trim())),
      ];

      setColors(uniqueColors);
    };

    productData();
  }, []);

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? null,
      quantity: selectedQty,
      printifyProductId: product.printifyProductId,
      size: selectedSize,
    });
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center ">
        {product.imageUrl && (
          <div className="relative h-150 w-full md:w-1/2 rounded-lg overflow-hidden ">
            <Image
              alt={product.name}
              src={product.imageUrl}
              layout="fill"
              objectFit="cover"
              className="transition duration-300 "
            />
          </div>
        )}

        <div className="md:w-1/2  ">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          {product.description && (
            <p className="text-gray-700 mb-4">{product.description}</p>
          )}
          {product.price && (
            <p className="text-lg font-semibold text-gray-900">
              ${(product.price / 100).toFixed(2)} USD
            </p>
          )}
          <div>
            <div>
              Select color:{" "}
              <span className="font-semibold">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap max-w-120">
              {colors.map((c) => {
                return (
                  <div
                    style={{ background: colorsCode[c] }}
                    className={` border m-1.5 border-zinc-300 cursor-pointer p-4.5 
                   ${selectedColor === c ? "rounded-3xl border-blue-500" : "rounded-xl"}`}
                    key={c}
                    onClick={() => setSelectedColor(c)}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <div>Select size</div>
            <div className="flex flex-wrap  ">
              {sizes.map((s) => {
                return (
                  <div
                    key={s.id}
                    className="pr-5 pl-5 p-3 min-w-14 flex items-center justify-center
                   border-2 rounded-[10px] m-1 cursor-pointer"
                    onClick={() => setSelectedSize(s.title)}
                  >
                    {s.title}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex  items-center mt-5">
            <div ref={qtyRef} className="relative">
              <button
                className="border-2 p-3 pl-3 pr-3 w-20 h-fit flex justify-around rounded-xl 
          cursor-pointer"
                onClick={() => setShowQuantity((prev) => !prev)}
              >
                {selectedQty} <ChevronDown className="text-zinc-400" />
              </button>
              <div
                style={{ display: showQuantity ? "block" : "none" }}
                className="absolute border [&>div]:p-1 [&>div]:hover:bg-blue-500 [&>div]:hover:text-white
            cursor-pointer w-full [&>div]:pl-4.5 [&>div]:bg-white"
              >
                {qty.map((q) => (
                  <div
                    key={q}
                    onClick={() => {
                      setSelectedQty(q);
                      setShowQuantity(false);
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <Button
              className=" bg-blue-500 p-6 text-[15px] h-10 md:text-[18px] md:w-100 md:rounded-4xl 
             min-w-30 cursor-pointer hover:bg-blue-500/80 ml-2 "
              onClick={() => {
                onAddItem();
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold mt-5">YOU MAY ALSO LIKE</h1>
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recomendedList.map((r) => (
            <li key={r.id}>
              <ProductCard product={r} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
