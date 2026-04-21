import ProductList from "@/components/product-list";
import { type Category, getProduct } from "@/lib/get-products";

interface Props {
  params: {
    category: Category;
  };
}

const Category = async ({ params }: Props) => {
  const { category } = await params;

  const products = await getProduct(category);

  const titles: Record<string, string> = {
    movies: "MOVIES",
    celebrities: "CELEBRITIES",
    cats: "CATS",
    darkhumor: "DARK HUMOR",
  };

  return (
    <div className="pb-8">
      <div className=" leading-none tracking-tight text-foreground text-center mb-8 relative">
        <h1 className="text-3xl font-bold">{titles[category]}</h1>
      </div>
      <ProductList products={products}></ProductList>
    </div>
  );
};

export default Category;
