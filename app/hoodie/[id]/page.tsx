import ProductSelec from "@/components/product-selec";

const Sweatshirt = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <ProductSelec id={Number(id)} type="hoodie" />;
};

export default Sweatshirt;
