"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Product } from "@/lib/get-products";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

interface Props {
  product: Product;
}

export const colorsCode: Record<string, string> = {
  White: "rgb(255, 255, 255)",
  Black: "rgb(0, 0, 0)",
  "Sport Grey": "rgb(152, 152, 152)",
  "Heather Indigo": "rgba(98, 110, 132)",
  "Antique Cherry Red": "rgba(147, 41, 55)",
  "Dark Heather": "rgba(68, 68, 70)",
};

const ProductCard = ({ product }: Props) => {
  const price = product.price;
  const [currentUrl, setCurrentUrl] = useState(product.images[0].imageUrl);
  const [selColor, setSelColor] = useState(product.images[0].color);

  const { setCurrentColor } = useCartStore();

  return (
    <div>
      <Link
        href={`/products/${product.id}`}
        className="block h-fit text-center "
        onClick={() =>
          setCurrentColor({ url: currentUrl, colorName: selColor })
        }
      >
        <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0 ">
          {product.images[0] && (
            <div className="relative h-110 w-full ">
              <Image
                alt={product.name}
                src={currentUrl}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-210 object-cover transition-transform ease-out  duration-300 rounded-t-lg "
              />
            </div>
          )}
        </Card>{" "}
      </Link>

      <CardHeader className="p-4 text-center">
        <CardTitle className="text-[17px]  text-gray-800">
          {product.name}
        </CardTitle>
        <CardContent className=" grow flex flex-col justify-between items-center">
          <p className="text-[17px] text-red-500  w-[62%] flex justify-around ">
            ${(price / 100).toFixed(2)}USD
            <span className="text-zinc-500 line-through">$39.90 USD</span>
          </p>
          <div className="flex mt-3 ">
            {product.images.map((i) => (
              <div
                key={i.id}
                className={`border-2 rounded-full border-blue-400 m-1
              ${selColor === i.color ? "border-blue-400 " : "border-transparent"}`}
              >
                <div
                  style={{
                    backgroundColor: colorsCode[i.color] ?? "#ccc",
                  }}
                  className={`rounded-full w-4.5 h-4.5 border border-zinc-400  m-0.75 cursor-pointer 
                   `}
                  onClick={() => {
                    setCurrentUrl(i.imageUrl);
                    setSelColor(i.color);
                    setCurrentColor({ url: i.imageUrl, colorName: i.color });
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </CardHeader>
    </div>
  );
};

export default ProductCard;
