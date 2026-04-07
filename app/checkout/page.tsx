"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center"> Checkout </h1>
      <Card className="max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 border-b pb-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {item.imageUrl && (
                      <Image
                        width={100}
                        height={50}
                        alt={item.name}
                        src={item.imageUrl}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-[18px]">
                      {" "}
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          removeItem(item.id);
                        }}
                      >
                        {" "}
                        -
                      </Button>
                      <span className="text-lg font-semibold">
                        {" "}
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => addItem({ ...item, quantity: 1 })}
                        variant="outline"
                      >
                        {" "}
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4  pt-2 text-lg font-semibold">
            Total: ${(total / 100).toFixed(2)}
          </div>
        </CardContent>
      </Card>
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
