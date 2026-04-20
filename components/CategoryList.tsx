"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const CategoryList = () => {
  const [showOptions, setShowOptions] = useState(false);
  const buttRef = useRef<HTMLDivElement>(null);
  const options = [
    { name: "All", url: "" },
    { name: "MOVIES", url: "category/movies" },
    { name: "CELEBRITIES", url: "category/celebrities" },
    { name: "CATS", url: "category/cats" },
    { name: "DARK HUMOR", url: "category/darkhumor" },
  ];

  useEffect(() => {
    const closeOption = (e: MouseEvent) => {
      if (buttRef && !buttRef.current?.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };

    window.addEventListener("click", closeOption);
    return () => {
      window.removeEventListener("click", closeOption);
    };
  }, []);

  return (
    <div ref={buttRef} className="absolute select-none ">
      <Button
        className="absolute border w-34 cursor-pointer flex justify-center"
        onClick={() => setShowOptions((prev) => !prev)}
      >
        Category <ChevronDown className="ml-2" />
      </Button>
      <ul
        className={`${showOptions ? "flex" : "hidden"} absolute  border flex-col z-20 
 bg-white w-33 top-9 `}
      >
        {options.map((o) => {
          return (
            <Link key={o.name} href={`/products/${o.url}`}>
              {" "}
              <li className="hover:bg-zinc-200 cursor-pointer p-2">{o.name}</li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryList;
