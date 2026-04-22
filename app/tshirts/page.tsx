import ProductList from "@/components/product-list";
import { getProducts } from "@/lib/get-products";

const page = async () => {
  const products = await getProducts("tshirts");

  return (
    <div className="pb-8">
      <div className=" leading-none tracking-tight text-foreground text-center mb-8 relative">
        <h1 className="text-3xl font-bold">ALL SHIRTS</h1>
      </div>

      <ProductList products={products} type="tshirts"></ProductList>
    </div>
  );
};

export default page;
