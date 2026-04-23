import Image from "next/image";

import billie from "../images/Billie eilish.png";

const Collection = () => {
  const pictures = [
    {
      url: billie,
    },
    {
      url: billie,
    },
    {
      url: billie,
    },
    {
      url: billie,
    },
    {
      url: billie,
    },
    {
      url: billie,
    },
  ];
  return (
    <div>
      <h1 className="md:text-4xl text-3xl">Shop Collection</h1>

      <div className="grid grid-cols-3 grid-rows-2  gap-5  mt-8 ">
        {pictures.map((p, key) => {
          return (
            <div key={key} className="rounded-4xl overflow-hidden">
              <Image alt="image" width={500} src={p.url} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
