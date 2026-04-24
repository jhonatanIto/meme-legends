"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/lib/get-products";
import { useEffect, useMemo, useState } from "react";
import ProductCard, { colorsCode } from "./product-card";
import Qty from "./util/Qty";
import AddedModal from "./AddedModal";
import MoreDetails from "./MoreDetails";
import Spinner from "./util/Spinner";

interface Props {
  product: Product;
  recomendedList: Product[];
  colors: Colors[];
}

interface Colors {
  id: number;
  color: string;
  imageUrl: string;
}

interface Size {
  id: number;
  title: string;
}

export interface DataApi {
  options: { values: Size[]; name: string }[];
  variants: { is_enabled: boolean; title: string; id: number }[];
}

export const ProductDetail = ({ product, recomendedList, colors }: Props) => {
  const { addItem, currentColor } = useCartStore();
  const [colorUrl, setColorUrl] = useState(
    currentColor.url || product.images[0].imageUrl || "",
  );
  const [selectedColor, setSelectedColor] = useState(
    currentColor.colorName || product.images[0].color || "",
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [sizeAlert, setSizeAlert] = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [productData, setProductData] = useState<DataApi>();
  const [loading, setLoading] = useState(false);

  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/printify/${product.printifyProductId}`);
        const data: DataApi = await res.json();

        setProductData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product.printifyProductId]);

  const getColorSize = (title: string) => {
    const [left, right] = title.split("/").map((s) => s.trim());

    const isSize = sizeOrder.includes(left);

    return {
      color: isSize ? right : left,
      size: isSize ? left : right,
    };
  };

  const sizes = useMemo(() => {
    if (!productData || !selectedColor) return [];

    const filteredVariants = productData.variants.filter((v) => {
      if (!v.is_enabled) return false;

      const { color } = getColorSize(v.title);
      return color === selectedColor;
    });

    const availableSizes = filteredVariants.map((v) => {
      const { size } = getColorSize(v.title);
      return size;
    });

    const uniqueSizes = [...new Set(availableSizes)]
      .filter((s) => s !== "5XL")
      .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

    return uniqueSizes.map((size, index) => ({
      id: index,
      title: size,
    }));
  }, [productData, selectedColor]);

  const findVariant = () => {
    if (!productData) return null;

    return productData?.variants.find((v) => {
      if (!v.is_enabled) return false;
      const { color, size } = getColorSize(v.title);

      return color === selectedColor && size === selectedSize;
    })?.id;
  };

  const onAddItem = () => {
    if (!selectedSize) return setSizeAlert(true);

    const variantId = findVariant();
    if (!variantId) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: colorUrl,
      quantity: selectedQty,
      printifyProductId: product.printifyProductId,
      size: selectedSize,
      color: selectedColor,
      type: product.type,
      variantId,
      category: product.category ?? "movies",
    });
  };

  return (
    <div>
      <div className="container mx-auto px-4  flex flex-col md:flex-row gap-8 items-start ">
        {product.images[0] && (
          <div className="relative md:h-230 h-85 w-full md:w-1/2 rounded-lg overflow-hidden  ">
            <Image
              alt={product.name}
              src={colorUrl}
              fill
              className={`object-cover scale-120  md:scale-100`}
            />
          </div>
        )}

        <div className="md:w-1/2 md:pr-30 ">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <h2 className="text-lg font-semibold text-gray-500">
              {product.type === "tshirts"
                ? "T-Shirt"
                : product.type === "sweatshirt"
                  ? "Sweatshirt"
                  : "Hoodie"}
            </h2>
          </div>

          {product.price && (
            <div className="md:text-2xl text-[20px] md:mt-6 mt-2 font-semibold text-red-500">
              ${(product.price / 100).toFixed(2)} USD
              <span className="text-zinc-400 text-[16px] ml-3 line-through">
                {product.type === "tshirts"
                  ? "39.90 USD"
                  : product.type === "sweatshirt"
                    ? "49.90"
                    : "59.90"}{" "}
                USD
              </span>
              <span className=" text-white ml-2 p-1 text-[12px] bg-red-600">
                SAVE{" "}
                {product.type === "tshirts"
                  ? "40%"
                  : product.type === "sweatshirt"
                    ? "30%"
                    : "25%"}
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
            <div className="flex flex-wrap  mt-3 relative min-h-20">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner color="black" />
                </div>
              ) : sizes.length > 0 ? (
                sizes.map((s) => {
                  return (
                    <div
                      style={{
                        borderColor:
                          selectedSize === s.title
                            ? "oklch(62.3% 0.214 259.815)"
                            : "",
                      }}
                      key={s.id}
                      className="pr-3 pl-3 h-fit py-4  min-w-14 flex items-center justify-center font-semibold
                   border-2 rounded-[10px] m-1 cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedSize(s.title)}
                    >
                      {s.title}
                    </div>
                  );
                })
              ) : (
                "out of stock"
              )}
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
              className=" bg-[#3572df] md:p-7 text-[15px] h-10 md:text-[18px] md:w-[80%] w-[70%] md:rounded-4xl 
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
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
