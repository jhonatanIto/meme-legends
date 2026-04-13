import Collection from "@/components/Collection";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/get-products";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await getProduct();
  console.log(products);

  const arrivals = products.slice(0, 4);

  return (
    <div>
      <section className="rounded bg-neutral-100 py-8 sm:py-12 relative overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/1c/e7/b8/1ce7b86a624def6642941e8263793c09.jpg"
          alt="Hero image"
          fill
          priority
          className="object-cover object-[100%_40%]"
        />
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2 ">
          <div className="max-w-max space-y-4 ">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl ">
              {" "}
              Welcome to MEME LEGENDS
            </h2>
            <p className="text-neutral-600">
              Discover the latest products at the best prices.
            </p>
            <Button
              asChild
              variant={"default"}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-blue-500  text-white"
            >
              <Link
                href={"/products"}
                className="inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                Browse All products
              </Link>
            </Button>
          </div>
          <Image
            className="rounded"
            alt="Hero image"
            width={450}
            height={450}
            src={products[1].images[0].imageUrl || ""}
          />
        </div>
      </section>
      <section className="mt-8">
        <h1 className="text-4xl">New Arrivals</h1>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((p, key) => {
            return (
              <li key={key}>
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
