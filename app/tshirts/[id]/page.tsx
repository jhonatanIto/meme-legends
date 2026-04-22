import ProductSelec from "@/components/product-selec";

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <ProductSelec id={Number(id)} type="tshirts" />;
};

export default Product;
