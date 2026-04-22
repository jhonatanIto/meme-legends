"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TextAlignJustify, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50  shadow bg-white text-gray-700 font-semibold ">
      <div className="container mx-auto relative flex items-center justify-between px-4 py-3">
        <Link href={"/"} className=" font-bold text-2xl ">
          MEME-LEGENDS
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-20 ">
          <Link href={"/"} className="hover:text-blue-600">
            Home
          </Link>
          <Link href={"/tshirts"} className="hover:text-blue-600">
            T-shirt
          </Link>
          <Link href={"/sweatshirt"} className="hover:text-blue-600">
            Sweatshirt
          </Link>
          <Link href={"/hoodie"} className="hover:text-blue-600">
            Hoodie
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            className="md:hidden "
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="h-12 w-12  " />
            ) : (
              <TextAlignJustify className="h-12 w-12" />
            )}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex  p-4 space-y-2">
            <Link href={"/"} className="block hover:text-blue-600">
              {" "}
              Home{" "}
            </Link>
            <Link href={"/products"} className="block hover:text-blue-600 ml-5">
              {" "}
              Products{" "}
            </Link>
            <Link href={"/"} className="block hover:text-blue-600 ml-5">
              {" "}
              Checkout{" "}
            </Link>
          </ul>
        </nav>
      )}
    </nav>
  );
};

export default Navbar;
