import Image from "next/image";
import instagram from "../images/instagram.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 bg-zinc-800 w-full text-white flex flex-col px-4 md:px-10 lg:px-30">
      {/* Top */}
      <div className="flex flex-col md:flex-row md:justify-between items-center border-b border-blue-300/40 py-10 gap-6 md:gap-0">
        <Link href={"/"}>
          <div className="text-xl md:text-2xl font-semibold">MEME-LEGENDS</div>
        </Link>

        <ul className="flex flex-col md:flex-row items-center gap-4 md:gap-10 text-sm md:text-base">
          <Link href={"/"}>
            <li>Home</li>
          </Link>
          <li>Shop</li>
          <li>Product</li>
          <li>Blog</li>
          <Link href={"/contact/order-placed"}>
            <li>Contact Support</li>
          </Link>
        </ul>
      </div>

      {/* Bottom */}
      <div className="flex flex-col md:flex-row md:justify-between items-center py-6 gap-6 md:gap-0 text-sm md:text-base">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-10 text-center md:text-left">
          <div>Copyright @2026 All rights reserved</div>
          <Link href={"/pages/privacy-policy"}>
            <div>Privacy Policy</div>
          </Link>
          <Link href={"/pages/terms-of-service"}>
            <div>Terms of Service</div>
          </Link>
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <Image alt="Instagram" src={instagram} width={20} height={20} />
          <span className="text-lg md:text-2xl">Instagram</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
