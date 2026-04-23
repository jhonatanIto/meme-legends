const FreeShipping = () => {
  const content = (
    <div className="flex [&>span]:mx-1 px-30">
      ✈️ <span>WORLDWIDE</span> <span>FREE</span> <span>SHIPPING</span>
      <span>ORDERS</span> <span>OVER</span> <span>TWO</span> <span>ITEMS</span>{" "}
      ✈️
    </div>
  );
  return (
    <nav className="w-full bg-black text-white py-3 text-sm font-bold overflow-hidden">
      <div className="flex  animate-marquee w-max">
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
      </div>
    </nav>
  );
};

export default FreeShipping;
