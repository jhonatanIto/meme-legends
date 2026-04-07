import { ArrowRight } from "lucide-react";
import shirt from "../app/products/images/shirt2-removebg-preview.png";
import cup from "../app/products/images/cup-removebg-preview.png";
import phoneCase from "../app/products/images/case-removebg-preview.png";

import Image from "next/image";
import Link from "next/link";

const Collection = () => {
  return (
    <div>
      <h1 className="text-4xl">Shop Collection</h1>

      <div className="grid grid-cols-2 grid-rows-2  gap-4 h-150 mt-8 ">
        <div className="col-span-1 row-span-2 bg-gray-200 flex justify-center">
          <div className="flex items-center ">
            <Image alt="Shirt" src={shirt} />
            <div className=" mt-60">
              <div className="text-4xl font-bold ">T-shirts</div>
              <Link href={"/products/category/tshirt"}>
                <div className="border-b w-fit border-black flex font-semibold mt-3 cursor-pointer">
                  Collections <ArrowRight className="ml-3" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 flex justify-center">
          <div className="flex items-center ">
            <div>
              <div className="text-4xl font-bold">Mugs</div>

              <Link href={"/products/category/mug"}>
                <div className="border-b w-fit flex font-semibold mt-3 cursor-pointer ">
                  Collections <ArrowRight className="ml-3" />
                </div>
              </Link>
            </div>
            <Image height={350} alt="Shirt" src={cup} />
          </div>
        </div>
        <div className="bg-gray-200 flex justify-center">
          <div className="flex items-center ">
            <div>
              <div className="text-4xl font-bold">Phone Cases</div>
              <Link href={"/products/category/phonecase"}>
                <div className="border-b w-fit border-black flex font-semibold mt-3 cursor-pointer">
                  Collections <ArrowRight className="ml-3" />
                </div>
              </Link>
            </div>
            <Image height={350} alt="Shirt" src={phoneCase} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
