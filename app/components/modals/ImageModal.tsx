"use client";
import { FC, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface ProductImages {
  id: string;
  public_id: string;
  url: string;
  productId: string;
  owner_email: string;
}

interface ModalProps {
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
  images: ProductImages[];
}

const ImageModal: FC<ModalProps> = ({ setPreview, images }) => {
  return (
    <div className="modal">
      <button
        onClick={() => setPreview(false)}
        className="absolute top-2 right-4"
      >
        <IoMdClose className="text-white" />
      </button>

      <div className="project_modal_wrapper">
        <Carousel infiniteLoop={true}>
          {images?.map((image) => (
            <div key={image?.id}>
              <img
                src={image?.url}
                className="object-cover rounded-lg w-full h-[600px] md:h-[750px] lg:h-[800px] trans"
                alt="product-img"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ImageModal;
