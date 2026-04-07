import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/product-list";
import { getProduct } from "@/lib/get-products";

interface Props {
  params: {
    category: string;
  };
}

const Category = async ({ params }: Props) => {
  const { category } = await params;

  const products = await getProduct(category);

  const titles: Record<string, string> = {
    tshirt: "T-Shirts",
    mug: "Mugs",
    phonecase: "Phone Cases",
    notebook: "Notebooks",
    mousepad: "MousePads",
    pillow: "Pillows",
    underwear: "Underwears",
  };

  return (
    <div className="pb-8">
      <div className=" leading-none tracking-tight text-foreground text-center mb-8 relative">
        <h1 className="text-3xl font-bold">{titles[category]}</h1>
        <CategoryList />
      </div>
      <ProductList products={products}></ProductList>
    </div>
  );
};

export default Category;
