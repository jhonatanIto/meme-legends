import { checkoutAction } from "@/app/checkout/checkout-action";
import { Product } from "@/lib/get-products";
import { useCartStore } from "@/store/cart-store";
import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Spinner from "./util/Spinner";

interface Props {
  product: {
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    size: string;
    color: string;
  };
  setAddedCart: React.Dispatch<React.SetStateAction<boolean>>;
  addedCart: boolean;
  recomendedList: Product[];
}

const AddedModal = ({
  product,
  addedCart,
  setAddedCart,
  recomendedList,
}: Props) => {
  const { items, setCurrentColor } = useCartStore();
  const boxRef = useRef<HTMLDivElement>(null);
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (boxRef && !boxRef.current?.contains(e.target as Node)) {
        setAddedCart(false);
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => {
      window.removeEventListener("mousedown", closeModal);
    };
  }, []);

  useEffect(() => {
    if (addedCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addedCart]);

  return (
    <div
      className={`${addedCart ? "pointer-events-auto" : "opacity-0 pointer-events-none"} fixed 
      inset-0 flex justify-end items-center bg-zinc-100/80 z-50  transition-all duration-200 ease-in-out`}
    >
      <div
        ref={boxRef}
        className={` h-full w-full md:w-fit text-zinc-800 md:pr-20 md:pl-5 px-3 bg-white  transition-all duration-400 ease-in-out overflow-y-auto
           ${addedCart ? "translate-x-0  pointer-events-auto" : "translate-x-60 md:translate-x-200 opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center mt-15 justify-between ">
          <div className="flex">
            <Check size={30} className="text-4xl" />{" "}
            <p className="ml-1 text-[22px] font-semibold tracking-tight">
              ADDED TO CART
            </p>{" "}
          </div>

          <X
            size={40}
            className="ml-20 text-zinc-600 cursor-pointer"
            onClick={() => setAddedCart(false)}
          />
        </div>

        <div className="flex mt-5 items-center">
          <Image
            width={150}
            height={20}
            src={product.imageUrl}
            alt={product.name}
          />
          <div>
            <div className="text-[20px] font-semibold max-w-40 tracking-tight">
              {product.name} - {product.color} / {product.size}
            </div>
            <div className="text-[18px] mt-1">
              ${(product.price / 100).toFixed(2)}
            </div>
            <div className="mt-1">
              Quantity: <span>{product.quantity}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          Cart Subtotal ({items.length} {items.length > 1 ? "items" : "item"}):{" "}
          <span>USD ${(total / 100).toFixed(2)}</span>
        </div>

        <div className="flex w-full justify-between mt-6  ">
          <Link href={"/checkout"}>
            <button
              className="border-2 border-zinc-800 hover:text-zinc-800/50 hover:border-zinc-800/50
             p-2.5 rounded-3xl pl-10 pr-10 cursor-pointer duration-200 transition-all font-semibold "
            >
              View Cart
            </button>
          </Link>

          <form action={checkoutAction} onSubmit={() => setLoading(true)}>
            <input type="hidden" name="items" value={JSON.stringify(items)} />
            <button
              disabled={loading}
              className="text-white bg-[#3572df] hover:bg-[#3572df]/70 relative
             p-2.5 rounded-3xl pl-10 pr-10 cursor-pointer duration-200 transition-all font-semibold "
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>
                Checkout
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-[22px] font-semibold">YOU MAY ALSO LIKE</div>
        <div>
          {recomendedList.map((r, index) => (
            <div key={index} className="flex mt-5 items-center">
              <Link
                href={`/products/${r.id}`}
                onClick={() => {
                  setCurrentColor({
                    url: r.images[0].imageUrl,
                    colorName: r.images[0].color,
                  });
                }}
              >
                <Image
                  width={150}
                  height={20}
                  src={r.images[0].imageUrl}
                  alt={r.name}
                />
              </Link>

              <div>
                <Link href={`/products/${r.id}`}>
                  <div
                    className="text-[20px] font-semibold cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      setCurrentColor({
                        url: r.images[0].imageUrl,
                        colorName: r.images[0].color,
                      })
                    }
                  >
                    {r.name}
                  </div>
                </Link>

                <div className="text-[18px] mt-1">
                  ${(r.price / 100).toFixed(2)}
                </div>
                <Link href={`/products/${r.id}`}>
                  <button
                    className="text-white bg-[#3572df] p-2 rounded-3xl mt-2 font-semibold
                 pl-4 pr-4 hover:bg-[#3572df]/70 cursor-pointer transition-all duration-200"
                    onClick={() =>
                      setCurrentColor({
                        url: r.images[0].imageUrl,
                        colorName: r.images[0].color,
                      })
                    }
                  >
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddedModal;
