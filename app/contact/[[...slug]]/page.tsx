import OrderPlaced from "@/components/order-placed";
import SomethingElse from "@/components/something-else";
import Link from "next/link";

type Props = {
  params: Promise<{
    slug?: string[];
  }>;
};

const contact = async ({ params }: Props) => {
  const { slug } = await params;
  const page = slug?.[0];
  console.log(page);

  return (
    <div className="flex  justify-center text-gray-700 fixed inset-0 z-50 bg-zinc-100">
      <div className="flex flex-col items-center mt-7 w-[31%] max-w-150 ">
        <h2 className="font-bold text-2xl">MEME-LEGENDS</h2>
        <div className="mt-10 w-full">
          <h1 className="font-bold text-[30px]">WHAT CAN WE HELP WITH?</h1>
          <div className="mt-7 flex justify-around  ">
            <Link
              href={"/contact/order-placed"}
              className="w-[47%] rounded-4xl"
            >
              <button
                className={`rounded-4xl px-8 py-3.5 border  w-full cursor-pointer hover:text-gray-700 hover:border-gray-700
                ${page === "order-placed" ? "border-2 font-bold border-gray-700 " : "text-zinc-400 border-zinc-400 "}`}
              >
                Order I placed
              </button>
            </Link>
            <Link
              href={"/contact/something-else"}
              className="w-[47%] rounded-4xl"
            >
              <button
                className={`rounded-4xl px-8 py-3.5 border  w-full cursor-pointer hover:text-gray-700 hover:border-gray-700
                ${page === "something-else" ? "border-2 font-bold border-gray-700 " : "text-zinc-400 border-zinc-400 "}`}
              >
                Something else
              </button>
            </Link>
          </div>
          {(page === "order-placed" || page === "") && <OrderPlaced />}
          {page === "something-else" && <SomethingElse />}
        </div>
      </div>
    </div>
  );
};

export default contact;
