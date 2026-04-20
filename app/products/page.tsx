import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/product-list";
import { getProduct } from "@/lib/get-products";

const page = async () => {
  const products = await getProduct();

  return (
    <div className="pb-8">
      <div className=" leading-none tracking-tight text-foreground text-center mb-8 relative">
        <h1 className="text-3xl font-bold">ALL SHIRTS</h1>
        <CategoryList />
      </div>

      <ProductList products={products}></ProductList>
    </div>
  );
};

export default page;
