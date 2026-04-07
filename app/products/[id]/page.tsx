import { ProductDetail } from "@/components/product-detail";
import { stripe } from "@/lib/stripe";

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await stripe.products.retrieve(id, {
    expand: ["default_price"],
  });

  const plainProduct = JSON.parse(JSON.stringify(product));
  return <ProductDetail product={plainProduct} />;
};

export default Product;
