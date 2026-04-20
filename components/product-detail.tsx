"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/lib/get-products";
import { useEffect, useState } from "react";
import ProductCard, { colorsCode } from "./product-card";
import Qty from "./Qty";
import AddedModal from "./AddedModal";
import MoreDetails from "./MoreDetails";

interface Props {
  product: Product;
  recomendedList: Product[];
  colors: { id: number; color: string; imageUrl: string }[];
}

interface Size {
  id: number;
  title: string;
}

export interface DataApi {
  options: { values: Size[] }[];
  variants: { is_enabled: boolean; title: string; id: number }[];
}

export const ProductDetail = ({ product, recomendedList, colors }: Props) => {
  const { items, addItem, currentColor } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const [colorUrl, setColorUrl] = useState(
    currentColor.url || product.images[0].imageUrl || "",
  );
  const [selectedColor, setSelectedColor] = useState(
    currentColor.colorName || product.images[0].color || "",
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
  const [productData, setProductData] = useState<DataApi>();

  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/printify/${product.printifyProductId}`);
      const data: DataApi = await res.json();

      const filteredSizes = (
        data.options[1].values || data.options[0]?.values
      ).filter((s) => s.title !== "5XL");

      setSizes(filteredSizes);

      setProductData(data);

      const enabledVariants = data.variants.filter((v) => v.is_enabled) ?? [];

      const uniqueColors = [
        ...new Set(enabledVariants.map((v) => v.title.split("/")[0].trim())),
      ];

      setEnabledColor(uniqueColors);
    };

    fetchProduct();
  }, [product.printifyProductId]);

  useEffect(() => {
    if (!productData || !selectedColor) return;

    const filteredVariants = productData.variants.filter(
      (v) => v.is_enabled && v.title.split("/")[0].trim() === selectedColor,
    );

    const availableSizes = filteredVariants.map((v) =>
      v.title.split("/")[1].trim(),
    );

    const uniqueSizes = [...new Set(availableSizes)]
      .filter((s) => s !== "5XL")
      .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

    setSizes(
      uniqueSizes.map((size, index) => ({
        id: index,
        title: size,
      })),
    );

    setSelectedSize("");
    setSizeAlert(false);
  }, [selectedColor, productData]);

  const findVariant = () => {
    if (!productData) return null;

    const va = productData?.variants.find(
      (v) =>
        v.is_enabled &&
        v.title.trim() === `${selectedColor} / ${selectedSize}`.trim(),
    );

    if (!va) {
      console.error("Variant not found", {
        selectedColor,
        selectedSize,
      });
      return null;
    }

    return va.id;
  };

  const onAddItem = () => {
    if (!selectedSize) return setSizeAlert(true);

    const variantId = findVariant();
    if (!variantId) return;

    console.log(variantId);

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: colorUrl,
      quantity: selectedQty,
      printifyProductId: product.printifyProductId,
      size: selectedSize,
      color: selectedColor,
      variantId,
      category: product.category ?? "movies",
    });
  };

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start ">
        {product.images[0] && (
          <div className="relative h-230 w-full md:w-1/2 rounded-lg overflow-hidden ">
            <Image
              alt={product.name}
              src={colorUrl}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="md:w-1/2 pr-30 ">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          {product.price && (
            <div className="text-2xl mt-6 font-semibold text-red-500">
              ${(product.price / 100).toFixed(2)} USD
              <span className="text-zinc-400 text-[16px] ml-3 line-through">
                39.90 USD
              </span>
              <span className=" text-white ml-3 p-1 text-[12px] bg-red-600">
                SAVE 40%
              </span>
            </div>
          )}
          <div className="mt-8">
            <div>
              Select color:{" "}
              <span className="font-semibold">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap max-w-120 mt-3">
              {colors.map((c) => {
                return (
                  <div
                    style={{ background: colorsCode[c.color] }}
                    className={`m-1.5  cursor-pointer p-4.5 border
                   ${selectedColor === c.color ? "rounded-3xl border-blue-500 border-2" : "rounded-2xl border-zinc-300"}`}
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
          <div className="mt-5">
            <div>
              Select size{" "}
              <a
                className="font-semibold border-b border-zinc-900"
                target="_blank"
                rel="noopener noreferrer"
                href="https://images.printify.com/mockup/69e46a7be1b544748a051db9/38192/110135/arnold-predator.jpg?camera_label=size-chart&t=1776614309661&s=500"
              >
                Size guide
              </a>
            </div>
            <div className="flex flex-wrap  mt-3">
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
                    className="pr-5 pl-5 p-3 min-w-14 flex items-center justify-center font-semibold
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

          <div className="flex  items-center mt-10">
            <Qty
              product={null}
              selectedQty={selectedQty}
              setSelectedQty={setSelectedQty}
              checkout={false}
            />
            <Button
              className=" bg-[#3572df] p-7 text-[15px] h-10 md:text-[18px] md:w-[80%] md:rounded-4xl 
             min-w-30 cursor-pointer hover:bg-[#3572df]/80 ml-2 "
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
          <MoreDetails />
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
