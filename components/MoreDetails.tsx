import { useState } from "react";

const MoreDetails = () => {
  const [moreDetails, setMoreDetails] = useState(false);
  const [sizeFit, setSizeFit] = useState(false);
  const [quality, setQuality] = useState(false);

  const details = [
    {
      title: "MORE DETAILS",
      description: [
        "Made with 100% ring-spun cotton.",
        "Heather colors are 35% ring-spun cotton, 65% polyester",
        "Sport Grey and Antique colors are 90% cotton, 10% polyester",
        "Graphite Heather is 50% ring-spun cotton, 50% polyester",
        "Lightweight fabric (4.5 oz/yd²)",
        "Classic fit with crew neckline.",
        "Tear-away label for added comfort",
        "Made with ethically grown US cotton",
        "Oeko-Tex certified for safety and quality",
      ],
      click: () => setMoreDetails((prev) => !prev),
      show: moreDetails,
    },
    {
      title: "SIZE & FIT",
      description: ["lkasjhdfçlkasjdfçlas"],
      click: () => setSizeFit((prev) => !prev),
      show: sizeFit,
    },
    {
      title: "QUALITY GUARANTEE & RETURNS",
      description: [
        "Quality is guaranteed. If there is a print error or visible quality issue, we'll replace or refund it.",
        "Because the products are made to order, we do not accept general returns or sizing-related returns.",
      ],
      click: () => setQuality((prev) => !prev),
      show: quality,
    },
  ];
  return (
    <div className="mt-10">
      {details.map((d) => (
        <div key={d.title} className="border-b ">
          <div
            className="flex justify-between items-center cursor-pointer pb-7 pt-7  text-center"
            onClick={d.click}
          >
            <div className=" font-bold ">{d.title}</div>
            <div>{d.show ? "-" : "+"}</div>
          </div>

          <ul
            className={`list-disc pl-5 space-y-1  ${d.show && d.title !== "SIZE & FIT" ? "max-h-96 opacity-100 pb-7" : "max-h-0 opacity-0 pointer-events-none"}
             transition-all duration-500`}
          >
            {d.description.map((d, i) => (
              <li className="mb-2" key={i}>
                {d}
              </li>
            ))}
          </ul>

          <div
            className={`list-disc pl-5 space-y-1  ${d.show && d.title === "SIZE & FIT" ? "max-h-96 opacity-100 pb-7" : "max-h-0 opacity-0 pointer-events-none"}
             transition-all duration-500`}
          >
            <a
              className="border-b border-zinc-900 hover:text-zinc-900/70 hover:border-zinc-900/50"
              target="_blank"
              rel="noopener noreferrer"
              href="https://images.printify.com/mockup/69e46a7be1b544748a051db9/38192/110135/arnold-predator.jpg?camera_label=size-chart&t=1776613105554&s=500"
            >
              View size chart
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoreDetails;
