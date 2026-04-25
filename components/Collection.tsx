import Image from "next/image";

import billie from "../images/Billie eilish.png";
import justin from "../images/justin.png";

const Collection = () => {
  const pictures = [
    {
      url: billie,
    },
    {
      url: justin,
    },
    {
      url: billie,
    },
    {
      url: justin,
    },
    {
      url: billie,
    },
    {
      url: justin,
    },
  ];
  return (
    <div>
      <h1 className="md:text-4xl font-semibold text-3xl text-gray-700">
        Shop Collection
      </h1>

      <div className="grid md:grid-cols-3 grid-cols-2 md:grid-rows-2  md:gap-5 gap-2  mt-8 ">
        {pictures.map((p, key) => {
          return (
            <div
              key={key}
              className=" md:rounded-4xl rounded-2xl overflow-hidden relative w-full md:h-120 h-50"
            >
              <Image
                alt="image"
                src={p.url}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
