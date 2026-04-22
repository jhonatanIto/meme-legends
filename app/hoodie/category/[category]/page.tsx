import CategoryPage from "@/components/CategoryPage";
import { type Category } from "@/lib/get-products";

interface Props {
  params: {
    category: Category;
  };
}

const page = async ({ params }: Props) => {
  const { category } = await params;
  return <CategoryPage category={category} type="hoodie" />;
};

export default page;
