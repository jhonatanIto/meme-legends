import { ProductDetail } from "@/components/product-detail";
import { getProduct } from "@/lib/get-products";

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const productList = await getProduct();
  const product = productList.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Not Found</div>;
  }

  const recomendedList = await getProduct(product.category);

  return (
    <ProductDetail
      product={product}
      recomendedList={recomendedList.slice(0, 3)}
      colors={product.images}
    />
  );
};

export default Product;
