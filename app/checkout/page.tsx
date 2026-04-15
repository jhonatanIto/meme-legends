"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import Image from "next/image";
import Qty from "@/components/Qty";
import { useState } from "react";
import { X } from "lucide-react";

export default function CheckoutPage() {
  const { items, removeItem } = useCartStore();
  const [selectedQty, setSelectedQty] = useState(1);
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (total === 0 || items.length === 0) {
    return (
      <div>
        {" "}
        <h1>Your Cart is Empty</h1>
      </div>
    );
  }
  console.log(items);

  return (
    <div className="container mx-auto px-50 py-8 ">
      <h1 className="text-3xl font-semibold mb-8">
        {" "}
        {items.length} {items.length === 1 ? "ITEM" : "ITEMS"} IN YOUR CART FOR
        ${(total / 100).toFixed(2)}{" "}
      </h1>

      <div className="flex justify-between border-b font-semibold pb-3">
        <h2>ITEM</h2>
        <div className="flex [&>h2]:pr-25 ">
          <h2 className="mr-6">QUANTITY</h2>
          <h2>PRICE</h2>
        </div>
      </div>
      <div className=" mb-8 ">
        <div>
          <ul className="space-y-4">
            {items.map((item, key) => (
              <li key={key} className="flex flex-col gap-2  pb-2">
                <div className="flex justify-between">
                  <div className="flex  items-center">
                    {item.imageUrl && (
                      <Image
                        width={100}
                        height={50}
                        alt={item.name}
                        src={item.imageUrl}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-[20px]">
                        {item.name}
                      </span>
                      <span>
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

          <div className="mt-4  pt-2 text-lg font-semibold text-end border-t">
            Total: ${(total / 100).toFixed(2)}
          </div>
        </div>
      </div>
      <form action={checkoutAction} className="max-w-md mx-auto">
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <Button
          type="submit"
          variant="default"
          className="w-full bg-blue-500 cursor-pointer"
        >
          {" "}
          Proceed to Payment
        </Button>
      </form>
    </div>
  );
}
