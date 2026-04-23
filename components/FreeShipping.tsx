const FreeShipping = () => {
  const content = (
    <div className="flex [&>span]:mx-1 px-30">
      ✈️ <span>FREE</span> <span>WORLDWIDE</span> <span>SHIPPING</span>
      <span>ON</span> <span>ORDERS</span> <span>OF</span> <span>3</span>{" "}
      <span>ITEMS</span> <span>OR</span>
      <span>MORE</span> ✈️
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
