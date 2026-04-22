"use client";

import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import Image from "next/image";
import Qty from "@/components/util/Qty";
import { useState } from "react";
import { X } from "lucide-react";
import Spinner from "@/components/util/Spinner";

export default function CheckoutPage() {
  const { items, removeItem } = useCartStore();
  const [selectedQty, setSelectedQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (total === 0 || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        {" "}
        <h1 className="text-lg font-semibold">Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-50 py-8 ">
      <h1 className="md:text-3xl text-xl font-semibold mb-8">
        {" "}
        {items.length} {items.length === 1 ? "ITEM" : "ITEMS"} IN YOUR CART FOR
        ${(total / 100).toFixed(2)}{" "}
      </h1>

      <div className="md:flex hidden justify-between border-b font-semibold pb-3">
        <h2>ITEM</h2>
        <div className="flex [&>h2]:pr-25 ">
          <h2 className="mr-6">QUANTITY</h2>
          <h2>PRICE</h2>
        </div>
      </div>

      <ul className="space-y-4 ">
        {items.map((item, key) => (
          <li key={key} className="flex flex-col gap-2  pb-2">
            <div className="flex flex-col md:justify-between md:flex-row gap-4">
              <div className="flex  items-center gap-4">
                {item.imageUrl && (
                  <Image
                    width={100}
                    height={100}
                    alt={item.name}
                    src={item.imageUrl}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-base md:text-[20px]">
                    {item.name}
                  </span>
                  <span className=" text-gray-500">
                    {item.color}, {item.size}
                  </span>
                </div>
              </div>
              <div className="flex  items-center">
                <div className="pr-20 mr-6">
                  <Qty
                    selectedQty={item.quantity}
                    setSelectedQty={setSelectedQty}
                    product={item}
                    checkout={true}
                  />
                </div>

                <span className=" text-[18px] pr-17">
                  {" "}
                  ${(item.price / 100).toFixed(2)}
                </span>
                <X
                  onClick={() => {
                    removeItem(item);
                  }}
                  className="text-zinc-400 cursor-pointer hover:text-zinc-700 transition-all duration-200"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4  pt-2 text-lg font-semibold text-end border-t ">
        Total: ${(total / 100).toFixed(2)}
      </div>

      <form
        action={checkoutAction}
        onSubmit={() => setLoading(true)}
        className="max-w-md mx-auto mt-8"
      >
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <button
          type="submit"
          className="w-full flex items-center justify-center h-12  font-semibold
         text-white bg-[#3572df] rounded-4xl mt-5 cursor-pointer"
        >
          {loading ? <Spinner /> : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}
