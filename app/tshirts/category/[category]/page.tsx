import CategoryPage from "@/components/CategoryPage";
import { type Category } from "@/lib/get-products";

interface Props {
  params: {
    category: Category;
  };
}

const Category = async ({ params }: Props) => {
  const { category } = await params;

  return <CategoryPage category={category} type="tshirts" />;
};

export default Category;
