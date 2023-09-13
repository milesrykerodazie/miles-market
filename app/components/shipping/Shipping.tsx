"use client";
import {
  selectCartItems,
  selectCheckoutInfo,
} from "@/app/state-management/features/cartSlice";
import { useAppSelector } from "@/app/state-management/hooks";
import { Address, UserType } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { BiCurrentLocation } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";

interface UserAddressProps {
  userAddresses: Address[];
  role: UserType;
}

const Shipping: FC<UserAddressProps> = ({ userAddresses, role }) => {
  //the router
  const route = useRouter();
  //getting the cartItems
  const cartItems = useAppSelector(selectCartItems);
  const checkoutInfo = useAppSelector(selectCheckoutInfo);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  const handleAddressClick = (address: Address) => {
    setSelectedAddress(address?.id);
  };

  const handleRadioChange = (address: Address) => {
    setSelectedAddress(address?.id);
  };

  //checkout handler
  const checkoutHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setCheckingOut(true);
    if (selectedAddress === "") {
      toast.error("Please select your shipping address");
      return;
    }

    //go to stripe checkout page
    try {
      const response = await axios.post("/api/orders/checkout_session", {
        items: cartItems,
        shippingInfo: selectedAddress,
      });
      console.log("the response => ", response?.data);
      route.push(response?.data?.url);
    } catch (error) {
      console.log(error);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <section className="py-2 bg-primary dark:bg-white trans rounded-lg">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-bold lg:text-2xl text-white dark:text-primary trans">
            Shipping Checkout
          </h2>
        </div>
      </section>
      <section className="py-10 bg-white md:drop-shadow-md text-primary md:rounded-md">
        <div className="w-full lg:max-w-screen-xl mx-auto lg:px-4">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
            <main className="w-full lg:w-2/3">
              <article className="border-b lg:border lg:border-gray-200 bg-white lg:shadow-sm lg:rounded pb-3 md:p-2 lg:p-6 mb-5">
                <h2 className="md:text-xl font-semibold mb-5">
                  Shipping information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {userAddresses?.map((address) => (
                    <label
                      key={address?.id}
                      className="flex p-2 md:p-3 border border-primary/80 rounded-md bg-white hover:border-primary trans cursor-pointer"
                      onClick={() => handleAddressClick(address)}
                    >
                      <span>
                        <input
                          name="shipping"
                          type="radio"
                          className="mt-1 w-3 h-3 md:w-4 md:h-4 focus:accent-primary text-primary "
                          checked={address?.id === selectedAddress}
                          onChange={() => handleRadioChange(address)}
                        />
                      </span>
                      <p className="ml-2 text-sm md:text-base">
                        <span className="font-semibold">
                          {" "}
                          {address.country}
                        </span>
                        <small className="block text-xs md:text-sm text-primary font-light capitalize">
                          {address.state}, {address.city},
                          <br />
                          {address.street}
                          <br />
                          {address.phoneNo}
                        </small>
                      </p>
                    </label>
                  ))}
                </div>
                {userAddresses?.length < 3 && (
                  <Link
                    href={
                      role === "ADMIN"
                        ? "/admin-dashboard/address/new"
                        : role === "USER"
                        ? "/user-dashboard/address/new"
                        : "/"
                    }
                    className="px-4 py-2 inline-flex gap-2 items-center text-primary border border-primary/80 rounded-md bg-white trans"
                  >
                    <BiCurrentLocation className="md:w-6 md:h-6 w-4 h-4" />{" "}
                    <span className="text-sm">Add new address</span>
                  </Link>
                )}

                <div className="flex justify-end space-x-2 mt-10">
                  <Link
                    href="/cart"
                    className="px-5 py-2 inline-block text-primary bg-white drop-shadow-md  rounded-md text-sm md:text-base "
                  >
                    Back
                  </Link>
                  <button
                    className="px-5 py-2 inline-block text-white bg-primary  rounded-md cursor-pointer text-sm md:text-base"
                    onClick={checkoutHandler}
                  >
                    {checkingOut ? (
                      <div className="gap-2 flex items-center justify-center">
                        <span className="text-sm animate-pulse">
                          processing...
                        </span>
                        <FaSpinner className="animate-spin" />
                      </div>
                    ) : (
                      "checkout"
                    )}
                  </button>
                </div>
              </article>
            </main>
            <aside className="w-full lg:w-1/3 text-primary md:p-2">
              <article className="max-w-full lg:max-w-[350px]">
                <h2 className="md:text-lg font-semibold mb-3">Summary</h2>
                <ul>
                  <li className="flex justify-between mb-1 text-sm md:text-base">
                    <span>Amount:</span>
                    <span>${checkoutInfo?.amount}</span>
                  </li>
                  <li className="flex justify-between mb-1 text-sm md:text-base">
                    <span>Est TAX:</span>
                    <span>${checkoutInfo?.tax}</span>
                  </li>
                  <li className="border-t flex justify-between mt-3 pt-3">
                    <span>Total Amount:</span>
                    <span className=" font-bold">
                      ${checkoutInfo?.totalAmount}
                    </span>
                  </li>
                </ul>

                <hr className="my-4" />

                <h2 className="md:text-lg font-semibold mb-3">Items in cart</h2>
                {cartItems?.length > 0 && (
                  <div className="h-auto max-h-[300px] overflow-y-auto pt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2">
                    {cartItems?.map((item) => (
                      <div
                        key={item?.slug}
                        className="flex items-center mb-4 leading-5"
                      >
                        <div key={item?.slug}>
                          <div className="block relative w-12 h-12 md:w-16 md:h-16 rounded p-1 border border-gray-200">
                            <img
                              src={item?.productImage}
                              alt="Title"
                              className="w-full h-full"
                            />
                            <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-medium text-center flex items-center justify-center text-white bg-primary rounded-full">
                              {item?.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <Link
                            href={`/product/${item?.slug}`}
                            className="font-semibold text-sm"
                          >
                            {item?.name.substring(0, 10)}
                          </Link>
                          <p className="mt-1 text-primary font-light text-xs">
                            Total: ${item.quantity * item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;
