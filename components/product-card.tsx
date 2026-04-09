import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Product } from "@/lib/get-products";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const price = product.price;

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
        {product.imageUrl && (
          <div className="relative h-75 w-full">
            <Image
              alt={product.name}
              src={product.imageUrl}
              layout="fill"
              objectFit="cover"
              className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
            />
          </div>
        )}

        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-gray-800">
            {product.name}
          </CardTitle>
          <CardContent className="p-4 grow flex flex-col justify-between">
            {product.description && (
              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>
            )}
            {price && (
              <p className="text-lg font-semibold text-gray-900">
                ${(price / 100).toFixed(2)}
              </p>
            )}

            <Button className="mt-4 bg-blue-500 text-white cursor-pointer">
              {" "}
              View Details{" "}
            </Button>
          </CardContent>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ProductCard;
