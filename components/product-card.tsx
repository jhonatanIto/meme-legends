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
  const maxMobileColors = 3;
  const remainingColors = product.images.length - maxMobileColors;

  return (
    <div>
      <Link
        href={`/${product.type}/${product.id}`}
        className="block h-fit text-center "
        onClick={() =>
          setCurrentColor({ url: currentUrl, colorName: selColor })
        }
      >
        <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0 ">
          {product.images[0] && (
            <div className="relative aspect-square md:h-110 w-full ">
              <Image
                alt={product.name}
                src={currentUrl}
                fill
                objectFit="cover"
                className="md:group-hover:scale-220 group-hover:scale-180 scale-120 md:scale-110 object-cover transition-transform ease-out  duration-300 rounded-t-lg "
              />
            </div>
          )}
        </Card>{" "}
      </Link>

      <CardHeader className="p-4 text-center">
        <CardTitle className="text-sm md:text-[17px] text-gray-800 line-clamp-2">
          {product.name}
        </CardTitle>
        <CardContent className=" grow flex flex-col justify-between items-center">
          <p className="text-sm md:text-[15px] text-red-500 flex flex-col md:flex-row items-center gap-1">
            ${(price / 100).toFixed(2)}USD
            <span className="text-zinc-500 line-through text-xs md:text-sm">
              $39.90 USD
            </span>
          </p>
          <div className="flex mt-2 md:mt-3 flex-wrap justify-center">
            <div className="hidden md:flex flex-wrap justify-center">
              {product.images.map((i) => (
                <div
                  key={i.id}
                  className={`border-2 rounded-full border-blue-400  p-1
              ${selColor === i.color ? "border-blue-400 " : "border-transparent"}`}
                >
                  <div
                    style={{
                      backgroundColor: colorsCode[i.color] ?? "#ccc",
                    }}
                    className={`rounded-full w-4.5 h-4.5 border border-zinc-400 cursor-pointer 
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

            <div className="md:hidden flex items-center">
              {product.images.slice(0, maxMobileColors).map((i) => (
                <div
                  key={i.id}
                  className={`border-2 rounded-full p-1 ${
                    selColor === i.color
                      ? "border-blue-400"
                      : "border-transparent"
                  }`}
                >
                  <div
                    style={{ backgroundColor: colorsCode[i.color] ?? "#ccc" }}
                    className="rounded-full w-3.5 h-3.5 border border-zinc-400 cursor-pointer"
                    onClick={() => {
                      setCurrentUrl(i.imageUrl);
                      setSelColor(i.color);
                      setCurrentColor({ url: i.imageUrl, colorName: i.color });
                    }}
                  />
                </div>
              ))}
              {remainingColors > 0 && (
                <div className="ml-1 text-xs text-zinc-500">
                  +{remainingColors}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </div>
  );
};

export default ProductCard;
