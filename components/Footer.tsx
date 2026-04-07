import Image from "next/image";
import instagram from "../app/products/images/instagram.png";

const Footer = () => {
  return (
    <footer className="mt-20 bg-zinc-800 w-full text-white flex flex-col px-30">
      <div className="flex justify-between border-b border-blue-300/40 py-15">
        <div className="flex">
          <div className="text-2xl font-semibold">MEME-LEGENDS</div>
        </div>
        <ul className="flex space-x-15 [&>li]:cursor-pointer">
          <li>Home</li>
          <li>Shop</li>
          <li>Product</li>
          <li>Blog</li>
          <li>Contact Us</li>
        </ul>
      </div>
      <div className="flex justify-between pb-15 pt-5">
        <div className="flex space-x-15 [&>div]:cursor-pointer">
          <div>Copyright @2026 All rights reserved</div>
          <div>Privacy Policy</div>
          <div>Terms of Use</div>
        </div>
        <div className="flex cursor-pointer">
          <Image alt="Instagram" src={instagram} />
          <span className="ml-4 text-2xl"> Instagram</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
