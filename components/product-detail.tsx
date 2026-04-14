"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/lib/get-products";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import Qty from "./Qty";
import AddedModal from "./AddedModal";

interface Props {
  product: Product;
  recomendedList: Product[];
  colors: { id: number; color: string; imageUrl: string }[];
}

interface Size {
  id: number;
  title: string;
}

interface DataApi {
  options: { values: Size[] }[];
  variants: { is_enabled: boolean; title: string }[];
}

export const ProductDetail = ({ product, recomendedList, colors }: Props) => {
  const { items, addItem, currentColor } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const [colorUrl, setColorUrl] = useState(
    currentColor.url || product.images[0].imageUrl,
  );
  const [selectedColor, setSelectedColor] = useState(
    currentColor.colorName || product.images[0].color,
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [enabledColor, setEnabledColor] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Size[]>([
    { id: 14, title: "S" },

    { id: 15, title: "M" },

    { id: 16, title: "L" },

    { id: 17, title: "XL" },

    { id: 18, title: "2XL" },

    { id: 19, title: "3XL" },
    { id: 20, title: "4XL" },

    { id: 21, title: "5XL" },
  ]);
  const [sizeAlert, setSizeAlert] = useState(false);

  const [addedCart, setAddedCart] = useState(false);

  const colorsCode: Record<string, string> = {
    White: "#ffffff",
    Black: "#000000",
    Red: "#C62A32",
    Sky: "#8BCDEA",
  };

  useEffect(() => {
    const productData = async () => {
      const res = await fetch(`/api/printify/${product.printifyProductId}`);
      const data: DataApi = await res.json();

      setSizes(data.options[1]?.values || data.options[0]?.values);

      console.log(data);

      const enabledVariants = data.variants.filter((v) => v.is_enabled) ?? [];

      const uniqueColors = [
        ...new Set(enabledVariants.map((v) => v.title.split("/")[0].trim())),
      ];

      setEnabledColor(uniqueColors);
    };

    productData();
  }, []);

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: colorUrl,
      quantity: selectedQty,
      printifyProductId: product.printifyProductId,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center ">
        {product.images[0] && (
          <div className="relative h-150 w-full md:w-1/2 rounded-lg overflow-hidden ">
            <Image
              alt={product.name}
              src={colorUrl}
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
                    style={{ background: colorsCode[c.color] }}
                    className={`  m-1.5  cursor-pointer p-4.5 border
                   ${selectedColor === c.color ? "rounded-3xl border-blue-500 border-2" : "rounded-xl border-zinc-300"}`}
                    key={c.color}
                    onClick={() => {
                      setSelectedColor(c.color);
                      setColorUrl(c.imageUrl);
                    }}
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
                    style={{
                      borderColor:
                        selectedSize === s.title
                          ? "oklch(62.3% 0.214 259.815)"
                          : "",
                    }}
                    key={s.id}
                    className="pr-5 pl-5 p-3 min-w-14 flex items-center justify-center
                   border-2 rounded-[10px] m-1 cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedSize(s.title)}
                  >
                    {s.title}
                  </div>
                );
              })}
            </div>
            {sizeAlert && !selectedSize && (
              <div className="text-red-600 mt-3">Please select a size</div>
            )}
          </div>

          <div className="flex  items-center mt-5">
            <Qty
              product={null}
              selectedQty={selectedQty}
              setSelectedQty={setSelectedQty}
              checkout={false}
            />
            <Button
              className=" bg-blue-500 p-7 text-[15px] h-10 md:text-[18px] md:w-100 md:rounded-4xl 
             min-w-30 cursor-pointer hover:bg-blue-500/80 ml-2 "
              onClick={() => {
                if (!selectedColor || !selectedSize) {
                  return setSizeAlert(true);
                }
                onAddItem();
                setAddedCart(true);
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
      <AddedModal
        product={{
          name: product.name,
          price: product.price,
          imageUrl: colorUrl,
          quantity: selectedQty,
          size: selectedSize,
          color: selectedColor,
        }}
        addedCart={addedCart}
        setAddedCart={setAddedCart}
        recomendedList={recomendedList}
      />
    </div>
  );
};
