"use client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Rating {
  id: string;
  rating: number;
  review: string;
  user: {
    name: string;
    image: string;
  };
  productId: string;
  createdAt: Date;
  product: {
    name: string;
    category: string;
    id: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: string[];
  category: string;
  storeId: string;
  inStock: boolean;
  rating: Rating[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const [selectedTab, setSelectedTab] = useState<"Description" | "Reviews">("Description");

  return (
    <div className="my-18 text-sm text-slate-600">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
        {(["Description", "Reviews"] as const).map((tab, index) => (
          <button
            className={`${
              tab === selectedTab
                ? "border-b-[1.5px] font-semibold"
                : "text-slate-400"
            } px-3 py-2 font-medium`}
            key={index}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description */}
      {selectedTab === "Description" && (
        <p className="max-w-xl">{product.description}</p>
      )}

      {/* Reviews */}
      {selectedTab === "Reviews" && (
        <div className="flex flex-col gap-3 mt-14">
          {product.rating.map((item, index) => (
            <div key={index} className="flex gap-5 mb-10">
              <Image
                src={item.user.image}
                alt=""
                className="size-10 rounded-full"
                width={100}
                height={100}
              />
              <div>
                <div className="flex items-center">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={18}
                        className="text-transparent mt-0.5"
                        fill={item.rating >= index + 1 ? "#00C950" : "#D1D5DB"}
                      />
                    ))}
                </div>
                <p className="text-sm max-w-lg my-4">{item.review}</p>
                <p className="font-medium text-slate-800">{item.user.name}</p>
                <p className="mt-3 font-light">
                  {new Date(item.createdAt).toDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
