import ProductList from "@/components/product-list";
import { type Category, getProducts, productType } from "@/lib/get-products";

interface Props {
  category: Category;
  type: productType;
}

const CategoryPage = async ({ type, category }: Props) => {
  const products = await getProducts(type, category);

  const titles: Record<string, string> = {
    movies: "MOVIES",
    celebrities: "CELEBRITIES",
    cats: "CATS",
    animation: "ANIMATION",
    darkhumor: "DARK HUMOR",
  };

  return (
    <div className="pb-8">
      <div className=" leading-none tracking-tight text-foreground text-center mb-8 relative">
        <h1 className="text-3xl font-bold">{titles[category]}</h1>
      </div>
      <ProductList products={products} type={type}></ProductList>
    </div>
  );
};

export default CategoryPage;
