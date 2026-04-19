"use client";

import { useCartStore } from "@/store/cart-store";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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

  const getProducts = async () => {
    const res = await fetch("/api/printify");
    const data = await res.json();
    console.log(data.data);
  };

  return (
    <nav className="sticky top-0 z-50  shadow bg-white text-gray-700 font-semibold ">
      <div className="container mx-auto relative flex items-center justify-between px-4 py-3">
        <Link href={"/"} className=" font-bold text-2xl " onClick={getProducts}>
          MEME-LEGENDS
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-20 ">
          <Link href={"/"} className="hover:text-blue-600">
            Home
          </Link>
          <Link href={"/products"} className="hover:text-blue-600">
            Products
          </Link>
          <Link href={"/checkout"} className="hover:text-blue-600">
            Checkout
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
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link href={"/"} className="block hover:text-blue-600">
                {" "}
                Home{" "}
              </Link>
              <Link href={"/products"} className="block hover:text-blue-600">
                {" "}
                Products{" "}
              </Link>
              <Link href={"/"} className="block hover:text-blue-600">
                {" "}
                Checkout{" "}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </nav>
  );
};

export default Navbar;
