"use client";

import { SafeProduct } from "@/app/types";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import StarRatings from "react-star-ratings";
import { addItemToCart } from "../../state-management/features/cartSlice";
import { useAppDispatch } from "../../state-management/hooks";

interface ProductProp {
  product: SafeProduct;
}

const ProductItem: FC<ProductProp> = ({ product }) => {
  //dispatch
  const dispatch = useAppDispatch();
  //items to add to cart
  const item = {
    productId: product?.id,
    name: product?.name,
    slug: product?.slug,
    price: product?.price,
    productImage: product?.productImage,
    stock: product?.stock,
    seller: product?.seller,
    quantity: 1,
  };
  return (
    <article
      className={`border border-primary overflow-hidden bg-primarywhite shadow-md shadow-primary rounded mb-5 ${
        product?.stock < 1 ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        <Link
          href={`/product/${product.slug}`}
          className="flex flex-col lg:flex-row lg:w-3/4"
        >
          <div className=" lg:w-[30%] flex p-3">
            <div className="relative w-full">
              <img
                src={
                  product?.productImage
                    ? product?.productImage
                    : "/images/no-photo-available.png"
                }
                alt="product name"
                className="w-full h-60 object-cover lg:w-44 lg:h-44"
              />
            </div>
          </div>
          <div className="lg:w-[70%]">
            <div className="p-4">
              <Link
                href={`/product/${product.slug}`}
                className="text-primary hover:text-primary/70 trans font-semibold"
              >
                {product.name}
              </Link>
              <div className="flex flex-wrap items-center space-x-2 mb-2">
                <div className="ratings">
                  <div className="my-1">
                    <StarRatings
                      rating={product.ratings}
                      starRatedColor="#facc15"
                      numberOfStars={5}
                      starDimension="18px"
                      starSpacing="1px"
                      name="rating"
                    />
                  </div>
                </div>
                <b className="text-primary">•</b>
                <span className="ml-1 text-yellow-400 font-semibold">
                  {product?.ratings}
                </span>
              </div>
              <p className="text-primary mb-2">
                {product?.description.substring(0, 150)}...
              </p>
            </div>
          </div>
        </Link>
        <div className="lg:w-1/4 border-t lg:border-t-0 border-primary/60">
          <div className="p-5 flex flex-row lg:flex-col justify-between items-center lg:justify-start ">
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-primary">
                ${product?.price}
              </span>

              <p className="text-primary">Free Shipping</p>
            </div>
            {product?.stock > 0 && (
              <div className="my-3">
                <span
                  onClick={() => dispatch(addItemToCart(item))}
                  className="px-4 py-2 inline-block text-primarywhite bg-primary border border-transparent rounded-md hover:bg-primary/80 cursor-pointer"
                >
                  {" "}
                  Add to Cart{" "}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
