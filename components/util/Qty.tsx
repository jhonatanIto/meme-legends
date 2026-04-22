import { CartItem, useCartStore } from "@/store/cart-store";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  setSelectedQty: React.Dispatch<React.SetStateAction<number>>;
  selectedQty: number;
  product: CartItem | null;
  checkout: boolean;
}

const Qty = ({ setSelectedQty, selectedQty, product, checkout }: Props) => {
  const [showQuantity, setShowQuantity] = useState(false);
  const qty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const qtyRef = useRef<HTMLDivElement>(null);

  const { alterQty } = useCartStore();

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

  return (
    <div ref={qtyRef} className="relative inline-block">
      <button
        className="       border-2 border-zinc-300
        px-2 py-1
        md:px-4 md:py-2
        w-16 md:w-20
        flex items-center justify-between
        rounded-lg
        text-sm md:text-base
        cursor-pointer"
        onClick={() => setShowQuantity((prev) => !prev)}
      >
        {selectedQty} <ChevronDown className="text-zinc-400" />
      </button>
      <div
        style={{ display: showQuantity ? "block" : "none" }}
        className="absolute border border-zinc-400 [&>div]:p-1 [&>div]:hover:bg-blue-500 [&>div]:hover:text-white
            cursor-pointer w-full [&>div]:pl-4.5 [&>div]:bg-white z-20"
      >
        {qty.map((q) => (
          <div
            key={q}
            onClick={() => {
              setSelectedQty(q);
              if (checkout && product) {
                alterQty({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl ?? null,
                  quantity: q,
                  printifyProductId: product.printifyProductId,
                  size: product.size,
                  color: product.color,
                  variantId: product.variantId,
                  category: product.category,
                });
              }

              setShowQuantity(false);
            }}
          >
            {q}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Qty;
