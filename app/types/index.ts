import {Address, OrderItem, PaymentInfo, UserType} from '@prisma/client';

type ProductImage = {
   id: string;
   productId: string;
   public_id: string;
   url: string;
   owner_email: string;
};

export type Comment = {
   id: string;
   userId: string;
   owner: {
      image: string;
      name: string;
   };
   rating: number;
   comment: string;
   productId: string;
   createdAt: Date;
};

type Product = {
   id: string;
   name: string;
   slug: string;
   description: string;
   price: number;
   productImages: ProductImage[];
   productImage: string;
   category: string;
   seller: string;
   stock: number;
   ratings: number;
   roundedRating: number;
   comments: Comment[];
   owner_id: string;
   createdAt: Date;
   updatedAt: Date;
};

type User = {
   id: string;
   name: string;
   username: string;
   email: string;
   emailVerified: Date;
   image: string;
   profilePic: {
      id: string;
      public_id: string;
      url: string;
   };
   role: UserType;
   password: string;
   createdAt: Date;
   updatedAt: Date;
};

export interface UserOrderType {
   id: string;
   orderStatus: string;
   shippingInfoId: string;
   userId: string;
   paymentInfoId: string;
   createdAt: Date;
   updatedAt: Date;
   shippingInfo: Address;
   user: SafeUser;
   paymentInfo: PaymentInfo;
   orderItems: OrderItem[];
}

export type SafeUser = Omit<
   User,
   'createdAt' | 'updatedAt' | 'emailVerified'
> & {
   createdAt: string;
   updatedAt: string;
   emailVerified: string | null;
};

export type SafeProduct = Omit<Product, 'createdAt'> & {
   createdAt: string;
   updatedAt: string;
};
