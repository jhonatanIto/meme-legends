import Collection from "@/components/Collection";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/get-products";
import Image from "next/image";
import banner from "../images/banner.png";

export default async function Home() {
  const products = await getProducts("tshirts");

  const arrivals = products.filter((p) =>
    [13, 23, 20, 22, 14, 16, 25, 12].includes(p.id),
  );

  return (
    <div>
      <section>
        <div
          className="relative grid grid-cols-1 items-center md:h-150 h-60
          px-8 sm:px-1 md:grid-cols-2 "
        >
          <Image
            src={banner}
            alt="Hero image"
            priority
            fill
            className="object-cover  rounded-2xl md:object-[100%_5%]"
          />
        </div>
      </section>
      <section className="mt-8">
        <h1 className="md:text-4xl font-semibold text-3xl text-gray-700">
          Best Sellers
        </h1>

        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((p) => {
            return (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            );
          })}
        </ul>
      </section>
      <section className="mt-8">
        <Collection />
      </section>
    </div>
  );
}
