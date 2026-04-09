"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { Product } from "@/lib/get-products";

interface Props {
  product: Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? null,
      quantity: 1,
      printifyProductId: product.printifyProductId,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
      {product.imageUrl && (
        <div className="relative h-150 w-full md:w-1/2 rounded-lg overflow-hidden">
          <Image
            alt={product.name}
            src={product.imageUrl}
            layout="fill"
            objectFit="cover"
            className="transition duration-300 "
          />
        </div>
      )}

      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        {product.description && (
          <p className="text-gray-700 mb-4">{product.description}</p>
        )}
        {product.price && (
          <p className="text-lg font-semibold text-gray-900">
            ${(product.price / 100).toFixed(2)}
          </p>
        )}

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              removeItem(product.id);
            }}
          >
            {" "}
            -
          </Button>
          <span className="text-lg font-semibold"> {quantity}</span>
          <Button onClick={onAddItem} variant="outline">
            {" "}
            +
          </Button>
        </div>
        <Link href={`${quantity > 0 ? "/checkout" : ""}`}>
          <Button
            className="mt-5 bg-blue-500 cursor-pointe min-w-30 cursor-pointer"
            onClick={() => {
              if (quantity === 0) {
                onAddItem();
              }
            }}
          >
            {quantity > 0 ? "Proceed to Checkout" : "Add to Cart"}
          </Button>
        </Link>
      </div>
    </div>
  );
};
