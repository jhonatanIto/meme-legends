import { ProductDetail } from "@/components/product-detail";
import { getProducts, productType } from "@/lib/get-products";

interface Props {
  id: number;
  type: productType;
}

const ProductSelec = async ({ id, type }: Props) => {
  const productList = await getProducts(type);
  const product = productList.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Not Found</div>;
  }

  const List = await getProducts("tshirts", product.category ?? undefined);
  const recomendedList = List.filter((l) => l.id !== Number(id)).filter(
    (c) => c.category === product.category,
  );

  return (
    <ProductDetail
      product={product}
      recomendedList={recomendedList.slice(0, 4)}
      colors={product.images}
    />
  );
};

export default ProductSelec;
